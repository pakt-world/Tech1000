"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { MessageCircle } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageLoading } from "@/components/common/page-loading";
import { useMessaging } from "@/providers/socket-provider";

export default function MessagesPage(): JSX.Element {
	const pathname = usePathname();
	const { startUserInitializeConversation, startingNewChat, socket } =
		useMessaging();
	const tab = useMediaQuery("(min-width: 640px)");

	const searchParams = useSearchParams();
	const queryParams = new URLSearchParams(searchParams as unknown as string);
	const userId = queryParams.get("userId");
	const initialized = useRef(false);
	const isChatPage = pathname.includes("/messages/");

	useEffect(() => {
		if (socket && userId && !initialized.current) {
			initialized.current = true;
			startUserInitializeConversation(userId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, socket]);

	if (startingNewChat && isChatPage) return <PageLoading color="#ffffff" />;

	return tab ? (
		<div className="flex size-full flex-col items-center justify-center p-6 pt-3">
			<div className="flex flex-col items-center gap-2 text-center text-body">
				<MessageCircle size={120} className="text-slate-400" />
				<span>Send private messages to members</span>
			</div>
		</div>
	) : (
		<div />
	);
}
