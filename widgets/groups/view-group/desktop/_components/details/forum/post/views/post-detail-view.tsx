"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, FilePlus2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetPost } from "@/lib/api/group";
import PostCardComponent from "../_components/post-card";
import { Group } from "@/lib/types/groups";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";
import { Button } from "@/components/common/button";
import CreatePostModal from "../misc/create-post-modal";

interface PosttDetailViewType {
	group: Group;
}

export default function PosttDetailView({
	group,
}: PosttDetailViewType): ReactElement | null {
	const router = useRouter();
	const searchParams = useSearchParams();
	const postId = searchParams.get("postId");

	const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

	const groupId = group?._id;

	const nabArray = ["user", "invited", "applied"];
	const notAMember = group ? nabArray.includes(group.type) : false;

	const goToCreateGroupsPost = () => router.push(`/groups/${groupId}`);

	const {
		data: postData,
		isLoading,
		isError,
	} = useGetPost({ id: postId as string });

	if (isLoading) {
		return <PageLoading className="rounded-2xl" color="#ffffff" />;
	}

	if (isError) {
		return <PageError className="h-[85vh] rounded-2xl" />;
	}

	return (
		<>
			<div className="relative  flex h-full w-full flex-col">
				<div className=" flex w-full justify-between py-4 ">
					<span
						className="flex cursor-pointer items-center gap-2"
						onClick={goToCreateGroupsPost}
					>
						<ChevronLeft size={18} className="text-[#FFFFFF]/50" />
						<p className="text-sm font-bold text-[#FFFFFF]">Back</p>
					</span>
					{!notAMember && (
						<Button
							className=" flex gap-3 rounded-3xl border-none py-2 font-bold"
							type="button"
							variant={"default"}
							size="sm"
							onClick={() => setOpenCreateModal(true)}
						>
							<FilePlus2 size={22} />
							Create Post
						</Button>
					)}
				</div>
				<div className="relative flex h-full gap-2 overflow-scroll">
					<motion.div
						className="tabs-content h-full w-full"
						initial={{
							x: "-100%",
						}}
						animate={{
							x: 0,
						}}
						exit={{
							x: "100%",
						}}
						transition={{
							duration: 0.1,
							ease: "easeInOut",
						}}
					>
						<div className="flex max-h-full flex-col overflow-scroll ">
							<motion.div
								className="post-card flex gap-4"
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{
									duration: 0.2,
									ease: "easeInOut",
								}}
								viewport={{ once: true, amount: 0.1 }}
							>
								<PostCardComponent
									groupId={groupId}
									post={postData}
									type={"detail"}
									group={group}
									lastItem={true}
								/>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
			<CreatePostModal
				open={openCreateModal}
				setOpen={() => setOpenCreateModal(!openCreateModal)}
				group={group}
			/>
		</>
	);
}
