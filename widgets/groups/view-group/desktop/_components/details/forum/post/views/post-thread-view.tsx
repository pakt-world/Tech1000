"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement } from "react";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Group } from "@/lib/types/groups";
import PostThreadSection from "../_components/post-thread-section";

interface CommentDetailViewType {
	group: Group;
}

export default function CommentDetailView({
	group,
}: CommentDetailViewType): ReactElement | null {
	const groupId = group._id;
	const nabArray = ["user", "invited", "applied"];
	const notAMember = nabArray?.includes(group?.type);
	return (
		<>
			<div className="relative flex  h-full w-full flex-col gap-4 ">
				<div className="relative flex  h-full gap-2">
					<motion.div
						className="tabs-content h-full w-full "
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
						<div className="flex  h-full flex-col ">
							<motion.div
								className="post-card flex h-full gap-4"
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{
									duration: 0.2,
									ease: "easeInOut",
								}}
								viewport={{ once: true, amount: 0.1 }}
							>
								<PostThreadSection
									groupId={groupId}
									type={"detail"}
									notAMember={notAMember}
									group={group}
								/>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
		</>
	);
}
