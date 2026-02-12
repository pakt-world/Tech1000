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

interface GroupListViewProps {
	isLoading: boolean;
	groupsData: { pages: Group[][] };
	data: any;
}
const GroupListVie4Desktop = ({
	isLoading,
	groupsData,
	data,
}: GroupListViewProps) => {
	return (
		<>
			{isLoading && !data ? (
				<PageLoading className="rounded-2xl" color="#ffffff" />
			) : (groupsData?.pages?.flat().length ?? 0) > 0 ? (
				<>
					<div className="grid grid-cols-1 gap-6 overflow-x-scroll pb-2 sm:grid-cols-2 lg:grid-cols-3">
						{groupsData?.pages?.flat().map((group) => (
							<GroupsCard
								key={group._id}
								name={group.name}
								id={group._id}
								image={
									group?.image ?? "/images/onboarding-5.png"
								} // temp image pending clarification from gabriel
								tags={group.tags}
								members={group.memberCount}
								score={group?.score}
							/>
						))}
					</div>
					{/* */}
				</>
			) : (
				<PageEmpty
					label="No groups available."
					className="h-[80vh] rounded-2xl"
				/>
			)}
		</>
	);
};

export default GroupListVie4Desktop;
