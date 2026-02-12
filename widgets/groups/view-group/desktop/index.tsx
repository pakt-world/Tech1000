"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement } from "react";
import { useParams } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetGroup } from "@/lib/api/group";
import { PageLoading } from "@/components/common/page-loading";
import { Tabs } from "@/components/common/tabs";
import { PageError } from "@/components/common/page-error";
import GroupMembersView from "./_components/details/members";
import GroupLibraryView from "./_components/details/library";
import GroupsForumView from "./_components/details/forum";
import GroupsSummaryCard from "./_components/group-details-header";

const GroupsInfoView4Desktop = (): ReactElement | null => {
	const { groupId } = useParams();

	const {
		data: groupData,
		isLoading,
		isError,
	} = useGetGroup({ id: groupId as string });

	const nabArray = ["user", "invited", "applied"];
	const notAMember = groupData ? nabArray.includes(groupData.type) : false;

	if (isLoading) {
		return <PageLoading className="rounded-2xl" color="#ffffff" />;
	}

	if (isError || !groupData) {
		return <PageError className="h-[85vh] rounded-2xl" />;
	}

	return (
		<>
			<div
				className="max-w-screen h full
		relative flex w-full flex-col "
			>
				<GroupsSummaryCard group={groupData} />
				<div className=" hfull  flex  w-full flex-col gap-8  md:flex-row">
					<Tabs
						className="h-auto"
						tabListClassName="!border-[#FFFFFF1A] pt-8 z-[100000] !w-[80%] !px-0"
						tabTriggerClassName="!font-bold "
						tabContentContainerClassName={`!overflow-visible  !h-auto sm:!mt-0`}
						tabContentMotionWrapperClassName={`!h-auto `}
						tabContentMotionDivClassName={`!h-auto`}
						tabs={[
							{
								label: "Forum",
								value: "forum",
								content: <GroupsForumView group={groupData} />,
							},
							...(!notAMember
								? [
										{
											label: "Members",
											value: "members",
											content: (
												<GroupMembersView
													group={groupData}
												/>
											),
										},
										{
											label: "Library",
											value: "library",
											content: (
												<GroupLibraryView
													group={groupData}
												/>
											),
										},
									]
								: []),
						]}
					/>
				</div>
			</div>
		</>
	);
};

export default GroupsInfoView4Desktop;
