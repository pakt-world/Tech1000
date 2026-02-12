/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type { Dispatch, SetStateAction } from "react";
import type { DropzoneInputProps } from "react-dropzone";
import { type Socket } from "socket.io-client";

import type { Message } from "@/hooks/use-virtualized-messages";
import type { MessageTypeEnums, Roles } from "@/lib/enums";

// ====== SOCKET RESPONSE ===== //

export interface SocketResponse<T> {
	data: T;
	error: boolean;
	message: string;
	statusCode: number;
}

// ====== SOCKET RESPONSE ===== //

// ====== ALL CHATS ===== //

interface Bio {
	title: string;
	description: string;
}

interface Profile {
	bio: Bio;
}

interface SocketProps {
	status: string;
}

interface ProfileImage {
	_id: string;
	url: string;
}

export interface RecipientResponseProps {
	profile: Profile;
	socket: SocketProps;
	_id: string;
	firstName: string;
	lastName: string;
	score: number;
	profileImage: ProfileImage;
	type?: Roles;
	role?: Roles;
	meta?: {
		tokenId: string;
	};
}

export interface AttachmentsSendingProps {
	file: File;
	_id: string;
	name: string;
	preview: string;
	size: string | number;
	type: string;
	progress?: number;
	createdAt?: string;
}

export interface AttachmentsResponseProps {
	_id: string;
	name?: string;
	type?: string;
	size?: string | number;
	url?: string;
	uploadProgress?: number;
}

// Create a type that makes all properties optional
export type CombinedAttachmentType = Partial<AttachmentsResponseProps> &
	Partial<AttachmentsSendingProps>;

export interface MessageResponseProps {
	attachments: CombinedAttachmentType[];
	content: string;
	conversation: string;
	createdAt: string;
	isRead: boolean;
	isSent: boolean;
	readBy: string[];
	seen: string | null;
	timestamp: string;
	type: MessageTypeEnums.TEXT;
	updatedAt: string;
	user: string;
	_id: string;
	__v: number;
}

export interface TemporaryBubbleProps {
	attachments: CombinedAttachmentType[];
	content: string;
	// conversation: string;
	createdAt: string;
	// isRead: boolean;
	isSent: boolean;
	// readBy: string[];
	// seen: string | null;
	timestamp: string;
	type: MessageTypeEnums.TEXT;
	updatedAt: string;
	// user: string;
	_id: string;
	// __v: number;
	recipientId: string; // Recipient ID
	senderId: string; // Sender ID
	conversationId: string; // Conversation ID
	sending: boolean; // Sending status
}

export type CombinedMessageProps = Partial<MessageResponseProps> &
	Partial<TemporaryBubbleProps>;

export interface ConversationResponseProps {
	_id: string;
	type: string;
	recipients: RecipientResponseProps[];
	messages: CombinedMessageProps[];
	createdAt: string;
	updatedAt: string;
	__v: number;
	// conversation.type !== "DIRECT" the below properties will be available
	title?: string;
	description?: string;
}

export type CombinedConversationResponseProps =
	Partial<ConversationResponseProps> & Partial<PopUpChatDataProps>;

export interface GetAllChatsResponseProps {
	messages: CombinedConversationResponseProps[];
}
export interface GetAllChatsResponseProps2 {
	chats: {
		messages: ConversationResponseProps[];
	};
	_id: string;
	createdAt: string;
	updatedAt: string;
	recipients: RecipientResponseProps[];
}

// ====== ALL CHATS ===== //

// ====== POP-UP MESSAGE ===== //

interface PopUpMessageProps {
	attachments: string[];
	content: string;
	conversation: string;
	createdAt: string;
	_id: string;
	user: string;
	type: string;
	seen: string | null;
	readBy: string[];
	updatedAt: string;
	__v: number;
}

interface Bio {
	title: string;
	description: string;
}

interface Profile {
	bio: Bio;
}

interface PopUpProfileImageProps {
	_id: string;
	url: string;
}

export interface PopUpRecipientProps {
	profile: Profile;
	socket: SocketProps;
	_id: string;
	firstName: string;
	lastName: string;
	score: number;
	profileImage: PopUpProfileImageProps;
}

export interface PopUpChatDataProps {
	messages: PopUpMessageProps[];
	totalMessagesCount: number;
}

export interface PopUpConversationDataProps {
	_id: string;
	chats: PopUpChatDataProps;
	recipients: PopUpRecipientProps[];
	createdAt: string;
	updatedAt: string;
	currentMessage: PopUpMessageProps;
	unreadMessagesCount: number;
}

// ====== POP-UP MESSAGE ===== //

// ====== INITIALIZE CONVERSATION ===== //

interface InitializeConversationProps {
	type: string;
	recipients: string[]; // Array of recipient IDs
	messages: string[]; // Define a 'Message' type if you have a structure for messages
	_id: string;
	createdAt: string; // ISO date string, consider using Date type
	updatedAt: string; // ISO date string, consider using Date type
	__v: number;
}

export interface InitializeMessageProps {
	conversation: InitializeConversationProps;
}

// ====== INITIALIZE CONVERSATION ===== //

export interface SocketContextType {
	socket: Socket | null;
	allConversations: CombinedConversationResponseProps[];
	currentConversation: CombinedConversationResponseProps;
	setCurrentConversation: (
		conversation: CombinedConversationResponseProps
	) => void;
	loadingChats: boolean;
	status: string;
	startingNewChat: boolean;
	startUserInitializeConversation: (recipientId: string) => Promise<void>;
	markUserMessageAsSeen: (conversation: string) => void;
	handleTyping: () => void;
	keyboardTyperId: string;
	flattenedMessages: Message[];
	handleSendMessage: () => void;
	inputMessage: string;
	setInputMessage: Dispatch<SetStateAction<string>>;
	getRootProps: <T extends DropzoneInputProps>(props?: T) => T;
	getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
	open: () => void;
	removeImg: (id: string) => void;
	imageFiles: AttachmentsSendingProps[];
	messageQueue: TemporaryBubbleProps[];
	setMessageQueue: Dispatch<SetStateAction<TemporaryBubbleProps[]>>;
	temporaryMessages: TemporaryBubbleProps[];
	setTemporaryMessages: Dispatch<SetStateAction<TemporaryBubbleProps[]>>;
}
