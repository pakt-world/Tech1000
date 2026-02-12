"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useMediaQuery } from "usehooks-ts";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import GroupListPage4Desktop from "@/widgets/groups/group-list/desktop";
import GroupListPage4Mobile from "@/widgets/groups/group-list/mobile";

export default function GroupsPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	return tab ? <GroupListPage4Desktop /> : <GroupListPage4Mobile />;
}
