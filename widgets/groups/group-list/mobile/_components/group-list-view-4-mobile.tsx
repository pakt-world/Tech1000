/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React from "react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { PageLoading } from "@/components/common/page-loading";
import { Group } from "@/lib/types/groups";
import GroupsCard from "@/widgets/groups/_shared/groups-card";
import FetchingIndicator from "@/components/common/fetching-indicator";

interface GroupListViewProps {
	isLoading: boolean;
	groupsData: { pages: Group[][] };
	data: any;
	isFetchingNextPage: boolean;
	observerTarget: React.RefObject<HTMLDivElement>;
}
const GroupListView4Mobile = ({
	isLoading,
	groupsData,
	data,
	isFetchingNextPage,
	observerTarget,
}: GroupListViewProps) => {
	return (
		<div className="relative w-full pb-20">
			{isLoading && !data ? (
				<PageLoading className="rounded-2xl" color="#ffffff" />
			) : (groupsData?.pages?.flat().length ?? 0) > 0 ? (
				<div className=" mb-[50px] flex flex-col  ">
					{groupsData?.pages?.flat().map((group) => (
						<GroupsCard
							key={group._id}
							name={group.name}
							id={group._id}
							image={group?.image ?? "/images/onboarding-5.png"} // temp image pending clarification from gabriel
							tags={group.tags}
							members={group.memberCount}
							score={group?.score}
						/>
					))}
				</div>
			) : (
				<PageEmpty
					label="No groups available."
					className="!h-full rounded-none"
				/>
			)}
			<FetchingIndicator
				isFetchingNextPage={isFetchingNextPage}
				observerTarget={observerTarget}
			/>
		</div>
	);
};

export default GroupListView4Mobile;
