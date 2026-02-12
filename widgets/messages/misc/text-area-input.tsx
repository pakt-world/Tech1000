"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type { EmojiClickData } from "emoji-picker-react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import type {
	Dispatch,
	ForwardedRef,
	KeyboardEvent,
	SetStateAction,
} from "react";
import React, { forwardRef, useCallback, useState } from "react";
import type { DropzoneInputProps } from "react-dropzone";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import type { AttachmentsSendingProps } from "@/providers/socket-types";
import { RenderAttachmentPreviewer } from "@/widgets/messages/misc/render-attachment-viewer";

interface Props {
	text: string;
	setText: Dispatch<SetStateAction<string>>;
	handleTyping: () => void;
	handleSendMessage: () => void;
	getRootProps: <T extends DropzoneInputProps>(props?: T) => T;
	getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
	open: () => void;
	removeImg: (id: string) => void;
	imageFiles: AttachmentsSendingProps[];
	recipientName: string;
}

const TextAreaInput = forwardRef(
	(
		{
			text,
			setText,
			handleSendMessage,
			handleTyping,
			getRootProps,
			getInputProps,
			open,
			removeImg,
			imageFiles,
			recipientName = "",
		}: Props,
		ref: ForwardedRef<HTMLDivElement | null>
	): JSX.Element => {
		const tab = useMediaQuery("(min-width: 640px)");

		const [showEmoji, setShowEmoji] = useState(false);

		// Memoize the onKeyDownPress function
		const onKeyDownPress = useCallback(
			async (e: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
				handleTyping();
				if (e.which === 13 && !e.shiftKey) {
					e.preventDefault();
					return handleSendMessage();
				}
			},
			[handleTyping, handleSendMessage]
		);

		// Memoize the onChange handler
		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
				const { value } = e.target;

				// Trim the start of the string to prevent leading spaces
				setText(value.trimStart());
			},
			[setText]
		);

		const handleEmojiClick = (
			emojiData: EmojiClickData,
			event: MouseEvent
		) => {
			const { emoji } = emojiData;
			setText((prevMsg: string) => prevMsg + emoji);
			setShowEmoji(false);
			// Prevent the default behavior of the event
			event.preventDefault();
		};

		return tab ? (
			<div
				className="mt-2 flex w-full flex-col gap-2 !rounded-2xl border !border-[#E8E8E833] !bg-[#E8E8E833]/20"
				{...getRootProps()}
			>
				<div className="flex w-full flex-col border-b border-[#E8E8E833] p-4">
					<textarea
						rows={1}
						className="w-full grow resize-none rounded-t-lg bg-transparent p-2 font-circular text-base text-white focus:outline-none"
						placeholder={`Message ${recipientName}`}
						value={text}
						onChange={handleChange}
						onKeyDown={onKeyDownPress}
					/>
					<RenderAttachmentPreviewer
						images={imageFiles}
						removeImage={removeImg}
					/>
				</div>
				<div className="relative flex w-full items-center justify-between px-4 py-[.5625rem]">
					<div className="flex w-max items-center gap-2 ">
						<button
							className="flex size-8 items-center justify-center rounded-full bg-[#FFFFFF1A] text-white"
							onClick={open}
							type="button"
						>
							<Paperclip size={16} />
							<input {...getInputProps()} />
						</button>

						<div className="relative">
							<Button
								className="flex !size-8 items-center justify-center rounded-full bg-[#FFFFFF1A] p-0 text-white"
								onClick={() => {
									setShowEmoji(true);
								}}
								type="button"
								variant="ghost"
							>
								<Smile size={16} />
							</Button>
						</div>

						{showEmoji && (
							<EmojiPicker
								className="!absolute !bottom-32 !left-0 border-primary-lighter !bg-primary"
								onEmojiClick={handleEmojiClick}
								theme={Theme.DARK}
								emojiStyle={EmojiStyle.APPLE}
								// lazyLoadEmojis
								customEmojis={[
									{
										names: ["Pakt"],
										imgUrl: "/icons/PAKT-EMOJI.png",
										id: ":pakt:",
									},
								]}
							/>
						)}
					</div>
					<Button
						type="button"
						aria-label="Send"
						variant="ghost"
						className="flex !size-8 -rotate-45 items-center justify-center rounded-full border bg-sky-lighter p-0 text-primary"
						onClick={handleSendMessage}
						disabled={text === "" && imageFiles.length === 0}
					>
						<SendHorizonal size={16} />
					</Button>
				</div>
			</div>
		) : (
			<div
				className="fixed bottom-0 flex min-h-[80px] w-full items-center gap-2 bg-primary-light !py-3 px-2"
				ref={ref}
				{...getRootProps()}
			>
				<button
					className="relative flex size-8 items-center justify-center rounded-full bg-[#FFFFFF1A] text-white"
					onClick={open}
					type="button"
				>
					<Paperclip size={16} />
					<input {...getInputProps()} />
				</button>

				<div className="relative flex flex-1 flex-col rounded-2xl bg-primary p-2">
					<textarea
						id="messageTextarea"
						rows={1}
						className="relative w-full resize-none rounded-t-lg bg-transparent p-2 !text-base text-white focus:outline-none"
						placeholder={`Message ${recipientName}`}
						value={text}
						onChange={handleChange}
						onKeyDown={onKeyDownPress}
					/>
					<RenderAttachmentPreviewer
						images={imageFiles}
						removeImage={removeImg}
					/>
				</div>
				<button
					type="button"
					aria-label="Send"
					className="relative flex size-8 -rotate-45 items-center justify-center rounded-full border bg-sky-lighter text-primary"
					onClick={handleSendMessage}
					disabled={text === "" && imageFiles.length === 0}
				>
					<SendHorizonal size={16} />
				</button>
			</div>
		);
	}
);

// Set the display name for the component
TextAreaInput.displayName = "TextAreaInput";

// Memoize the TextAreaInput component
export const MemoizedTextAreaInput = React.memo(TextAreaInput);
