"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyAmountAndSlot } from "@/components/common/bounty-amount-and-slot";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { SnowProfile } from "@/components/common/snow-profile";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type CollectionStatus } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";

interface AmbassadorBountyCardProps {
	bountyId: string;
	title: string;
	price: number;
	isCancelled?: CollectionStatus | boolean;
	isCompleted?: boolean;
	totalDeliverables: number;
	completedDeliverables: number;
	client: {
		id: string;
		name: string;
		avatar?: string;
	};
	bounty: CollectionProps;
	rating?: number;
	rates: ExchangeRateRecord | undefined;
}

export const AmbassadorBountyCard = ({
	client,
	price,
	title,
	rating,
	bountyId,
	isCancelled,
	isCompleted,
	totalDeliverables,
	completedDeliverables,
	bounty,
	rates,
}: AmbassadorBountyCardProps) => {
	const router = useRouter();

	const progress = Math.floor(
		(completedDeliverables / totalDeliverables) * 100
	);
	const realTimeRate = rates
		? (rates[bounty?.parent?.meta?.coin?.reference] as number)
		: 0;

	return (
		<div
			onClick={() => {
				router.push(`/bounties/${bountyId}/updates`);
			}}
			role="button"
			tabIndex={0}
			// Doesn't work
			onKeyDown={() => {}}
			className="primary_border-y flex w-full grow flex-col gap-4 bg-primary p-4 pt-0"
		>
			<div className="relative -left-2 flex items-center gap-4">
				<SnowProfile
					size="sm"
					src={client.avatar}
					url={`/members/${client.id}`}
					isPartner
				/>
				<span className="text-lg font-normal text-white">
					{client.name}
				</span>
			</div>
			<BountyAmountAndSlot
				coin={bounty?.parent?.meta?.coin}
				paymentFee={price}
				spotVisible={false}
				realTimeRate={realTimeRate}
				amountVariant="dark"
			/>
			<div className="flex grow items-center break-words text-lg text-white">
				{title}
			</div>

			<div
				className={`grid ${isCompleted ? "grid-cols-2" : "grid-cols-1"} items-center gap-1`}
			>
				{isCompleted && (
					/* @ts-expect-error --- Types Error */
					<Rating
						initialRating={rating}
						fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
						emptySymbol={
							<Star fill="transparent" color="#15D28E" />
						}
						readonly
					/>
				)}
				<DeliverableProgressBar
					isCancelled={isCancelled as boolean}
					totalDeliverables={totalDeliverables}
					percentageProgress={progress}
					className="w-full max-w-none"
				/>
			</div>
		</div>
	);
};
