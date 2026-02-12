"use client";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useRef, useState } from "react";
import { ArrowBigUp, ChevronLeft, MessageCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import CommentSection from "./comment-section";
import AttachmentPreview from "@/components/common/attachment-preview";
import { SnowProfile } from "@/components/common/snow-profile";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import ThumbnailRenderer from "@/components/common/thumbnail-renderer";

import ReplyBox from "@/widgets/groups/_shared/post/reply-box";
import useCommentData from "@/widgets/groups/_shared/hooks/use-comment-data";

import { BreadcrumbItem, CommentTrailType, Group } from "@/lib/types/groups";
import { useGetCommentDetails, useUndoUpvoteComment } from "@/lib/api/group";
import { useUpvoteComment } from "@/lib/api/group";
import { extractAndRemoveImages } from "@/lib/utils";
import { useUserState } from "@/lib/store/account";

import JoinGroupModal from "../../../../../../../_shared/post/modals/join-group-modal";
import Image from "next/image";
import useScrollToTopOnMount from "@/hooks/use-scroll-view-to-top";

interface PostThreadSectionProps {
	type: "preview" | "detail";
	groupId: string;
	notAMember: boolean;
	group: Group;
}

const PostThreadSection: React.FC<PostThreadSectionProps> = ({
	type,
	groupId,
	notAMember,
	group,
}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();

	const commentId = searchParams.get("commentId");
	const justReplied = searchParams?.get("justReplied");

	const [comments, setComments] = useState<number>(0);
	const [postVoteCount, setPostVoteCount] = useState<number>(0);
	const [commentVoteCount, setCommentVoteCount] = useState<number>(0);
	const [openJoinModal, setOpenJoinModal] = useState<boolean>(false);
	const [hasUpvotedPost, setHasUpvotedPost] = useState<
		"idle" | "upvoted" | "downvoted"
	>("idle");
	const [hasUpvotedComment, setHasUpvotedComment] = useState<
		"idle" | "upvoted" | "downvoted"
	>("idle");

	const [activeCommentId, setActiveCommentId] = useState<string | null>(
		justReplied ? "" : commentId
	);

	const commentRef = useRef<HTMLDivElement>(null);
	const stickyRef = useRef<HTMLDivElement>(null);

	const userState = useUserState();
	const { mutate: upvoteComment } = useUpvoteComment();
	const { mutate: undoUpvoteComment } = useUndoUpvoteComment();

	const handleVote = async (
		e: React.MouseEvent,
		id: string,
		type: string
	) => {
		e.stopPropagation();

		if (type === "post") {
			setHasUpvotedPost("upvoted");
			setPostVoteCount((prev) => prev + 1);
		} else {
			setHasUpvotedComment("upvoted");
			setCommentVoteCount((prev) => prev + 1);
		}

		upvoteComment(
			{ parentId: id || "" },
			{
				onError: () => {
					if (type === "post") {
						setHasUpvotedPost("downvoted");
						setPostVoteCount((prev) => (prev < 0 ? -1 : prev - 1));
					} else {
						setHasUpvotedComment("downvoted");
						setCommentVoteCount((prev) =>
							prev < 0 ? -1 : prev - 1
						);
					}
				},
				onSuccess: async () => {
					await queryClient.invalidateQueries([
						"comment-detail",
						commentId,
					]);
					setHasUpvotedPost("idle");
					setHasUpvotedComment("idle");
					setPostVoteCount(0);
				},
			}
		);
	};

	const handleUndoUpVote = async (
		e: React.MouseEvent,
		id: string,
		type: string
	) => {
		e.stopPropagation();

		if (type === "post") {
			setHasUpvotedPost("downvoted");
			setPostVoteCount((prev) => (prev < 0 ? -1 : prev - 1));
		} else {
			setHasUpvotedComment("downvoted");
			setCommentVoteCount((prev) => (prev < 0 ? -1 : prev - 1));
		}

		undoUpvoteComment(
			{ parentId: id || "" },
			{
				onError: () => {
					if (type === "post") {
						setHasUpvotedPost("upvoted");
						setPostVoteCount((prev) => prev + 1);
					} else {
						setHasUpvotedComment("upvoted");
						setCommentVoteCount((prev) => prev + 1);
					}
				},
				onSuccess: async () => {
					await queryClient.invalidateQueries([
						"comment-detail",
						commentId,
					]);
					setHasUpvotedPost("idle");
					setHasUpvotedComment("idle");
					setPostVoteCount(0);
				},
			}
		);
	};

	const { data, isLoading, isError } = useGetCommentDetails({
		commentId: commentId as string,
		page: 1,
		limit: 10,
	});

	const handleCommentClick = (e: React.MouseEvent, id: string) => {
		if (notAMember && group.type === "public") setOpenJoinModal(true);
		if (notAMember) return;
		e.stopPropagation();
		setActiveCommentId((prevId) => (prevId === id ? null : id));
	};

	const {
		postData,
		parentTrail,
		childTrail,
		commentInView,
		// updateCommentData,
	} = useCommentData(data as CommentTrailType);

	const { cleanedContent: postCleanedContent, images: postImages } =
		extractAndRemoveImages(postData?.content || "");
	const { cleanedContent: commentCleanedContent, images: commentImages } =
		extractAndRemoveImages(commentInView?.content || "");

	const postAttachments = {
		attachments: [...(postData?.attachments || []), ...postImages],
	};
	const commentAttachments = {
		attachments: [...(commentInView?.attachments || []), ...commentImages],
	};

	const breadcrumbsData: BreadcrumbItem[] = [
		{
			label: `${postData?.creator.firstName} ${postData?.creator.lastName}`,
			action: () => {
				router.push(
					`/groups/${groupId}?tab=forum&postview=post&postId=${postData?.commentId}`
				);
			},
			isActive: false,
		},
		{
			label: `${commentInView?.creator.firstName} ${commentInView?.creator.lastName}`,
			action: () => {
				router.push(
					`/groups/${groupId}?tab=forum&postview=comment&commentId=${commentInView?.commentId}`
				);
			},
			isActive: true,
		},
	];

	function updateBreadcrumbs(breadcrumbsData: BreadcrumbItem[]) {
		if (!parentTrail) return [];

		const newData = parentTrail.map((item) => {
			return {
				label: `${item.creator.firstName} ${item.creator.lastName}`,
				action: () => {
					router.push(
						`/groups/${groupId}?tab=forum&postview=comment&commentId=${item.commentId}`
					);
				},
				isActive: false,
				comment: item.content,
			};
		});
		breadcrumbsData.splice(1, 0, ...newData);
		return breadcrumbsData;
	}

	const handleAddComment = (response?: any) => {
		// const updatedData = {
		// 	...response,
		// 	comments: [],
		// 	trails: [
		// 		{
		// 			...commentInView,
		// 			comments: [],
		// 		},
		// 		...(commentInView?.trails || []),
		// 	],
		// };
		setActiveCommentId(null);
		if (response?.parentId === commentInView?.commentId) {
			queryClient.invalidateQueries([
				"comment-detail",
				commentInView?.commentId,
			]);
		} else {
			queryClient.invalidateQueries(["comment-detail", commentId]);
		}
		setComments(comments + 1);
		// queryClient.invalidateQueries(["comment-detail", commentId]);
		queryClient.invalidateQueries(["get-post", postData?.commentId]);
		queryClient.invalidateQueries([
			"get-top-posts",
			postData?.commentId,
			10,
		]);
		queryClient.invalidateQueries([
			"get-trending-posts",
			postData?.commentId,
			10,
		]);
		queryClient.invalidateQueries([
			"get-recent-posts",
			postData?.commentId,
			10,
		]);
	};

	const updatedBreadcrumbs = updateBreadcrumbs(breadcrumbsData);
	const postUpvoted =
		hasUpvotedPost === "idle"
			? postData?.hasUpvoted
			: hasUpvotedPost === "upvoted";

	const commentUpvoted =
		hasUpvotedComment === "idle"
			? commentInView?.hasUpvoted
			: hasUpvotedComment === "upvoted";

	const postVoteActualCount =
		hasUpvotedPost === "idle"
			? postData?.upvotes
			: postVoteCount + (postData?.upvotes || 0);

	const commentVoteActualCount =
		hasUpvotedComment === "idle"
			? commentInView?.upvotes
			: commentVoteCount + (commentInView?.upvotes || 0);

	const voteComment = (e: React.MouseEvent, cId: string, type: string) => {
		if (notAMember && group.type === "public") setOpenJoinModal(true);
		if (notAMember) return;
		const voteStatus = type === "post" ? postUpvoted : commentUpvoted;
		if (voteStatus) {
			handleUndoUpVote(e, cId as string, type);
		} else {
			handleVote(e, cId as string, type);
		}
	};

	const goToCreateGroupsPost = () =>
		router.push(
			`/groups/${groupId}?tab=forum&postview=post&postId=${commentInView?.parentId}`
		);

	useEffect(() => {
		if (!justReplied) setActiveCommentId(commentId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [commentId]);

	useEffect(() => {
		const scrollToComment = () => {
			if (commentRef.current) {
				commentRef.current.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		};

		const timeoutId = setTimeout(() => {
			scrollToComment();
		}, 0);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [commentInView]);

	useScrollToTopOnMount("detail");

	if (isLoading && !justReplied) {
		return <PageLoading className="rounded-2xl" color="#ffffff" />;
	}

	if (isError) {
		return <PageError className="h-[85vh] rounded-2xl" />;
	}

	return (
		<div className="relative  flex h-full w-full flex-col pt-0">
			{/* <div className=" mb-4 w-full cursor-pointer overflow-visible"> */}
			<div
				className="fixed top-[70px] z-[100000]  w-full !border-white/20 bg-ink-darkest/70 from-white via-transparent to-white px-3 py-2 backdrop-blur-sm md:px-0 md:py-4 "
				ref={stickyRef}
			>
				{postData?.creator?.image ? (
					<Breadcrumbs items={updatedBreadcrumbs} />
				) : (
					<span
						className="flex cursor-pointer items-center gap-2"
						onClick={goToCreateGroupsPost}
					>
						<ChevronLeft size={18} className="text-[#FFFFFF]/50" />
						<p className="text-sm font-bold text-[#FFFFFF]">Back</p>
					</span>
				)}
			</div>
			<div
				className={`scrollable-container relative flex w-full flex-col overflow-scroll rounded-none !border-none !bg-none !px-3 !pt-[3rem] pb-[10rem] max-sm:h-full md:rounded-[30px] md:!border-[#9BDCFD] ${type === "detail" ? "overflow-hidden" : ""}`}
			>
				<div>
					{postData?.title && (
						<div className=" flex h-fit w-full flex-col gap-2">
							{/* Initial post */}

							<div
								className={`relative flex h-full items-start gap-2`}
							>
								<div className=" h-full">
									<SnowProfile
										src={postData?.creator?.image}
										score={
											parseInt(
												postData?.creator
													?.nftTokenNumber || ""
											) || 0
										}
										size="sm"
										className="!h-fit rounded-full object-cover"
										url={`/members/${postData?.creator?._id}`}
									/>
								</div>
								<div className="absolute left-[22px] top-6 -z-10 min-h-full -translate-x-1/2 transform border-l border-white/20"></div>

								<div className="flex w-full flex-col gap-3 pb-2 md:pb-4">
									<div className="flex flex-col items-start justify-center">
										<h2 className="text-left text-base font-bold text-white md:text-lg">
											{postData?.creator?.firstName}{" "}
											{postData?.creator?.lastName}
										</h2>
										<p className="font-mono text-xs capitalize text-[#FFFFFF80] md:text-sm">
											{postData?.creator?.title ||
												"Builder"}
										</p>
									</div>

									<div className="flex w-full flex-col items-start justify-between gap-2 md:gap-3">
										<h2
											className={`w-full text-base font-bold text-lemon-green md:text-2xl`}
											title={postData?.title}
											ref={commentRef}
										>
											{postData?.title}
										</h2>
										<span
											className="font-circular text-sm font-normal text-[#FFFFFFCC] md:text-base"
											dangerouslySetInnerHTML={{
												__html: postCleanedContent,
											}}
										></span>
										<ThumbnailRenderer
											content={postData?.content || ""}
										/>
										{postAttachments?.attachments &&
											postAttachments?.attachments
												?.length > 0 && (
												<div
													onClick={(e) =>
														e.stopPropagation()
													}
													className={`grid w-full grid-cols-1 gap-1 rounded-2xl ${postAttachments?.attachments?.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
												>
													{postAttachments?.attachments?.map(
														(attachment, index) => {
															if (!attachment)
																return;
															return (
																<AttachmentPreview
																	key={index}
																	attachment={
																		attachment
																	}
																	className={`${postAttachments?.attachments?.length === index + 1 && postAttachments?.attachments.length % 2 !== 0 ? "col-span-2" : "col-span-1"}`}
																/>
															);
														}
													)}
												</div>
											)}

										<div className="flex w-full cursor-pointer justify-start gap-4 pt-1 font-bold">
											<div
												className={`flex cursor-pointer items-center gap-1 py-1 pr-3  text-xs text-white md:px-3 md:py-2 md:text-sm ${
													postData?.creator?._id ===
													userState?._id
														? "cursor-text"
														: "cursor-pointer"
												}`}
												onClick={(e) => {
													if (
														postData?.creator
															?._id !==
														userState?._id
													) {
														voteComment(
															e,
															postData?.commentId as string,
															"post"
														);
													}
												}}
											>
												{postData?.creator?._id !==
													userState?._id && (
													<ArrowBigUp
														height={20}
														width={18}
														fill={`${
															postUpvoted
																? "#CCF975"
																: "transparent"
														}`}
														stroke={"#CCF975"}
													/>
												)}
												<span className="leading-none">
													Vote ({postVoteActualCount})
												</span>
											</div>
											<div
												className={`flex cursor-pointer items-center gap-1 py-2 pr-3 text-xs text-white md:px-3 md:py-3 md:text-sm ${
													postData?.creator?._id ===
													userState?._id
														? "cursor-text"
														: "cursor-pointer"
												}`}
												onClick={(e) => {
													if (
														postData?.creator
															?._id !==
														userState?._id
													) {
														handleCommentClick(
															e,
															postData?.commentId as string
														);
													}
												}}
											>
												{postData?.creator?._id !==
													userState?._id && (
													<MessageCircle
														height={14}
														width={18}
														fill={`${"transparent"}`}
														stroke={`${"#CCF975"}`}
													/>
												)}
												<span className="leading-none">
													Comment (
													{postData?.commentCount})
												</span>
											</div>
										</div>

										{activeCommentId ===
											postData?.commentId && (
											<ReplyBox
												onSubmit={handleAddComment}
												parentId={postData?.commentId}
												isVisible={
													activeCommentId ===
													postData?.commentId
												}
												onClose={() =>
													setActiveCommentId(null)
												}
											/>
										)}
										<div className="h-[2px]"></div>
									</div>
								</div>
							</div>
						</div>
					)}
					{/* Parent Trail */}
					{type === "detail" && (
						<CommentSection
							comments={parentTrail}
							onAddComment={handleAddComment}
							view="trail"
							groupId={groupId}
							notAMember={notAMember}
							group={group}
						/>
					)}
				</div>
				{/* Comment in view  scroll here on mount*/}
				<div
					id="activeComment"
					className=" flex h-fit w-full flex-col border-b border-[#FFFFFF33] pb-2 md:pb-4"
				>
					<div
						className={`relative flex w-full items-start gap-2 pt-3 md:pt-4`}
					>
						<div className="relative h-full">
							{/* Image */}
							<SnowProfile
								src={commentInView?.creator?.image}
								score={
									parseInt(
										commentInView?.creator
											?.nftTokenNumber || ""
									) || 0
								}
								size="sm"
								className="!h-fit rounded-full object-cover"
							/>
						</div>

						{activeCommentId === commentInView?.commentId &&
							commentInView?.creator?._id !== userState?._id && (
								<div className="absolute left-[22px] top-12 -z-10 min-h-full -translate-x-1/2 transform border-l border-white/20"></div>
							)}

						<div className="flex w-full flex-col gap-3 pb-2 md:pb-4">
							<div className="flex flex-col items-start justify-center">
								<h2 className="text-left text-base font-bold text-white md:text-lg">
									{commentInView?.creator?.firstName}{" "}
									{commentInView?.creator?.lastName}
								</h2>
								<p className="font-mono text-xs capitalize text-[#FFFFFF80] md:text-sm">
									{commentInView?.creator?.title || "Builder"}
								</p>
							</div>

							<div className="flex w-full flex-col items-start justify-between gap-2">
								<span
									className="font-circular text-sm font-normal text-[#FFFFFFCC] md:text-base"
									dangerouslySetInnerHTML={{
										__html: commentCleanedContent,
									}}
								></span>
								<ThumbnailRenderer
									content={commentInView?.content || ""}
								/>
								{commentAttachments?.attachments &&
									commentAttachments?.attachments?.length >
										0 && (
										<div
											className={`grid w-full grid-cols-1 gap-1 rounded-2xl ${commentAttachments?.attachments?.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"}`}
										>
											{commentAttachments?.attachments?.map(
												(attachment, index) => (
													<AttachmentPreview
														key={index}
														attachment={attachment}
													/>
												)
											)}
										</div>
									)}

								<div className="flex w-full cursor-pointer justify-start gap-4 font-bold md:gap-8">
									<div
										className={`flex cursor-pointer items-center gap-1 py-1 pr-3 text-xs text-white md:px-3 md:py-2 md:text-sm ${
											commentInView?.creator?._id ===
											userState?._id
												? "cursor-text"
												: "cursor-pointer"
										}`}
										onClick={(e) => {
											if (
												commentInView?.creator?._id !==
												userState?._id
											) {
												voteComment(
													e,
													commentInView?.commentId as string,
													"comment"
												);
											}
										}}
									>
										{commentInView?.creator?._id !==
											userState?._id && (
											<ArrowBigUp
												height={20}
												width={18}
												fill={`${
													commentUpvoted
														? "#CCF975"
														: "transparent"
												}`}
												stroke={`${"#CCF975"}`}
											/>
										)}
										<span className="leading-none">
											Vote ({commentVoteActualCount})
										</span>
									</div>
									<div
										className={`md: flex cursor-pointer items-center gap-1 py-1 pr-3 text-xs text-white md:px-3 md:py-3 md:text-sm ${
											commentInView?.creator?._id ===
											userState?._id
												? "cursor-text"
												: "cursor-pointer"
										}`}
										onClick={(e) => {
											if (
												commentInView?.creator?._id !==
												userState?._id
											) {
												handleCommentClick(
													e,
													commentInView?.commentId as string
												);
											}
										}}
									>
										{commentInView?.creator?._id !==
											userState?._id && (
											<MessageCircle
												height={14}
												width={18}
												fill={"transparent"}
												stroke={"#CCF975"}
											/>
										)}
										<span className="leading-none">
											Comment (
											{commentInView?.commentCount})
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					{activeCommentId === commentInView?.commentId &&
						commentInView?.creator?._id !== userState?._id &&
						!notAMember && (
							<ReplyBox
								onSubmit={handleAddComment}
								parentId={commentInView?.commentId}
								isVisible={
									activeCommentId === commentInView?.commentId
								}
								onClose={() => setActiveCommentId(null)}
								noBorder={true}
							/>
						)}
				</div>
				{type === "detail" && (
					<div className="mb-20 h-fit w-full">
						<CommentSection
							comments={childTrail}
							onAddComment={() => {}}
							view="trail-comment"
							groupId={groupId}
							notAMember={notAMember}
							group={group}
						/>
					</div>
				)}{" "}
				<div className=" bottom-10 left-0 right-0 mb-[20] mt-1 flex w-full flex-col items-center justify-center">
					<Image
						src={"/icons/no-comment-tech-logo.svg"}
						alt="no-comment-arrow-icon"
						width={24}
						height={20}
						className=" bottom-10 mt-4 items-center justify-center"
					/>
				</div>
			</div>
			{/* </div> */}
			<JoinGroupModal
				group={group}
				isOpen={openJoinModal}
				onOpenChange={(e) => setOpenJoinModal(e)}
			/>
		</div>
	);
};

export default PostThreadSection;
