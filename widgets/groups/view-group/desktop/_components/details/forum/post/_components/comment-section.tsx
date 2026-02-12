"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowBigUp, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { SnowProfile } from "@/components/common/snow-profile";
import AttachmentPreview from "@/components/common/attachment-preview";
import { Comment, Group } from "@/lib/types/groups";
import ReplyBox from "@/widgets/groups/_shared/post/reply-box";
import { useUndoUpvoteComment, useUpvoteComment } from "@/lib/api/group";
import JoinGroupModal from "@/widgets/groups/_shared/post/modals/join-group-modal";
import ThumbnailRenderer from "@/components/common/thumbnail-renderer";
import { useUserState } from "@/lib/store/account";

interface CommentSectionProps {
	comments?: Comment[];
	onAddComment: () => void;
	view: "trail-comment" | "post" | "trail";
	groupId: string;
	notAMember: boolean;
	group: Group;
}

const CommentSection: React.FC<CommentSectionProps> = ({
	comments,
	onAddComment,
	view,
	groupId,
	notAMember,
	group,
}) => {
	const router = useRouter();
	const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
	const [openJoinModal, setOpenJoinModal] = useState<boolean>(false);
	const [localComments, setLocalComments] = useState<Comment[]>(
		comments || []
	);
	const queryClient = useQueryClient();

	const userState = useUserState();
	const { mutate: upvoteComment } = useUpvoteComment();
	const { mutate: undoUpvoteComment } = useUndoUpvoteComment();

	const goToCommentDetailView = (commentId: string) =>
		router.push(
			`/groups/${groupId}?tab=forum&postview=comment&commentId=${commentId}`
		);

	const handleVote = async (
		commentId: string,
		currentVoteCount: number,
		e: React.MouseEvent
	) => {
		e.stopPropagation();
		const updatedComments = localComments?.map((comment) =>
			comment?.commentId === commentId
				? {
						...comment,
						upvotes: currentVoteCount + 1,
						hasUpvoted: true,
					}
				: comment
		);
		setLocalComments(updatedComments);

		upvoteComment(
			{ parentId: commentId },
			{
				onError: () => {
					const revertedComments = localComments?.map((comment) =>
						comment?.commentId === commentId
							? {
									...comment,
									upvotes: currentVoteCount,
									hasUpvoted: false,
								}
							: comment
					);
					setLocalComments(revertedComments);
				},
				onSuccess: () => {
					queryClient.invalidateQueries([
						"get-comments",
						localComments?.[0]?.parentId,
					]);
				},
			}
		);
	};

	const handleUndoUpVote = async (
		commentId: string,
		currentVoteCount: number,
		e: React.MouseEvent
	) => {
		e.stopPropagation();
		const updatedComments = localComments?.map((comment) =>
			comment?.commentId === commentId
				? {
						...comment,
						hasUpvoted: false,
						upvotes:
							currentVoteCount < 1 ? 0 : currentVoteCount - 1,
					}
				: comment
		);
		setLocalComments(updatedComments);
		undoUpvoteComment(
			{ parentId: commentId },
			{
				onError: () => {
					const revertedComments = localComments?.map((comment) =>
						comment?.commentId === commentId
							? {
									...comment,
									hasUpvoted: true,
									upvotes: currentVoteCount,
								}
							: comment
					);

					setLocalComments(revertedComments);
				},
				onSuccess: () => {
					queryClient.invalidateQueries([
						"get-comments",
						localComments?.[0]?.parentId,
					]);
				},
			}
		);
	};

	const voteComment = (
		cHasUpvoted: boolean,
		commentId: string,
		currentVoteCount: number,
		e: React.MouseEvent
	) => {
		if (notAMember && group.type === "public") setOpenJoinModal(true);
		if (notAMember) return;
		if (cHasUpvoted) {
			handleUndoUpVote(commentId as string, currentVoteCount, e);
		} else {
			handleVote(commentId as string, currentVoteCount, e);
		}
	};

	const handleCommentClick = (e: React.MouseEvent, commentId: string) => {
		if (notAMember && group.type === "public") setOpenJoinModal(true);
		if (notAMember) return;
		e.stopPropagation();
		setActiveCommentId((prevId) =>
			prevId === commentId ? null : commentId
		);
	};

	const handleAddComment = () => {
		const updatedComments = localComments?.map((comment) =>
			comment?.commentId === activeCommentId
				? {
						...comment,
						commentCount: comment?.commentCount + 1,
					}
				: comment
		);
		setLocalComments(updatedComments);
		setActiveCommentId(null);
		onAddComment();
	};

	const commentVariants = {
		hidden: { opacity: 0, y: -30 },
		visible: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 30 },
	};

	useEffect(() => {
		// this is to ensure that the comments are updated when the comments are fetched
		if (
			comments?.[0]?.commentId !== localComments?.[0]?.commentId ||
			comments?.length !== localComments?.length
		) {
			setLocalComments(comments || []);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [comments, localComments]);

	return (
		<>
			<motion.div
				className={`${view === "post" ? "mt-4" : "mt-1"} w-full`}
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<AnimatePresence>
					{localComments &&
						localComments?.length > 0 &&
						localComments.map((comment, index) => (
							<motion.div
								key={comment?.commentId}
								className={` ${view === "post" ? " border-[#FFFFFF33] pb-6 pt-4" : "py-4"} ${localComments?.length !== index + 1 && view !== "trail" ? "border-b border-[#FFFFFF33]" : ""} flex flex-col`}
								variants={commentVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								transition={{
									duration: 0.1,
									delay: (index + 1) * 0.01,
								}}
							>
								<div
									className="relative flex h-fit items-start gap-2"
									onClick={() =>
										goToCommentDetailView(
											comment?.commentId
										)
									}
								>
									<div className="relative flex h-full items-center">
										<SnowProfile
											src={comment?.creator?.image}
											score={
												parseInt(
													comment?.creator
														?.nftTokenNumber || ""
												) || 0
											}
											size="sm"
											url={`/members/${comment?.creator?._id}`}
										/>
									</div>
									{view === "trail" && (
										<div className="absolute left-[22px] top-12 -z-10 min-h-full -translate-x-1/2 transform border-l border-white/20"></div>
									)}
									<div
										className={`flex w-full flex-col ${view === "post" ? "gap-3" : "gap-2"}`}
									>
										<div className="flex flex-col items-start justify-center">
											<h2 className="text-left text-lg font-bold text-white">
												{comment?.creator?.firstName}{" "}
												{comment?.creator?.lastName}
											</h2>
											<p className="text-sm capitalize text-[#FFFFFF80]">
												{comment?.creator?.title}
											</p>
										</div>
										<p
											className="font-circular text-[16px] font-normal leading-6 text-[#FFFFFFCC]"
											dangerouslySetInnerHTML={{
												__html: comment?.content,
											}}
										></p>
										<ThumbnailRenderer
											content={comment?.content || ""}
										/>
										{comment?.attachments &&
											comment?.attachments?.length >
												0 && (
												<div
													className={`mt-2 grid w-full grid-cols-1  gap-1 rounded-2xl ${comment?.attachments?.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
												>
													{comment?.attachments?.map(
														(attachment, index) => {
															if (!attachment)
																return;
															return (
																<AttachmentPreview
																	key={index}
																	attachment={
																		attachment
																	}
																	className={`${comment?.attachments?.length === index + 1 ? "col-span-2" : "col-span-1"}`}
																/>
															);
														}
													)}
												</div>
											)}

										<div
											className={`${view === "post" ? "mt-2" : ""} flex w-full cursor-pointer justify-start gap-4 font-bold`}
										>
											<div
												className={`flex items-center gap-1 px-3 py-2 text-sm text-white   ${
													comment?.creator?._id ===
													userState?._id
														? "cursor-text"
														: "cursor-pointer hover:rounded-md hover:bg-[#CCF9750D]"
												}`}
												onClick={(e) => {
													if (
														comment?.creator
															?._id !==
														userState?._id
													) {
														voteComment(
															comment?.hasUpvoted ||
																false,
															comment?.commentId,
															comment?.upvotes,
															e
														);
													}
												}}
											>
												{comment?.creator?._id !==
													userState?._id && (
													<ArrowBigUp
														height={20}
														width={18}
														fill={`${
															comment?.hasUpvoted
																? "#CCF975"
																: "transparent"
														}`}
														stroke={`${
															comment?.hasUpvoted
																? "#CCF975"
																: "#CCF975"
														}`}
													/>
												)}
												<span className="leading-none">
													Vote ({comment?.upvotes})
												</span>
											</div>
											<div
												className={`py-3text-sm flex cursor-pointer items-center gap-1 px-3 text-white ${
													comment?.creator?._id ===
													userState?._id
														? "cursor-text"
														: "cursor-pointer hover:rounded-md hover:bg-[#CCF9750D]"
												}`}
												onClick={(e) => {
													if (
														comment?.creator
															?._id !==
														userState?._id
													) {
														handleCommentClick(
															e,
															comment.commentId
														);
													}
												}}
											>
												{comment?.creator?._id !==
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
													{comment?.commentCount})
												</span>
											</div>
										</div>

										{activeCommentId ===
											comment?.commentId &&
											(view === "trail-comment" ||
												view === "trail") && (
												<ReplyBox
													parentId={
														comment?.commentId
													}
													onSubmit={handleAddComment}
													isVisible={
														activeCommentId ===
														comment?.commentId
													}
													onClose={() =>
														setActiveCommentId(null)
													}
													hideEditorInfoView={false}
												/>
											)}
									</div>
								</div>

								{/* Render ReplyBox if this comment is active */}
								{activeCommentId === comment?.commentId &&
									view === "post" && (
										<ReplyBox
											parentId={comment?.commentId}
											onSubmit={handleAddComment}
											isVisible={
												activeCommentId ===
												comment?.commentId
											}
											onClose={() =>
												setActiveCommentId(null)
											}
											hideEditorInfoView={false}
										/>
									)}
							</motion.div>
						))}
				</AnimatePresence>
			</motion.div>
			<JoinGroupModal
				group={group}
				isOpen={openJoinModal}
				onOpenChange={(e) => setOpenJoinModal(e)}
			/>
		</>
	);
};

export default CommentSection;
