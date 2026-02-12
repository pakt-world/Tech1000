"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useState, useMemo } from "react";
import { ArrowBigUp, MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { convertDate, extractAndRemoveImages } from "@/lib/utils";
import { useUpvoteComment } from "@/lib/api/group";
import { useUserState } from "@/lib/store/account";
import {
	useGetCommentsInfinitely,
	useUndoUpvoteComment,
} from "@/lib/api/group";
import CardView from "@/components/common/card-view";
import { SnowProfile } from "@/components/common/snow-profile";
import { Spinner } from "@/components/common/loader";
import ThumbnailRenderer from "@/components/common/thumbnail-renderer";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import CommentSection from "./comment-section";
import ReplyBox from "@/widgets/groups/_shared/post/reply-box";
import AttachmentPreview from "@/components/common/attachment-preview";
import { Comment, Group, GroupPost } from "@/lib/types/groups";
import JoinGroupModal from "../../../../../../../_shared/post/modals/join-group-modal";
import DeletePostModal from "@/widgets/groups/_shared/post/modals/delete-post-modal";
import useScrollToTopOnMount from "@/hooks/use-scroll-view-to-top";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface PostCardComponentProps {
	post: GroupPost;
	type: "preview" | "detail";
	groupId: string;
	group: Group;
	lastItem: boolean;
}

const PostCardComponent: React.FC<PostCardComponentProps> = ({
	post,
	type,
	groupId,
	group,
	lastItem,
}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const userState = useUserState();
	const [comments, setComments] = useState<number>(post?.commentCount);
	const [voteCount, setVoteCount] = useState<number>(post?.upvotes || 0);
	const [activeCommentId, setActiveCommentId] = useState<string | null>();
	const [openJoinModal, setOpenJoinModal] = useState<boolean>(false);
	const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
	// const [seeMoreClicked, setSeeMoreClicked] = useState<boolean>(false)
	const [hasUpvoted, setHasUpvoted] = useState<boolean>(
		post?.hasUpvoted || false
	);

	const nabArray = ["user", "invited", "applied"];
	const notAMember = nabArray?.includes(group?.type);

	const goToPostDetailView = () => {
		if (notAMember && group.groupType === "open") setOpenJoinModal(true);
		if (notAMember) return;
		router.push(
			`/groups/${groupId}?tab=forum&postview=post&postId=${post?.postId}`
		);
	};
	const shouldFetch = type === "detail";

	const { mutate: upvoteComment } = useUpvoteComment();
	const { mutate: undoUpvoteComment } = useUndoUpvoteComment();

	const handleVote = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (notAMember && group.groupType === "open") setOpenJoinModal(true);
		if (notAMember) return;
		const previousVoteCount = voteCount;
		setVoteCount((prev) => prev + 1);
		setHasUpvoted(true);
		upvoteComment(
			{ parentId: post?.postId || "" },
			{
				onError: () => {
					setVoteCount(previousVoteCount);
					setHasUpvoted(false);
				},
				onSuccess: () => {
					queryClient.invalidateQueries(["get-post", post?.postId]);
					queryClient.invalidateQueries([
						"get-top-posts",
						post?.postId,
						10,
					]);
					queryClient.invalidateQueries([
						"get-trending-posts",
						post?.postId,
						10,
					]);
					queryClient.invalidateQueries([
						"get-recent-posts",
						post?.postId,
						10,
					]);
				},
			}
		);
	};

	const handleUndoUpVote = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (notAMember && group.type === "public") setOpenJoinModal(true);
		if (notAMember) return;
		const previousVoteCount = voteCount;
		setVoteCount((prev) => (prev < 1 ? 0 : prev - 1));
		setHasUpvoted(false);
		undoUpvoteComment(
			{ parentId: post?.postId || "" },
			{
				onError: () => {
					setVoteCount(previousVoteCount);
					setHasUpvoted(true);
				},
				onSuccess: () => {
					queryClient.invalidateQueries(["get-post", post?.postId]);
					queryClient.invalidateQueries([
						"get-top-posts",
						post?.postId,
						10,
					]);
					queryClient.invalidateQueries([
						"get-trending-posts",
						post?.postId,
						10,
					]);
					queryClient.invalidateQueries([
						"get-recent-posts",
						post?.postId,
						10,
					]);
				},
			}
		);
	};

	const voteComment = (e: React.MouseEvent) => {
		if (notAMember && group.groupType === "open") setOpenJoinModal(true);
		if (notAMember) return;
		if (hasUpvoted) {
			handleUndoUpVote(e);
		} else {
			handleVote(e);
		}
	};

	const {
		data,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetCommentsInfinitely(
		{
			parentId: post?.postId || "",
			page: 1,
			limit: 3,
		},
		shouldFetch
	);

	const handleCommentClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (notAMember && group.groupType === "open") setOpenJoinModal(true);
		if (notAMember) return;
		setActiveCommentId((prevId) =>
			prevId === post?.postId ? null : post?.postId
		);
	};

	const { cleanedContent: postCleanedContent, images: postImages } =
		extractAndRemoveImages(post?.content || "");

	const postAttachments = {
		attachments: [...(post?.attachments || []), ...postImages],
	};

	// const handleSeeMore = () => {
	// 	setSeeMoreClicked(true);
	// 	fetchNextPage();
	// };

	const commentsData = useMemo(
		() => ({
			...data,
			pages: data?.pages?.map((page) => page.data) ?? [],
		}),
		[data]
	);
	const commentList: Comment[] = commentsData?.pages?.flat()
		? commentsData?.pages?.flat()
		: [];

	let currentPage = 1;
	let prevPage = 0;

	//@ts-ignore
	const { observerTarget } = useInfiniteScroll({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: commentsData,
		refetch,
		error: isError ? "Failed to load comments" : "",
	});

	const handleAddComment = () => {
		setActiveCommentId(null);
		setComments(comments + 1);
		queryClient.invalidateQueries(["get-comments", post?.postId, 3]);
		queryClient.invalidateQueries(["get-post", post?.postId]);
		queryClient.invalidateQueries(["get-top-posts", post?.postId, 10]);
		queryClient.invalidateQueries(["get-trending-posts", post?.postId, 10]);
		queryClient.invalidateQueries(["get-recent-posts", post?.postId, 10]);
	};

	useScrollToTop(!shouldFetch);
	useScrollToTopOnMount(type);

	return (
		<>
			<div className="h-full w-full cursor-pointer md:mb-4">
				<CardView
					className={`${lastItem ? "mb-12" : ""} ${type === "detail" ? "!min-h-full" : ""} flex w-full flex-col rounded-none !p-3 md:rounded-[30px] md:!border-[#9BDCFD]`}
				>
					<div
						className="relative flex w-full flex-col gap-4 pb-2 md:border-b md:border-[#FFFFFF33] md:pb-4"
						onClick={goToPostDetailView}
					>
						<div className="flex w-full justify-between">
							<div className="flex items-start gap-2">
								<SnowProfile
									src={post?.creator?.image}
									score={
										parseInt(
											post?.creator?.nftTokenNumber || ""
										) || 0
									}
									size="sm"
									url={`/members/${post?.creator?._id}`}
									className="rounded-full object-fill"
								/>
								<div className="flex flex-col items-start justify-center">
									<h2 className="text-left text-base font-bold text-white md:text-lg">
										{post?.creator?.firstName}{" "}
										{post?.creator?.lastName}
									</h2>
									<p className="font-mono text-xs capitalize text-[#FFFFFF80] md:flex">
										{post?.creator?.title || "Builder"}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<div className="hidden h-fit justify-center rounded-full bg-[#B2E9AA1A] px-3.5 py-1 text-center text-sm text-white md:flex">{`Techscore: ${post?.score}`}</div>
								{type !== "detail" &&
									userState?._id === post?.creator?._id && (
										<X
											size={20}
											color="#ffffff"
											className="cursor-pointer"
											onClick={(e) => {
												e.stopPropagation();
												setOpenDeleteModal(true);
											}}
										/>
									)}
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<div className="flex w-full items-start justify-between">
								<h2
									className={`w-full text-xl font-bold text-lemon-green md:text-2xl`}
									title={post?.title}
								>
									{post?.title}
								</h2>
							</div>
							<span
								className="font-circular text-base font-normal text-[#FFFFFFCC]"
								dangerouslySetInnerHTML={{
									__html: postCleanedContent,
								}}
							></span>
							<div className="w-full">
								<ThumbnailRenderer content={post.content} />
							</div>

							{postAttachments?.attachments &&
								postAttachments?.attachments.length > 0 && (
									<div
										className={`grid gap-2 ${
											postAttachments?.attachments
												?.length === 1
												? "grid-cols-1"
												: "grid-cols-2 "
										}`}
									>
										{postAttachments?.attachments?.map(
											(attachment, index) => (
												<AttachmentPreview
													key={index}
													attachment={attachment}
													className={`${postAttachments?.attachments?.length === index + 1 && postAttachments?.attachments.length % 2 !== 0 ? "col-span-2" : "col-span-1"}`}
												/>
											)
										)}
									</div>
								)}
						</div>
					</div>

					<div
						className={`flex w-full cursor-pointer justify-between   md:mx-6 ${type === "detail" ? "border-y border-[#FFFFFF33] py-3" : "py-2"} font-bold`}
					>
						<div className="flex items-center gap-4 !font-mono">
							<div
								className={`flex items-center gap-1 text-sm text-white md:px-3 md:py-2 ${
									post?.creator?._id === userState?._id
										? "cursor-text"
										: "cursor-pointer md:hover:rounded-md md:hover:bg-[#CCF9750D] "
								}`}
								onClick={(e) => {
									if (post?.creator?._id !== userState?._id) {
										voteComment(e);
									}
								}}
							>
								{post?.creator?._id !== userState?._id && (
									<ArrowBigUp
										fill={`${
											hasUpvoted
												? "#CCF975"
												: "transparent"
										}`}
										height={18}
										width={18}
										stroke={"#CCF975"}
									/>
								)}
								<span className="leading-none">
									Vote ({voteCount})
								</span>
							</div>
							<div
								className={`flex cursor-pointer items-center gap-1 px-3 text-sm text-white md:py-3 ${
									post?.creator?._id === userState?._id
										? "cursor-text"
										: "cursor-pointer md:hover:rounded-md md:hover:bg-[#CCF9750D]"
								}`}
								onClick={(e) => {
									if (post?.creator?._id !== userState?._id) {
										handleCommentClick(e);
									}
								}}
							>
								{post?.creator?._id !== userState?._id && (
									<MessageCircle
										height={14}
										width={18}
										fill={"transparent"}
										stroke={"#CCF975"}
									/>
								)}
								<span className="leading-none">
									Comment ({comments})
								</span>
							</div>
						</div>
						{type !== "detail" && (
							<div className="hidden items-center gap-2 md:flex">
								<p className="text-sm font-normal text-[#FFFFFF80]">
									Posted:{"  "} {convertDate(post?.createdAt)}
								</p>
							</div>
						)}
					</div>

					{/* {activeCommentId === post?.postId && ( */}
					<ReplyBox
						onSubmit={handleAddComment}
						parentId={post?.postId}
						isVisible={
							type !== "detail"
								? activeCommentId === post?.postId
								: post?.creator?._id !== userState?._id
						}
						onClose={() => setActiveCommentId(null)}
					/>
					{/* )} */}

					{type === "detail" && (
						<div className="mb-20 flex w-full flex-col items-center justify-center">
							<CommentSection
								comments={commentList}
								onAddComment={handleAddComment}
								view={"post"}
								groupId={groupId}
								notAMember={notAMember}
								group={group}
							/>
						</div>
					)}

					{type === "detail" && (
						<div className="absolute bottom-10 left-0 right-0 mt-1 flex w-full flex-col items-center justify-center">
							{isFetchingNextPage && (
								<div className="mx-auto flex w-full flex-row items-center justify-center text-center">
									<Spinner
										size={20}
										className="animate-spin text-center text-white"
									/>
								</div>
							)}
							{!isFetchingNextPage && hasNextPage && (
								<Image
									src={"/icons/comment-arrow-icon.svg"}
									alt="comment-arrow-icon"
									width={24}
									height={20}
									className="bottom-10 mt-4 items-center justify-center"
									onClick={() => fetchNextPage()}
								/>
							)}
							{!hasNextPage && !isFetchingNextPage && (
								<Image
									src={"/icons/no-comment-tech-logo.svg"}
									alt="no-comment-arrow-icon"
									width={24}
									height={20}
									className=" bottom-10 mt-4 items-center justify-center"
								/>
							)}
							{/* <div ref={observerTarget} className="!h-2 !w-full" /> */}
						</div>
					)}
				</CardView>
			</div>
			<JoinGroupModal
				group={group}
				isOpen={openJoinModal}
				onOpenChange={(e) => setOpenJoinModal(e)}
			/>
			<DeletePostModal
				group={group}
				isOpen={openDeleteModal}
				postId={post?.postId}
				onOpenChange={(e) => setOpenDeleteModal(e)}
			/>
		</>
	);
};

export default PostCardComponent;
