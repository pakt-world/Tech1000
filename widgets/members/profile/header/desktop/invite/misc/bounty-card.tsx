"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyAmountAndSlot } from "@/components/common/bounty-amount-and-slot";
import { Button } from "@/components/common/button";
import { isBountySlot } from "@/lib/actions";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { CollectionInviteStatus } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";
import { cn } from "@/lib/utils";

interface BountyCardProps {
	bounty: CollectionProps;
	isSelected: boolean;
	setBountyId: (bountyId: string) => void;
	rates: ExchangeRateRecord | undefined;
}

export const BountyCard = ({
	bounty,
	setBountyId,
	isSelected,
	rates,
}: BountyCardProps): ReactElement | null => {
	const realTimeRate = rates
		? (rates[bounty?.meta.coin?.reference] as number)
		: 0;

	const acceptedSlot =
		bounty.collections
			.filter(isBountySlot)
			?.filter(
				(slot) =>
					slot.invite?.status === CollectionInviteStatus.ACCEPTED
			).length ?? 0;

	return (
		<Button
			className={cn(
				"flex w-full cursor-pointer flex-col items-start gap-2 rounded-3xl border !border-red-300 border-opacity-50 !bg-transparent !p-4 duration-200 hover:shadow-md",
				{
					"border-2 !border-white shadow-lg": isSelected,
				}
			)}
			onClick={() => {
				setBountyId(bounty._id);
			}}
			type="button"
		>
			<div className="flex w-full items-center justify-between">
				<span className="text-base font-medium text-white">
					Created: {format(new Date(bounty.createdAt), "dd MMM yyyy")}
				</span>
				<BountyAmountAndSlot
					coin={bounty?.meta?.coin}
					paymentFee={bounty?.paymentFee}
					acceptedSlot={acceptedSlot}
					totalSlot={bounty.meta.slotCount}
					realTimeRate={realTimeRate}
					spotVariant="dark"
					amountVariant="dark"
					isPartner
				/>
			</div>
			<div className="flex h-[80px] grow items-center">
				<p className="text-xl text-white">{bounty.name}</p>
			</div>
			<div className="flex items-center gap-2">
				{bounty.tags.slice(0, 3).map(({ color, name }) => (
					<span
						key={name}
						className="rounded-full bg-slate-100 px-4 py-0.5 capitalize text-black"
						style={{ backgroundColor: color }}
					>
						{name}
					</span>
				))}
			</div>
		</Button>
	);
};
