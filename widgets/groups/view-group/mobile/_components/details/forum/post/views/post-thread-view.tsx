"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement } from "react";
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
		<div className=" bg-ink-darkest/40 from-white via-transparent to-white ">
			<PostThreadSection
				groupId={groupId}
				type={"detail"}
				notAMember={notAMember}
				group={group}
			/>
		</div>
	);
}
