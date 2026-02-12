/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	LayoutList,
	LayoutDashboard,
	MessageSquare,
	Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useMobileContext } from "@/providers/mobile-context-provider";

import { LogOut } from "../desktop-sidebar/misc/logout";
import { MobileNavLink } from "./nav-link";

const NavLink = [
	{
		href: "/overview",
		label: "Dashboard",
		icon: <LayoutDashboard />,
	},
	{
		href: "/groups",
		label: "Groups",
		icon: <LayoutList />,
	},
	{
		href: "/members",
		label: "Members",
		icon: <Users />,
	},
	{
		href: "/messages",
		label: "Messages",
		icon: <MessageSquare />,
	},
];

export const BottomNav = (): JSX.Element | false => {
	const pathname = usePathname();
	const {
		isScrolling,
		isAtTop,
		isTouching,
		showMemberSearch,
		showOpenBounties,
	} = useMobileContext();
	const footerDelay = 10; // Simulate slower response
	const [footerVisible, setFooterVisible] = useState(true);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (!isScrolling) {
			// Show the footer after the delay when scrolling stops
			timeout = setTimeout(() => {
				setFooterVisible(true);
			}, footerDelay);
		} else if (isScrolling || isTouching) {
			// Hide the footer immediately when scrolling starts
			setFooterVisible(false);
		}

		return () => clearTimeout(timeout);
	}, [isScrolling, footerDelay, isTouching]);

	const showNav =
		!pathname.includes("/messages/") &&
		!pathname.includes("/members/") &&
		//	!pathname.includes("/profile") &&
		!pathname.includes("/invite/") &&
		!pathname.includes("/updates") &&
		!pathname.startsWith("/settings") &&
		!pathname.includes("/wallet/") &&
		!pathname.includes("/groups/create") &&
		!pathname.includes("/bounties/");

	return (
		showNav && (
			<nav
				className={`!fixed bottom-0 left-0 !z-[100] flex h-16 w-full justify-between overflow-hidden px-[10px] py-3 transition-all duration-300 ease-in-out sm:hidden ${(footerVisible || isAtTop) && !showMemberSearch && !showOpenBounties ? "bg-[#000000] bg-cover opacity-100" : "opacity-0"}`}
			>
				{NavLink.map((link) => (
					<MobileNavLink
						key={link.label}
						href={link.href}
						label={link.label}
						icon={link.icon}
					/>
				))}
				<LogOut
					noLabel
					className="flex w-full items-center justify-center !text-white"
				/>
			</nav>
		)
	);
};
