import { useEffect, useState } from "react";

import type { CombinedConversationResponseProps } from "@/providers/socket-types";

export const getUnreadCount = (
	conversation: CombinedConversationResponseProps,
	loggedInUser: string
): number => {
	let unreadCount = 0;
	const messages = conversation.messages ?? [];
	messages.forEach((message) => {
		// Check if the message is not read by the current user
		if (
			!message.readBy?.includes(loggedInUser) &&
			message.user !== loggedInUser
		) {
			unreadCount++;
		}
	});

	return unreadCount;
};

export const setUnreadChats = (
	conversations: CombinedConversationResponseProps[],
	loggedInUser: string,
	setUnreadChatCount: (unread: number) => void
): void => {
	const unread = conversations.reduce((totalUnread, conversation) => {
		const unreadCount = getUnreadCount(conversation, loggedInUser);
		return totalUnread + unreadCount;
	}, 0);

	setUnreadChatCount(unread);
};

// Custom hook to use unread chats
export const useUnreadChats = (
	conversations: CombinedConversationResponseProps[],
	loggedInUser: string
): number => {
	const [unreadChatCount, setUnreadChatCount] = useState<number>(0);

	useEffect(() => {
		setUnreadChats(conversations, loggedInUser, setUnreadChatCount);
	}, [conversations, loggedInUser]);

	return unreadChatCount;
};

// Set unread chats count
// setUnreadChats(DATA, loggedInUser);
