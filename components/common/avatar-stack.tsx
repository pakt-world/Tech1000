"use client";

import React, { FC } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { Member } from "@/lib/types/groups";
import { DefaultAvatar } from "./default-avatar";

interface AvatarStackProps {
	members?: Member[];
	memberCount: number;
}

const AvatarStack: FC<AvatarStackProps> = ({ members, memberCount }) => {
	const maxVisibleAvatars = 4;
	const displayedMembers = members?.slice(0, maxVisibleAvatars);
	const remainingCount = members ? members?.length - maxVisibleAvatars : 0;

	return (
		<>
			{members?.length ? (
				<div className="relative mb-8 flex">
					{displayedMembers?.map((member, index) => (
						<Avatar.Root
							key={member._id}
							className="absolute h-9 w-9"
							style={{
								left: index * 22,
							}}
						>
							{member?.memberProfile?.profileImage ? (
								<Avatar.Image
									src={member?.memberProfile?.profileImage}
									className=" h-9 w-9 rounded-full border-2 border-white"
									alt={`Profile image of member ${index + 1}`}
									style={{
										left: index * 22,
									}}
								/>
							) : (
								<div className=" h-9 w-9 rounded-full border-2 border-white">
									<DefaultAvatar />
								</div>
							)}
							<Avatar.Fallback />
						</Avatar.Root>
					))}
					{remainingCount > 0 && (
						<div
							className="absolute flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-sm text-ink-darkest"
							style={{ left: 4 * 22, zIndex: 1 }}
						>
							+{remainingCount}
						</div>
					)}
				</div>
			) : (
				<div className="flex justify-center rounded-full bg-[#B2E9AA1A] px-3.5 py-1 text-center text-sm text-white">{`${memberCount || 0} member${memberCount > 1 ? "s" : ""}`}</div>
			)}
		</>
	);
};

export default AvatarStack;
