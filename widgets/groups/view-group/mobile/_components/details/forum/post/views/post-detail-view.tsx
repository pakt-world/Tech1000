"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetPost } from "@/lib/api/group";
import PostCardComponent from "../_components/post-card";
import { Group } from "@/lib/types/groups";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";

interface PosttDetailViewType {
	group: Group;
}

export default function PosttDetailView({
	group,
}: PosttDetailViewType): ReactElement | null {
	const router = useRouter();
	const searchParams = useSearchParams();
	const postId = searchParams.get("postId");
	const fromDashboard = searchParams.get("fromDashboard");

	const groupId = group?._id;

	//const nabArray = ["user", "invited", "applied"];
	//const notAMember = group ? nabArray.includes(group.type) : false;

	const {
		data: postData,
		isLoading,
		isError,
	} = useGetPost({ id: postId as string });

	const goToGroupsView = () => {
		fromDashboard
			? router.push(`/overview?postInView=${postData?.postId}`)
			: router.push(`/groups/${groupId}`);
	};

	// const goToCreatePost = () => {
	// 	router.push(`/groups/${groupId}/create-post`);
	// };

	if (isLoading) {
		return <PageLoading className="rounded-2xl" color="#ffffff" />;
	}

	if (isError) {
		return <PageError className="h-[85vh] rounded-2xl" />;
	}

	return (
		<>
			<div className="relative  flex h-full w-full flex-col pt-0">
				<div className="fixed top-[70px] z-[100000] flex w-full justify-between border-y border-white/20 bg-ink-darkest/70 from-white via-transparent to-white py-1">
					<span
						className="flex cursor-pointer items-center gap-2"
						onClick={goToGroupsView}
					>
						<ChevronLeft size={18} className="text-[#FFFFFF]/50" />
						<p className="text-sm font-bold text-[#FFFFFF]">
							Post details
						</p>
					</span>
				</div>
				<div className="relative mt-[30px] flex gap-2 overflow-scroll">
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
				{/* {!notAMember && (
					<div className="fixed bottom-[10%] right-2 z-30 flex w-fit flex-col justify-end gap-4 md:hidden">
						<button
							className="flex h-16 w-16 items-center justify-center rounded-full bg-lemon-green text-sm text-black"
							onClick={goToCreatePost}
						>
							<PenLine size={30} />
						</button>
					</div>
				)} */}
			</div>
		</>
	);
}
