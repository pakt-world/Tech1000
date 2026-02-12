/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type {
	CombinedConversationResponseProps,
	CombinedMessageProps,
	RecipientResponseProps,
} from "@/providers/socket-types";

import { Roles } from "../enums";
import { formatDateHandler } from "../utils";
import { CollectionProps } from "../types/collection";

export const getSender = (
	loggedInUser: string,
	recipients: RecipientResponseProps[] = [],
	noError: boolean = true
): RecipientResponseProps => {
	const sender = recipients.find(
		(r: RecipientResponseProps) => r._id !== loggedInUser
	);
	if (!noError) {
		if (!sender) {
			throw new Error("Sender not found");
		}
	}
	if (sender === undefined) {
		return {
			profile: {
				bio: {
					title: "",
					description: "",
				},
			},
			socket: {
				status: "",
			},
			_id: "",
			firstName: "",
			lastName: "",
			score: 0,
			profileImage: {
				_id: "",
				url: "",
			},
			type: Roles.EMPTY,
			role: Roles.EMPTY,
		};
	}
	return sender;
};
export const getRecipient = (
	loggedInUser: string,
	recipients: RecipientResponseProps[] = [],
	noError: boolean = true
): RecipientResponseProps => {
	const recipient = recipients.find(
		(r: RecipientResponseProps) => r._id === loggedInUser
	);
	if (!noError) {
		if (!recipient) {
			throw new Error("Recipient not found");
		}
	}

	if (recipient === undefined) {
		return {
			profile: {
				bio: {
					title: "",
					description: "",
				},
			},
			socket: {
				status: "",
			},
			_id: "",
			firstName: "",
			lastName: "",
			score: 0,
			profileImage: {
				_id: "",
				url: "",
			},
			type: Roles.EMPTY,
			role: Roles.EMPTY,
		};
	}

	return recipient;
};

export const groupMessagesByDate = (
	msgs: CombinedMessageProps[]
): Array<[string, CombinedMessageProps[]]> => {
	// Grouping the messages by date
	const grouped = msgs.reduce<Record<string, CombinedMessageProps[]>>(
		(acc, message) => {
			const dateKey = formatDateHandler(message.createdAt, "YYYY-MM-DD");
			if (!acc[dateKey]) {
				acc[dateKey] = [];
			}
			acc[dateKey]?.push(message);
			return acc;
		},
		{}
	);

	// Converting the object into an array and sorting by date
	return Object.entries(grouped).sort(
		(a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
	);
};

export const getLastMessage = (messages: CombinedMessageProps[]): string => {
	const lastMessage = messages[messages.length - 1];
	const lstMsg =
		lastMessage?.content !== ""
			? lastMessage?.content
			: (lastMessage?.attachments?.[0]?.type ?? "");
	return lstMsg ?? "";
};

export const getLastMessageTime = (
	messages: CombinedMessageProps[]
): string => {
	if (messages.length === 0) {
		return ""; // or any default value you prefer
	}
	const lastMessage = messages[messages.length - 1] ?? messages[0];
	return lastMessage?.createdAt ?? "";
};

export const getConversationById = (
	messageId: string,
	allConversations: CombinedConversationResponseProps[],
	noError: boolean = true
): CombinedConversationResponseProps => {
	const convo = allConversations.find(
		(c: CombinedConversationResponseProps) => c._id === messageId
	);
	if (!noError) {
		if (!convo) {
			throw new Error("Conversation not found");
		}
	}

	if (convo === undefined) {
		return {
			_id: "",
			type: "",
			recipients: [],
			messages: [],
			createdAt: "",
			updatedAt: "",
			__v: 0,
			title: "",
			description: "",
		};
	}

	return convo;
};

export const parseMessages = (
	messages: Array<[string, CombinedMessageProps[]]>,
	loggedInUser: string
): Array<[string, CombinedMessageProps[]]> =>
	messages.map(([date, msgs]) => [
		date,
		msgs.map((m) => ({
			...m,
			isSent: m.user === loggedInUser,
			isRead: !!m.readBy?.includes(loggedInUser),
			timestamp: m.createdAt,
		})),
	]);

export const talentAndClientHasReviewed = (
	job: CollectionProps
): boolean | undefined => {
	return (
		job.ratings?.some((review) => review.owner?._id === job.owner?._id) &&
		job.ratings?.some((review) => review.owner?._id === job.creator?._id)
	);
};

// Useful for Group chats and Direct Messages - Referenced for searching chats
export const getConversationHeader = (
	conversation: CombinedConversationResponseProps,
	loggedInUser: string
):
	| {
			_id: string | undefined;
			title: string;
			description: string;
			avatar: string;
			score: number;
	  }
	| {
			title: string | undefined;
			description: string | undefined;
			score: number;
			avatar: string;
			_id?: undefined;
	  } => {
	const sender = getSender(loggedInUser, conversation.recipients);

	return conversation.type === "DIRECT"
		? {
				_id: sender?._id,
				title:
					sender?.type === "creator"
						? sender?.firstName
						: `${sender?.firstName}`,
				description: sender?.profile?.bio?.title ?? "",
				avatar: sender?.profileImage?.url ?? "",
				score: sender?.score ?? 0,
			}
		: {
				title: conversation.title,
				description: conversation.description,
				score: 0,
				avatar: "",
			};
};

// Filter through conversation and remove the data with just one recipient - recipient is meant to be an array of 2 object (Direct Message)
export const removeSingleRecipientMessages = (
	allConversations: CombinedConversationResponseProps[]
): CombinedConversationResponseProps[] => {
	return allConversations.filter(
		(message) => (message.recipients?.length ?? 0) > 1
	);
};

export const whichUserTyping = (
	id: string,
	loggedInUser: string,
	currentConversationId: string,
	messageId: string,
	sender: RecipientResponseProps
): string => {
	if (id !== loggedInUser && currentConversationId === messageId) {
		const s = sender._id === id;
		if (s) {
			const senderName = `${sender?.firstName}`;
			const un = `${undefined} ${undefined}`;
			return `${`${senderName !== un ? `${senderName} is typing...` : ""}`}`;
		}
	}
	return "";
};
