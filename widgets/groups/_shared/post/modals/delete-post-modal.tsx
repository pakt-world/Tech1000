"use client";
import React, { ReactElement } from "react";

import { Group } from "@/lib/types/groups";
import { Modal } from "@/components/common/modal";
import CardView from "@/components/common/card-view";
import { Button } from "@/components/common/button";
import { useDeletePost } from "@/lib/api/group";
import { useQueryClient } from "@tanstack/react-query";

interface DeletePostModalProps {
	group: Group;
	isOpen: boolean;
	postId: string;
	onOpenChange: (isOpen: boolean) => void;
}

export default function DeletePostModal({
	group,
	isOpen,
	postId,
	onOpenChange,
}: DeletePostModalProps): ReactElement | null {
	const queryClient = useQueryClient();
	const { mutate: deletePost, isLoading } = useDeletePost();

	const handleDeletePost = () => {
		deletePost(
			{ postId: postId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries([
						"get-top-posts",
						group?._id,
						10,
					]);
					queryClient.invalidateQueries([
						"get-trending-posts",
						group?._id,
						10,
					]);
					queryClient.invalidateQueries([
						"get-recent-posts",
						group?._id,
						10,
					]);
					onOpenChange(false);
				},
			}
		);
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={() => onOpenChange(!isOpen)}
				className=" w-full max-w-[96%] md:min-w-[570px] md:max-w-[570px]"
			>
				<div className="relative p-0.5">
					<div className="absolute inset-0 rounded-2xl">
						<div
							className="absolute inset-0 overflow-hidden rounded-[30px] border border-transparent 
      before:absolute before:inset-0 before:z-[-1] 
      before:rounded-lg before:border-none before:bg-gradient-to-br 
      before:from-[#D02D3D] before:via-[#F2C650] before:to-[#D02D3D] before:content-['']"
						/>
					</div>
					<CardView className="!p-4!md:p-6 relative flex flex-col gap-4 !border border-[#E8E8E81A]/10   !bg-ink-darkest md:w-full">
						<h3 className="text-2xl font-bold text-white">
							Delete Post
						</h3>
						<p className="max-w-[400px] text-center text-sm text-[#979C9E]">
							This action is irreversible. Once you delete the
							post, all of its content including the techscore it
							has generated will be deleted.
						</p>
						<p className="text-md max-w-[400px] text-center text-white">
							Are you sure you want to proceed with the deletion?
						</p>
						<div className="mt-2 flex w-full flex-col gap-4 md:flex-row">
							<Button
								variant="default"
								type="button"
								size="md"
								className=" !w-full gap-2 rounded-full px-6 py-2  font-mono text-white md:w-fit"
								onClick={() => onOpenChange(false)}
							>
								<span className=" font-mono font-bold">
									No, Cancel
								</span>
							</Button>
							<Button
								variant="outline"
								type="button"
								size="md"
								className="!w-full items-center gap-2 rounded-full px-6 py-2 text-lemon-green  md:w-fit"
								onClick={handleDeletePost}
								disabled={isLoading}
							>
								{isLoading ? (
									"Deleting..."
								) : (
									<span className=" font-mono font-bold">
										Yes Proceed
									</span>
								)}
							</Button>
						</div>
					</CardView>
				</div>
			</Modal>
		</>
	);
}
