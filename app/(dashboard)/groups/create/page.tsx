"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useMediaQuery } from "usehooks-ts";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import CreateGroupsPage4Desktop from "@/widgets/groups/create-group/desktop";
import CreateGroupsPage4Mobile from "@/widgets/groups/create-group/mobile";

export default function CreateGroupsPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	return tab ? <CreateGroupsPage4Desktop /> : <CreateGroupsPage4Mobile />;
}
