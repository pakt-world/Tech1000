"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { SnowProfile } from "@/components/common/snow-profile";
import { getUnreadCount } from "@/hooks/use-unread-chats";
import { getLastMessage, getLastMessageTime, getSender } from "@/lib/actions";
import { MediaEnums, Roles } from "@/lib/enums";
import { formatTimestampForDisplay, getPreviewByType2 } from "@/lib/utils";
import type { CombinedConversationResponseProps } from "@/providers/socket-types";

interface ChatListItemProps {
	conversation: CombinedConversationResponseProps;
	loggedInUser: string;
}

const ChatListItemComponent = ({
	conversation,
	loggedInUser,
}: ChatListItemProps) => {
	const router = useRouter();

	const pathname = usePathname();

	const urlChatId = pathname.split("/")[2];
	const isActiveChat = urlChatId === conversation._id;

	const sender = getSender(loggedInUser, conversation.recipients);

	const isPartner =
		sender.type === Roles.PARTNER || sender.type === Roles.CREATOR;
	const lastMessage = getLastMessage(conversation.messages ?? []);
	const lastMessageTime = getLastMessageTime(conversation.messages ?? []);
	const lmt =
		lastMessageTime !== ""
			? formatTimestampForDisplay(lastMessageTime)
			: "";
	const socketStatus = sender?.socket?.status;
	const unreadCount = getUnreadCount(conversation, loggedInUser);

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() => {
				router.push(`/messages/${conversation._id}`);
			}}
			className="border-b !border-[#FF98984D]"
		>
			<div
				className={`flex w-full items-center gap-2 border-l-4 px-3 py-2 duration-200 hover:bg-[#000000]/70 ${
					isActiveChat
						? " !border-[#F2C44C]  !bg-[#E8E8E833]/20"
						: "border-transparent bg-transparent"
				}`}
			>
				<SnowProfile
					score={parseInt(sender?.meta?.tokenId || "") || 0}
					src={sender.profileImage?.url}
					size="sm"
					url={`/members/${sender._id}`}
					isPartner={isPartner}
				/>
				<div className="flex grow flex-col">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<div className="text-base font-medium text-white">
								{sender.type === Roles.CREATOR
									? sender?.firstName
									: `${sender?.firstName} ${sender?.lastName}`}
							</div>
							{unreadCount > 0 && (
								<div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-xs text-white text-opacity-80">
									{unreadCount}
								</div>
							)}
						</div>
						<div className="flex flex-col items-end gap-2">
							<p className="text-xs text-body">{lmt}</p>
							<div
								className={`h-2 w-2 rounded-full ${
									socketStatus === "ONLINE"
										? "bg-green-500"
										: socketStatus === "OFFLINE"
											? "bg-gray-500"
											: ""
								}`}
							/>
						</div>
					</div>
					{lastMessage === MediaEnums.IMAGE_PNG ||
					lastMessage === MediaEnums.PDF ||
					lastMessage === MediaEnums.DOC ||
					lastMessage === MediaEnums.IMAGE_JPEG ||
					lastMessage === MediaEnums.IMAGE_JPG ? (
						<Image
							className="!h-[30px] !w-[30px] rounded-lg bg-opacity-30 !object-contain"
							src={
								(lastMessage ?? "") &&
								getPreviewByType2(lastMessage ?? "").preview
							}
							alt="upload-picture"
							width={30}
							height={30}
							objectFit="contain"
						/>
					) : (
						<div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-body">
							{lastMessage && lastMessage.length > 30
								? `${lastMessage.slice(0, 30)}...`
								: lastMessage}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const typedMemo: <T>(c: T) => T = React.memo;
export const ChatListItem = typedMemo(ChatListItemComponent);
