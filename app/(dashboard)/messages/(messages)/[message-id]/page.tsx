"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import ChatSkeleton from "@/components/common/skeletons/chat-skeleton";
import { RowVirtualizerDynamic } from "@/hooks/use-virtualized-messages";
import { getConversationById, getSender, whichUserTyping } from "@/lib/actions";
import { useUserState } from "@/lib/store/account";
import { useMessaging } from "@/providers/socket-provider";
import { Bubble } from "@/widgets/messages/misc/bubble";
import { ChatBoxHeader } from "@/widgets/messages/misc/chatbox-header";
import { MemoizedTextAreaInput } from "@/widgets/messages/misc/text-area-input";

interface Props {
	params: {
		"message-id": string;
	};
}

export default function ChatPage({ params }: Props): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const { "message-id": messageId } = params;
	const {
		currentConversation,
		setCurrentConversation,
		loadingChats,
		markUserMessageAsSeen,
		handleTyping,
		keyboardTyperId,
		allConversations,
		inputMessage,
		setInputMessage,
		handleSendMessage,
		flattenedMessages,
		getRootProps,
		getInputProps,
		open,
		removeImg,
		imageFiles,
	} = useMessaging();
	const { _id: loggedInUser } = useUserState();
	const loaded = useRef(false);

	const [loadingMessage, setLoadingMessages] = useState(true);

	const loadMessages = useCallback(async () => {
		markUserMessageAsSeen(messageId);
		const conversation = getConversationById(messageId, allConversations);
		setCurrentConversation(conversation);
		setTimeout(() => {
			setLoadingMessages(false);
		}, 2000);
	}, [
		allConversations,
		markUserMessageAsSeen,
		messageId,
		setCurrentConversation,
	]);

	useEffect(() => {
		if (!loadingChats) {
			if (loaded.current) return;
			loaded.current = true;
			loadMessages();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadingChats]);

	const sender = getSender(loggedInUser, currentConversation.recipients);

	const thisUserIsTyping = whichUserTyping(
		keyboardTyperId,
		loggedInUser,
		currentConversation._id ?? "",
		messageId,
		sender
	);

	if (loadingMessage) return <ChatSkeleton />;

	return tab ? (
		<div className="flex size-full grow flex-col rounded-r-2xl p-6 pt-3">
			<ChatBoxHeader
				sender={sender}
				time={currentConversation?.createdAt ?? "0"}
				className="relative justify-between"
			/>
			{flattenedMessages.length === 0 ? (
				<div className="flex h-full w-full grow flex-col items-center justify-center gap-1">
					<div className="text-2xl text-slate-300">
						No messages yet
					</div>
				</div>
			) : (
				<RowVirtualizerDynamic
					messages={flattenedMessages}
					Bubble={Bubble}
				/>
			)}
			{keyboardTyperId !== "" &&
				keyboardTyperId !== undefined &&
				keyboardTyperId !== null && (
					<p className="block p-2 text-xs font-normal italic text-sky sm:hidden">
						{thisUserIsTyping}
					</p>
				)}
			<MemoizedTextAreaInput
				text={inputMessage}
				setText={setInputMessage}
				handleSendMessage={handleSendMessage}
				handleTyping={handleTyping}
				getRootProps={getRootProps}
				getInputProps={getInputProps}
				open={open}
				imageFiles={imageFiles}
				removeImg={removeImg}
				recipientName={sender.firstName}
			/>

			{keyboardTyperId !== "" &&
				keyboardTyperId !== undefined &&
				keyboardTyperId !== null && (
					<p className="absolute bottom-[0.5rem] hidden text-xs font-normal italic text-sky sm:block">
						{thisUserIsTyping}
					</p>
				)}
		</div>
	) : (
		<div className="relative m-0 flex h-full w-full flex-col overflow-visible p-0 pb-10">
			<ChatBoxHeader
				sender={sender}
				time={currentConversation?.createdAt ?? "0"}
				className="fixed top-0 !z-50 h-[77px] w-full  bg-default bg-cover px-4 !pb-0"
			/>
			{flattenedMessages.length === 0 ? (
				<div className="relative flex w-full flex-1 grow basis-0 flex-col items-center justify-center overflow-y-auto">
					<div className="text-2xl text-slate-300">
						No messages yet
					</div>
				</div>
			) : (
				<div className="scrollbar-hide relative mb-[150px] flex h-full w-full flex-1 flex-col overflow-y-auto pt-[78px]">
					<RowVirtualizerDynamic
						messages={flattenedMessages}
						Bubble={Bubble}
					/>
				</div>
			)}
			{keyboardTyperId !== "" &&
				keyboardTyperId !== undefined &&
				keyboardTyperId !== null && (
					<p className="relative block p-2 text-xs font-normal italic text-sky sm:hidden">
						{thisUserIsTyping}
					</p>
				)}
			<MemoizedTextAreaInput
				text={inputMessage}
				setText={setInputMessage}
				handleSendMessage={handleSendMessage}
				handleTyping={handleTyping}
				getRootProps={getRootProps}
				getInputProps={getInputProps}
				open={open}
				imageFiles={imageFiles}
				removeImg={removeImg}
				recipientName={sender.firstName}
			/>

			{keyboardTyperId !== "" &&
				keyboardTyperId !== undefined &&
				keyboardTyperId !== null && (
					<p className="absolute !-top-8 hidden text-xs font-normal italic text-sky sm:block">
						{thisUserIsTyping}
					</p>
				)}
		</div>
	);
}
