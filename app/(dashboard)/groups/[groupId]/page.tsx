"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useMediaQuery } from "usehooks-ts";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import GroupsInfoView4Desktop from "@/widgets/groups/view-group/desktop";
import GroupsInfoView4Mobile from "@/widgets/groups/view-group/mobile";
export default function GroupsInfoView(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	return tab ? <GroupsInfoView4Desktop /> : <GroupsInfoView4Mobile />;
}
