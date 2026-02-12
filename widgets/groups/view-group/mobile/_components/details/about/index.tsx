import { Group } from "@/lib/types/groups";
import React, { ReactElement } from "react";
import GroupsAdminPage4Mobile from "./_components/group-admins-4-mobile";
import GroupsTagView4Mobile from "./_components/group-tag-4-mobile";
import GroupDetailsHeader4Mobile from "./_components/group-details";
import GroupActions from "./_components/group-actions";

const GroupAboutView4Mobile = ({
	notAMember,
	group,
}: {
	notAMember: boolean;
	group: Group;
}): ReactElement | null => {
	return (
		<div
			className={` ${notAMember && group?.groupType !== "open" ? "" : "py-16"} h-full overflow-scroll bg-ink-darkest/40 from-white via-transparent to-white backdrop-blur-sm`}
		>
			<GroupDetailsHeader4Mobile group={group} />
			<GroupsTagView4Mobile tags={group?.tags || []} />
			{!notAMember && (
				<GroupsAdminPage4Mobile groupAdmins={group?.admins || []} />
			)}
			<GroupActions group={group} />
		</div>
	);
};

export default GroupAboutView4Mobile;
