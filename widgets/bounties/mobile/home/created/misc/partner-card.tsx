"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyAmountAndSlot } from "@/components/common/bounty-amount-and-slot";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { SnowProfile } from "@/components/common/snow-profile";
import { type CoinProps } from "@/lib/types/collection";

interface PartnerBountyCardProps {
	bountyId: string;
	title: string;
	price: number;
	isCancelled?: boolean;
	totalDeliverables: number;
	completedDeliverables: number;
	talent: {
		id: string;
		name: string;
		avatar?: string;
		paktScore: number;
	};
	meta: {
		coin: CoinProps;
	};
	realTimeRate: number;
	slotInfo: {
		acceptedSlot: number;
		totalSlot: number;
	};
}

export const PartnerBountyCard = ({
	talent,
	price,
	title,
	bountyId,
	isCancelled,
	totalDeliverables,
	completedDeliverables,
	meta,
	realTimeRate,
	slotInfo,
}: PartnerBountyCardProps) => {
	const router = useRouter();

	const progress = Math.floor(
		(completedDeliverables / totalDeliverables) * 100
	);
	return (
		<div
			onClick={() => {
				router.push(`/bounties/${bountyId}/updates`);
			}}
			role="button"
			tabIndex={0}
			// Doesn't work
			onKeyDown={() => {}}
			className="primary_border-y flex w-full flex-col gap-1 bg-primary p-4"
		>
			<div className="flex w-full flex-col items-start gap-4">
				<div className="relative -left-2 flex items-center gap-4">
					<SnowProfile
						score={talent.paktScore}
						size="sm"
						src={talent.avatar}
						url={`/members/${talent.id}`}
					/>

					<span className="truncate text-base font-medium text-white min-[1440px]:w-[110px] 2xl:w-[150px] 2xl-5:w-auto">
						{talent?.name}
					</span>
				</div>
				<BountyAmountAndSlot
					coin={meta?.coin}
					paymentFee={price}
					acceptedSlot={slotInfo.acceptedSlot}
					totalSlot={slotInfo.totalSlot}
					realTimeRate={realTimeRate}
					spotType={slotInfo.acceptedSlot === 0 ? "empty" : "filled"}
					spotVariant="dark"
					amountVariant="dark"
					isPartner
				/>

				<div className="flex grow items-center break-words text-lg leading-normal tracking-wide text-white min-[1440px]:text-[22px]">
					{title}
				</div>
				<DeliverableProgressBar
					isCancelled={isCancelled}
					percentageProgress={progress}
					totalDeliverables={totalDeliverables}
					className="w-full max-w-none"
				/>
			</div>
		</div>
	);
};
