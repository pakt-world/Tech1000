"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Skeleton } from "@/components/common/skeletons/skeleton";
import { getConversationHeader } from "@/lib/actions";
import { useUserState } from "@/lib/store/account";
import { useMessaging } from "@/providers/socket-provider";
import type { CombinedConversationResponseProps } from "@/providers/socket-types";

import { ChatListItem } from "./chat-list-item";
import { ChatListSearch } from "./chat-list-search";

const ChatListSkeleton = () => (
	<div className="flex h-auto w-full flex-col overflow-y-auto">
		{[...Array(20)].map((_, i) => (
			<Skeleton
				className="flex h-auto w-full items-center justify-start gap-2 border-b border-primary-light bg-primary p-4"
				key={i}
			>
				<Skeleton className="!h-[66px] !w-[66px] !rounded-full bg-white/10" />
				<div className="flex w-full flex-1 items-start justify-between gap-3">
					<div className="flex flex-col items-start gap-1">
						<Skeleton className="!h-[16px] !w-[85px] !rounded-sm bg-white/10" />
						<Skeleton className="!h-[10px] !w-[70px] !rounded-sm bg-white/10" />
					</div>

					<div className="flex w-max flex-col items-end gap-1">
						<Skeleton className="!h-[7px] !w-[25px] !rounded-sm bg-white/10" />
						<Skeleton className="!h-[10px] !w-[10px] !rounded-full bg-white/10" />
					</div>
				</div>
			</Skeleton>
		))}
	</div>
);

export const ChatList = (): JSX.Element => {
	const { allConversations, loadingChats } = useMessaging();
	const { _id: loggedInUser } = useUserState();

	const [searchChat, setSearchChat] = useState<string>("");
	const [convos, setConvos] =
		useState<CombinedConversationResponseProps[]>(allConversations);

	// Function to handle search
	const searchHandler = (chat: string): void => {
		setSearchChat(chat);
	};

	useEffect(() => {
		// If search is empty, set chat to all conversations
		if (searchChat.length === 0) {
			setConvos(allConversations);
		} else {
			// Filter chat based on search
			const searchResult = allConversations.filter((c) => {
				const sender = getConversationHeader(c, loggedInUser);
				return (sender?.title || "")
					.toLowerCase()
					.includes(searchChat.toLowerCase());
			});
			setConvos(searchResult);
		}
	}, [searchChat, allConversations, loggedInUser]);

	// Sort data and make sure the latest chat or new incoming message at the top of the list
	useEffect(() => {
		const sortedConversations = convos.sort((a, b) => {
			const aMessages = a.messages || [];
			const bMessages = b.messages || [];
			const aLastMessage = aMessages[aMessages.length - 1];
			const bLastMessage = bMessages[bMessages.length - 1];

			if (!aLastMessage || !bLastMessage) return 0;

			return (
				new Date(bLastMessage.createdAt).getTime() -
				new Date(aLastMessage.createdAt).getTime()
			);
		});

		setConvos(sortedConversations);
	}, [convos]);

	return (
		<div className="border-gradient-to-r relative z-40 mx-auto border-2 border-white/20 bg-ink-darkest/40 from-white via-transparent to-white backdrop-blur-sm max-sm:h-full max-sm:w-full max-sm:!overflow-hidden max-sm:pb-[70px] sm:basis-[370px] sm:rounded-lg sm:rounded-r-none sm:border sm:border-primary-light">
			<ChatListSearch
				searchChat={searchChat}
				searchHandler={searchHandler}
			/>

			<div className="flex w-full grow flex-col overflow-y-auto max-sm:mt-[120px] sm:h-full">
				{loadingChats && <ChatListSkeleton />}
				{convos.map(
					(conversation: CombinedConversationResponseProps) => (
						<ChatListItem
							key={conversation._id}
							conversation={conversation}
							loggedInUser={loggedInUser}
						/>
					)
				)}
			</div>
		</div>
	);
};
