"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type { AxiosProgressEvent } from "axios";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import type {
	UploadImageParams2,
	UploadImageResponse2,
} from "@/lib/api/upload";
import { uploadAttachmentWithProgress } from "@/lib/api/upload";
import { MessageTypeEnums } from "@/lib/enums";
import { generateUniqueId } from "@/lib/utils";
import type {
	AttachmentsSendingProps,
	CombinedAttachmentType,
	TemporaryBubbleProps,
} from "@/providers/socket-types";
import Logger from "@/lib/utils/logger";

export const useMessageQueue = (
	recipientId: string,
	senderId: string,
	content: string,
	conversationId: string,
	imageFiles: AttachmentsSendingProps[],
	sendUserMessage: {
		(
			type: MessageTypeEnums,
			content: string,
			conversationId: string,
			attachments: CombinedAttachmentType[],
			messageToSendId: string,
			onSuccess: () => void
		): Promise<void>;
	},
	// Actions
	setText: (text: string) => void,
	setImageFiles: (files: AttachmentsSendingProps[]) => void,
	messageQueue: TemporaryBubbleProps[],
	setMessageQueue: Dispatch<SetStateAction<TemporaryBubbleProps[]>>,
	// temporaryMessages: TemporaryBubbleProps[],
	setTemporaryMessages: Dispatch<SetStateAction<TemporaryBubbleProps[]>>
) => {
	const [isSending, setIsSending] = useState(false);
	const sendingPromise = useRef<Promise<void> | null>(null);
	const sendLock = useRef<boolean>(false);

	const updateTemporaryMessageProgress = useCallback(
		(messageId: string, fileName: string, progress: number) => {
			setTemporaryMessages((prevMessages: TemporaryBubbleProps[]) =>
				prevMessages.map((msg: TemporaryBubbleProps) => {
					if (msg._id === messageId) {
						return {
							...msg,
							attachments: msg.attachments.map(
								(att: CombinedAttachmentType) =>
									att.file?.name === fileName
										? { ...att, uploadProgress: progress }
										: att
							),
						};
					}
					return msg;
				})
			);
		},
		[setTemporaryMessages]
	);

	const uploadAttachments = useCallback(
		async (
			messageId: string,
			attachments: AttachmentsSendingProps[]
		): Promise<CombinedAttachmentType[]> => {
			const uploadParams: UploadImageParams2[] = attachments.map(
				(attachment) => ({
					file: attachment.file,
					onProgressEvent: (progressEvent: AxiosProgressEvent) => {
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) /
								(progressEvent.total || 1)
						);
						updateTemporaryMessageProgress(
							messageId,
							attachment.file.name,
							percentCompleted
						);
					},
				})
			);
			try {
				const uploadedResponses: UploadImageResponse2[] =
					await uploadAttachmentWithProgress(uploadParams);

				if (!uploadedResponses) {
					toast.error("Uploaded responses are undefined");
				}
				return attachments.map((attachment, index) => ({
					...attachment,
					url: uploadedResponses[index]?.url ?? "", // Assuming the UploadImageResponse has a url field
					_id: uploadedResponses[index]?._id ?? "",
					uploadProgress: 100,
				}));
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error uploading attachments";
				toast.error(errorMessage);
				throw error;
			}
		},
		[updateTemporaryMessageProgress]
	);

	const sendMessage = useCallback(
		async (messageToSend: TemporaryBubbleProps) => {
			if (sendLock.current) {
				Logger.warn("Send operation already in progress, skipping");
				return;
			}

			Logger.info("Starting send operation for message:", {
				msgId: messageToSend._id,
			});
			sendLock.current = true;
			setIsSending(true);

			try {
				let uploadedAttachments: CombinedAttachmentType[] = [];
				if (
					messageToSend.attachments &&
					messageToSend.attachments.length > 0
				) {
					const validAttachments = messageToSend.attachments.filter(
						(attachment) => attachment.file !== undefined
					) as AttachmentsSendingProps[];

					uploadedAttachments = await uploadAttachments(
						messageToSend._id,
						validAttachments
					);
				}

				// Send the message
				await sendUserMessage(
					messageToSend.type,
					messageToSend.content,
					messageToSend.conversationId,
					// messageToSend.attachments,
					uploadedAttachments,
					messageToSend._id,
					() => {
						// This callback will be called when the socket emit is successful
						// Remove the sent message from both the queue and temporary state
						setMessageQueue((prev) => prev.slice(1));
						setTemporaryMessages((prev) =>
							prev.filter((msg) => msg._id !== messageToSend._id)
						);
					}
				);
			} catch (error) {
				// Handle failure (e.g., retry or show error message)
				// Handle the case where currentConversation or its properties are null or undefined
				toast.error(
					"currentConversation, recipient, or sender is null or undefined"
				);
			} finally {
				setIsSending(false);
				sendLock.current = false;
				Logger.info("Finished send operation for message:", {
					msgId: messageToSend._id,
				});
			}
		},
		[
			sendUserMessage,
			setMessageQueue,
			setTemporaryMessages,
			uploadAttachments,
		]
	);

	// Debounce the sending function to handle rapid typing
	// Debounce the function to avoid sending messages too rapidly
	const sendQueuedMessages = useCallback(async () => {
		if (
			messageQueue.length > 0 &&
			!isSending &&
			!sendingPromise.current &&
			!sendLock.current
		) {
			const messageToSend = messageQueue[0] as TemporaryBubbleProps; // Get the first message in the queue
			sendingPromise.current = sendMessage(messageToSend);
			await sendingPromise.current;
			sendingPromise.current = null;
		}
	}, [messageQueue, isSending, sendMessage]);

	// useDebounce(debouncedSendQueuedMessages, 100); // Debounce with custom delay
	// Use useEffect instead of useDebounce
	useEffect(() => {
		const timer = setTimeout(() => {
			sendQueuedMessages();
		}, 100);

		return () => clearTimeout(timer);
	}, [messageQueue, sendQueuedMessages]);

	const queueMessage = useCallback(
		(newMessage: TemporaryBubbleProps) => {
			// Add the message to the queue
			setMessageQueue((prevQueue) => [...prevQueue, newMessage]);
			// Ensure only one instance of the temporary message is added
			setTemporaryMessages((prevMessages) => {
				if (!prevMessages.find((msg) => msg._id === newMessage._id)) {
					return [
						...prevMessages,
						{
							...newMessage,
							attachments: newMessage.attachments.map((att) => ({
								...att,
								uploadProgress: 0,
							})),
						},
					];
				}
				return prevMessages;
			});
		},
		[setMessageQueue, setTemporaryMessages]
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			sendQueuedMessages();
		}, 100);

		return () => clearTimeout(timer);
	}, [messageQueue, sendQueuedMessages]);

	const handleSendMessage = useCallback(() => {
		const newMessage: TemporaryBubbleProps = {
			_id: generateUniqueId(),
			recipientId,
			senderId,
			type: MessageTypeEnums.TEXT,
			content,
			attachments: imageFiles,
			conversationId,
			isSent: true,
			sending: true,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			timestamp: new Date().toISOString(),
		};
		// Add the message to the queue
		queueMessage(newMessage);
		// Clear the input field
		setText("");
		setImageFiles([]);
	}, [
		content,
		conversationId,
		imageFiles,
		queueMessage,
		recipientId,
		senderId,
		setImageFiles,
		setText,
	]);

	return {
		// temporaryMessages,
		handleSendMessage,
	};
};
