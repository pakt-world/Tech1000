"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Group } from "@/lib/types/groups";
import GroupsAdminView from "./group-admins";
import PostListView from "./post/views/post-list";
import GroupsTagView from "./group-tag";
import PostDetailView from "./post/views/post-detail-view";
import CommentDetailView from "./post/views/post-thread-view";

interface GroupsSummaryCardProps {
	group: Group;
}

export default function GroupsForumView({
	group,
}: GroupsSummaryCardProps): ReactElement | null {
	const nabArray = ["user", "invited", "applied"];
	const notAMember = nabArray.includes(group?.type);
	const searchParams = useSearchParams();
	const view = searchParams.get("postview");

	return (
		<>
			<div
				id="parentContainer"
				className={`${notAMember && group?.groupType === "private" ? "h-[80vh] overflow-hidden" : ""} relative flex  flex-col   xl:flex-row`}
			>
				<div className={`relative  flex w-full gap-6`}>
					{/* Show "join group" message if the user is not a member of a group*/}
					{notAMember && group?.groupType === "close" && (
						<div className="absolute inset-0  z-[100000000000] flex h-[100%] items-center justify-center overflow-hidden rounded-lg bg-opacity-80 xl:w-9/12 ">
							<div className="absolute inset-0  z-20 rounded-lg backdrop-blur-md"></div>{" "}
							<div className="absolute top-[20%] z-30 flex flex-col items-center justify-center gap-4">
								<Image
									src="/images/group-lock-image.svg"
									alt="Lock Icon"
									width={210}
									height={210}
								/>
								<p className="text-center text-2xl leading-4 text-white ">
									{group?.type === "invited"
										? "Accept Invite to view group"
										: "Join group to view posts"}
								</p>{" "}
							</div>
						</div>
					)}

					{/* Conditional rendering based on view parameter */}
					<div className=" xl:w-9/12">
						{view === "post" ? (
							<PostDetailView group={group} />
						) : view === "comment" ? (
							<CommentDetailView group={group} />
						) : (
							<PostListView group={group} />
						)}
					</div>
					<div className="flex w-full flex-col gap-2 xl:w-3/12">
						<GroupsTagView tags={group?.tags || []} />
						{!notAMember && (
							<GroupsAdminView groupAdmins={group?.admins} />
						)}
					</div>
				</div>
			</div>
		</>
	);
}
