"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Skeleton } from "@/components/common/skeletons/skeleton";
import { SnowProfile } from "@/components/common/snow-profile";
import { Roles } from "@/lib/enums";
import { formatDateHandler, sentenceCase } from "@/lib/utils";
import type { RecipientResponseProps } from "@/providers/socket-types";

export const ChatBoxHeader = ({
	sender,
	time,
	className,
}: {
	sender: RecipientResponseProps;
	time: string;
	className?: string;
}): JSX.Element => {
	const router = useRouter();
	const isPartner = sender.role === Roles.PARTNER;
	const name = isPartner
		? sender?.firstName
		: `${sender?.firstName} ${sender?.lastName}`;
	return (
		<div
			className={`flex items-center justify-start gap-2 border-b border-[#ffffff]/50  pb-3 shadow-lg ${className}`}
		>
			<Button
				variant="ghost"
				onClick={() => {
					router.push("/messages");
				}}
				className="p-0 sm:hidden"
			>
				<ChevronLeft className="text-white" />
			</Button>
			<div className="flex flex-row items-center gap-2">
				{((sender.score !== 0 && !sender.profile.bio.title) ?? "") ? (
					<Skeleton className="h-[65px] w-[65px] rounded-full" />
				) : (
					<SnowProfile
						score={parseInt(sender.meta?.tokenId || "") ?? 0}
						src={sender.profileImage.url}
						url={`/members/${sender._id}`}
						size="sm"
						isPartner={isPartner}
						className="max-sm:scale-[0.9]"
					/>
				)}
				<div className="flex flex-col items-start gap-1">
					{name ? (
						<div className="text-lg font-medium leading-none text-white">
							{name}
						</div>
					) : (
						<Skeleton className="h-5 w-40" />
					)}
					{((sender?.profile?.bio?.title || "Builder") ?? "") ? (
						<div className="text-sm leading-none text-white">
							{sentenceCase(
								sender?.profile?.bio?.title || "Builder"
							)}
						</div>
					) : (
						<Skeleton className="h-5 w-32" />
					)}
				</div>
			</div>
			{time ? (
				<span className="hidden text-body sm:block">
					Started:{" "}
					<span className="!text-white">
						{formatDateHandler(time)}
					</span>
				</span>
			) : (
				<Skeleton className="h-5 w-40" />
			)}
		</div>
	);
};
