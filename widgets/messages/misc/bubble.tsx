"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import type { ExtendedRegularMessage } from "@/hooks/use-virtualized-messages";
import { formatTimestampForDisplay } from "@/lib/utils";
import { RenderAttachmentViewer } from "@/widgets/messages/misc/single-attachment-view";

const Message = ({
	content,
	sender,
	timestamp,
}: {
	content: string;
	sender: boolean;
	timestamp: string;
}): JSX.Element => {
	const renderContentWithLinks = (): Array<string | JSX.Element> => {
		const urlRegex = /(\bhttps?:\/\/\S+)/gi;
		return content.split(urlRegex).map((part, index) => {
			if (part.match(urlRegex)) {
				return (
					<a
						key={index}
						href={part}
						target="_blank"
						rel="noopener noreferrer"
						className="cursor-pointer underline"
					>
						{part}
					</a>
				);
			}
			return part;
		});
	};

	return (
		<div
			className={`flex w-fit max-w-[320px] items-end whitespace-pre-line break-words px-5 py-2 sm:max-w-[37.5rem] ${sender ? "rounded-l-[1.875rem] rounded-tr-[1.875rem] bg-[#F2D3AF] text-title" : "rounded-r-[1.875rem] rounded-tl-[1.875rem] bg-[#6C3D23] text-white"}`}
		>
			<p className="line-clamp-[50] flex-1 whitespace-break-spaces">
				{renderContentWithLinks()}
			</p>
			<span className="float-right ml-4 whitespace-pre text-sm">
				{formatTimestampForDisplay(timestamp)}
			</span>
		</div>
	);
};

interface Props {
	message: ExtendedRegularMessage;
}

// Create a custom Bubble component for the virtualized list
export const Bubble = ({ message }: Props): JSX.Element => {
	return (
		<div className="h-auto w-full">
			<div
				style={{
					opacity: message.isTemporary ? 0.5 : 1,
					marginLeft:
						message.isTemporary || message.isSent ? "auto" : "0",
					marginTop: "4px",
					marginBottom: "4px",
					display: "flex",
					height: "auto",
					width: "fit-content",
					flexDirection: "column",
					paddingLeft: "1rem",
					paddingRight: "1rem",
				}}
				className="max-w-fit items-end sm:max-w-[37.5rem]"
			>
				{(message?.attachments ?? []).length > 0 && (
					<RenderAttachmentViewer
						images={message.attachments ?? []}
						align={
							message.isTemporary || message.isSent
								? "right"
								: "right"
						}
						timestamp={message.timestamp}
					/>
				)}
				{message.content && (
					<Message
						content={message.content}
						sender={
							message.isTemporary || (message.isSent as boolean)
						}
						timestamp={
							message.timestamp ?? new Date().toISOString()
						}
					/>
				)}
				{message.sending && (
					<span className="text-end text-xs text-white">
						Sending...
					</span>
				)}
			</div>
		</div>
	);
};
