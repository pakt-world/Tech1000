"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import MemberDesktopView from "@/widgets/members/desktop";
import MemberMobileView from "@/widgets/members/mobile";

export default function MembersPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	return tab ? <MemberDesktopView /> : <MemberMobileView />;
}
