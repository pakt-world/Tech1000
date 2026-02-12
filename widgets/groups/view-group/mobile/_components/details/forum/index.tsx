"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement } from "react";
import { useSearchParams } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Group } from "@/lib/types/groups";
import PostListView from "./post/views/post-list";
import PostDetailView from "./post/views/post-detail-view";
import CommentDetailView from "./post/views/post-thread-view";

interface GroupsForumView4MobileProps {
	group: Group;
}

export default function GroupsForumView4Mobile({
	group,
}: GroupsForumView4MobileProps): ReactElement | null {
	const nabArray = ["user", "invited", "applied"];
	const notAMember = nabArray.includes(group?.type);
	const searchParams = useSearchParams();
	const view = searchParams.get("postview");

	return (
		<div
			id="parentContainer"
			className={`${notAMember && group?.groupType === "private" ? "overflow-hidden md:h-[80vh]" : ""} relative flex flex-col  max-sm:h-full   xl:flex-row`}
		>
			<div
				className={`relative  flex w-full justify-center gap-6 max-sm:h-full `}
			>
				<div className="h-full w-full overflow-scroll xl:w-9/12">
					{view === "post" ? (
						<PostDetailView group={group} />
					) : view === "comment" ? (
						<CommentDetailView group={group} />
					) : (
						<PostListView group={group} />
					)}
				</div>
			</div>
		</div>
	);
}
