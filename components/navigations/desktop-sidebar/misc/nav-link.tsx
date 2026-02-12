"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	LayoutDashboard,
	LayoutList,
	MessageSquare,
	Settings,
	Users,
	// Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FC } from "react";
import { useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Skeleton } from "@/components/common/skeletons/skeleton";

interface Props {
	href: string;
	children: React.ReactNode;
}

export const NavLink: FC<Props> = ({ href, children }) => {
	const pathname = usePathname();
	const parentPath = pathname.split("/")[1];
	const isActive = href.startsWith(`/${parentPath}`);
	const isClient = useIsClient();

	return isClient ? (
		<Link
			href={href}
			className={`${isActive && "bg-white bg-opacity-20"} flex w-full min-w-[150px] items-center gap-2 rounded-lg p-2 text-base font-normal leading-normal tracking-wide text-white duration-200 hover:bg-white hover:bg-opacity-20 sm:px-3`}
		>
			{children}
		</Link>
	) : (
		<Skeleton className="my-2 h-[40px] w-[150px]" />
	);
};

export const LINKS = [
	{
		href: "/overview?tab=recents",
		icon: <LayoutDashboard size={16} />,
		label: "Dashboard",
	},
	{
		href: "/groups?type=public&search=&minimumScore=&maximumScore=",
		icon: <LayoutList size={16} />,
		label: "Groups",
	},
	{
		href: "/members",
		icon: <Users size={16} />,
		label: "Members",
	},
	// {
	// 	href: "/wallet?period=weekly",
	// 	icon: <Wallet size={20} />,
	// 	label: "Wallet",
	// },
	{
		href: "/messages",
		icon: <MessageSquare size={16} />,
		label: "Messages",
	},
	{
		href: "/settings",
		icon: <Settings size={16} />,
		label: "Settings",
	},
];
