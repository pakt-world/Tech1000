"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement } from "react";
import { useParams, useSearchParams } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetGroup } from "@/lib/api/group";
import { PageLoading } from "@/components/common/page-loading";
import { Tabs } from "@/components/common/tabs";
import { PageError } from "@/components/common/page-error";
import GroupAboutView4Mobile from "./_components/details/about";
import GroupMembersView4Mobile from "./_components/details/members";
import GroupLibraryView4Mobile from "./_components/details/library";
import GroupsForumView4Mobile from "./_components/details/forum";
import Image from "next/image";

const GroupsInfoView4Mobile = (): ReactElement | null => {
	const { groupId } = useParams();
	const searchParams = useSearchParams();
	const view = searchParams.get("postview");

	const {
		data: groupData,
		isLoading,
		isError,
	} = useGetGroup({ id: groupId as string });

	const nabArray = ["user", "invited", "applied"];
	const notAMember = groupData ? nabArray.includes(groupData?.type) : false;

	if (isLoading) {
		return <PageLoading className="rounded-2xl" color="#ffffff" />;
	}

	if (isError || !groupData) {
		return <PageError className="h-[85vh] rounded-2xl" />;
	}

	return (
		<>
			<div className="max-w-screen relative flex w-full flex-col max-sm:h-full ">
				{/* <GroupsSummaryCard group={groupData} /> */}
				<div className=" flex w-full flex-col  gap-8 max-sm:h-full  md:flex-row ">
					<Tabs
						className=""
						tabListClassName={`!border-[#FFFFFF1A] md:pt-8 z-[100000] !w-full bg-[#000000]/60 px-3 font-circular !max-sm:h-full fixed z-[100000] ${view ? "hidden" : notAMember && groupData?.groupType === "open" ? "!justify-start" : notAMember && groupData?.groupType !== "open" ? "!hidden" : "!justify-between"}`}
						tabTriggerClassName="!font-bold  font-bold text-base !p-3"
						tabContentContainerClassName={`!overflow-visible   sm:!mt-0`}
						// tabContentMotionWrapperClassName={`!h-auto `}
						// tabContentMotionDivClassName={`!h-auto`}
						defaultTab={
							notAMember && groupData?.groupType !== "open"
								? "info"
								: "forum"
						}
						tabs={[
							{
								label: (
									<Image
										src={groupData?.image}
										className={"h-8 w-8 rounded-full"}
										alt="group"
										width={32}
										height={32}
									/>
								),
								value: "info",
								content: (
									<GroupAboutView4Mobile
										notAMember={notAMember}
										group={groupData}
									/>
								),
							},
							...(notAMember && groupData?.groupType !== "open"
								? []
								: [
										{
											label: "Forum",
											value: "forum",
											content: (
												<GroupsForumView4Mobile
													group={groupData}
												/>
											),
										},
									]),
							...(!notAMember
								? [
										{
											label: "Members",
											value: "members",
											content: (
												<GroupMembersView4Mobile
													group={groupData}
												/>
											),
										},
										{
											label: "Library",
											value: "library",
											content: (
												<GroupLibraryView4Mobile
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

export default GroupsInfoView4Mobile;
