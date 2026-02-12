"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyAmountAndSlot } from "@/components/common/bounty-amount-and-slot";
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import type { CoinProps } from "@/lib/types/collection";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

export const PublicBountyCreatedFeed = ({
	creator,
	title,
	amount,
	feedId,
	bookmark,
	callback,
	close,
	realTimeRate,
	slotCount,
	coin,
	bountyId,
	isPartner,
}: {
	bountyId: string;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	realTimeRate: number;
	slotCount: number;
	coin: CoinProps;
	title: string;
	amount: string;
	feedId: string;
	bookmark: { active: boolean; id: string };
	callback?: () => void;
	close?: (id: string) => void;
	isPartner: boolean;
}): ReactElement => {
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	return tab ? (
		<div className="container_style relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl !border-[#48A7F8] px-4 pl-2">
			<SnowProfile
				score={creator?.score}
				src={creator?.avatar}
				size="lg"
				url={`/members/${creator?._id}`}
				disabled={!creator?._id}
				isPartner
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold leading-relaxed tracking-wide text-neutral-400">
						{creator?.name || "Deleted User"} created
					</h3>
					{close && (
						<X
							size={20}
							className="cursor-pointer text-white"
							onClick={() => {
								close(feedId);
							}}
						/>
					)}
				</div>
				<h3 className="text-2xl font-normal text-white">{title}</h3>
				<div className="mt-auto flex items-center justify-between">
					<div className="mt-auto flex items-center gap-2">
						<BountyAmountAndSlot
							coin={coin}
							paymentFee={Number(amount)}
							totalSlot={slotCount}
							realTimeRate={realTimeRate}
							amountVariant="light"
							spotVariant="light"
							isPartner={isPartner}
							spotType="empty"
							className="h-9 !text-base [&>*]:!text-base"
						/>
						<Button
							size="sm"
							variant="white"
							className="w-[120px]"
							onClick={() => {
								router.push(`/bounties/${bountyId}`);
							}}
						>
							See Details
						</Button>
						<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
							<Briefcase
								size={200}
								color="#F2F4F5"
								className="opacity-20"
							/>
						</div>
					</div>
					<RenderBookMark
						size={20}
						isBookmarked={bookmark?.active}
						type="feed"
						id={feedId}
						bookmarkId={bookmark?.id}
						callback={callback}
					/>
				</div>
			</div>
		</div>
	) : (
		<div className="container_style relative z-10 flex w-full flex-col gap-4 overflow-hidden !border-l-0 !border-r-0 border-b border-t !border-[#48A7F8]  bg-[#F9F9F9] px-[21px] py-4 sm:hidden">
			<div className="relative -left-[5px] flex items-center gap-2">
				<SnowProfile
					score={creator.score}
					src={creator.avatar}
					size="sm"
					url={`/members/${creator._id}`}
					isPartner
					disabled={!creator._id}
				/>
				<div className="inline-flex flex-col items-start justify-start">
					<p className="flex text-lg leading-[27px] tracking-wide text-gray-300">
						{creator.name} Created
					</p>
				</div>
			</div>

			<h3 className="text-lg font-normal text-white">{title}</h3>

			<div className="mt-3 flex items-center justify-between gap-2">
				<BountyAmountAndSlot
					coin={coin}
					paymentFee={Number(amount)}
					totalSlot={slotCount}
					realTimeRate={realTimeRate}
					amountVariant="light"
					spotVariant="light"
					isPartner={isPartner}
					spotType="empty"
				/>
				<RenderBookMark
					size={20}
					isBookmarked={bookmark.active}
					type="feed"
					id={feedId}
					bookmarkId={bookmark.id}
					callback={callback}
				/>
			</div>
			<Button
				size="md"
				variant="outline"
				className="w-[120px]"
				fullWidth
				onClick={() => {
					router.push(`/bounties/${bountyId}`);
				}}
			>
				See Details
			</Button>
		</div>
	);
};
