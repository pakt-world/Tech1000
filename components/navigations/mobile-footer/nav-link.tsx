"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUnreadChats } from "@/hooks/use-unread-chats";
import { useUserState } from "@/lib/store/account";
import { useMessaging } from "@/providers/socket-provider";

interface Props {
	href: string;
	label: string;
	icon?: React.ReactNode;
}

export const MobileNavLink = ({ href, label, icon }: Props) => {
	const pathname = usePathname();
	const { allConversations } = useMessaging();
	const account = useUserState();

	const { _id: loggedInUser } = account;

	const parentPath = pathname.split("/")[1];
	const isActive = href.startsWith(`/${parentPath}`);

	const unreadCount = useUnreadChats(allConversations, loggedInUser);

	return (
		<Link
			href={href}
			className={`group relative flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-base font-normal text-white duration-200 hover:bg-transparent
      ${isActive ? "!rounded-[100px] !bg-white !bg-opacity-20" : ""}
      `}
		>
			{icon}
			{label === "Messages" && unreadCount > 0 && (
				<p className="absolute right-4 top-0 flex size-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-center text-xs text-white text-opacity-80">
					{unreadCount >= 100 ? "99+" : unreadCount}
				</p>
			)}
		</Link>
	);
};
