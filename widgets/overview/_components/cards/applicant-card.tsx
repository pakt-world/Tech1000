"use client";

// import { useRouter } from "next/navigation";
// import { X } from "lucide-react";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { FeedWrapper } from "../feed-wrapper";

import { SnowProfile } from "@/components/common/snow-profile";

import { Button } from "@/components/common/button";

// import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";
import { Tag } from "@/lib/types/groups";
import { FeedData } from "@/lib/types/feed";
import { useMediaQuery } from "usehooks-ts";

interface ApplicantCardType {
	feedId: string;
	type:
		| "group_invite"
		| "application_accepted"
		| "application_rejected"
		| "post"
		| "comment";
	title: string;
	description?: string;
	groupId?: string;
	data?: FeedData;
	isBookmarked?: boolean;
	bookmarkId?: string;
	score?: number;
	tags?: Tag[];
	dismissByID: (id: string) => void;
	viewType?: "bookmarked" | "others" | "post_comments";
	callback?: () => void;
	isDismissLoading?: boolean;
}

export const ApplicantCard = ({
	feedId,
	type,
	title,
	description,
	data,
	dismissByID,
	isDismissLoading,
}: ApplicantCardType): JSX.Element => {
	const isDesktop = useMediaQuery("(min-width: 1280px)");

	const handleMove = () => {
		//router.push(getRoute());
		dismissByID(feedId);
	};

	return (
		<FeedWrapper
			className={`h-full ${
				type === "application_accepted"
					? "!border-x-0 !border-t-2 border-b-0 border-t-[#23C16B] md:!border-x-2 md:!border-b-2 md:!border-[#29FF3F]/50"
					: "!border-x-0 !border-t-2 border-b-0 border-t-[#FF5247] md:!border-x-2 md:!border-b-2 md:!border-[#FC8688]/50"
			}`}
		>
			{isDesktop && <SnowProfile src={data?.image} size="lg" />}
			<div className="flex h-full w-full flex-col justify-between">
				<div className="flex h-full w-full flex-col items-start  gap-2">
					<div className="relative flex w-full items-start justify-between">
						<span className="md: gap:0 flex gap-2">
							{!isDesktop && (
								<SnowProfile src={data?.image} size="xs" />
							)}
							<h3 className="whitespace-break-spaces break-words text-lg font-bold text-lemon-green md:text-2xl">
								{title}
							</h3>
						</span>
					</div>
					<p className="whitespace-break-spaces break-words font-circular text-base text-[#F2F4F5]/50 md:text-xl md:text-white">
						{description}
					</p>
				</div>
				<div className="mt-2 flex w-full items-end justify-between md:mt-auto">
					<Button
						size="md"
						variant="outline"
						className="w-full rounded-full !border py-1.5 font-bold md:w-fit"
						onClick={() => handleMove()}
						disabled={isDismissLoading}
					>
						{isDismissLoading ? "Loading..." : "Mark as read"}
					</Button>
				</div>
			</div>
		</FeedWrapper>
	);
};
