"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { type FC, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyAmountAndSlot } from "@/components/common/bounty-amount-and-slot";
import { Button } from "@/components/common/button";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { SnowProfile } from "@/components/common/snow-profile";
import { type CoinProps, type CollectionProps } from "@/lib/types/collection";
import { PartnerBountySheet4Desktop } from "@/widgets/bounties/desktop/sheets/partner";
import { DesktopSheetWrapper } from "@/widgets/bounties/desktop/sheets/wrapper";

interface PartnerBountyCardProps {
	bountyId: string;
	title: string;
	price: number;
	isCompleted?: boolean;
	isCancelled?: boolean;
	totalDeliverables: number;
	completedDeliverables: number;
	talent: {
		id: string;
		name: string;
		avatar?: string;
		paktScore: number;
	};
	reviewRequestChange?: CollectionProps;
	bountyProgress?: number;
	meta?: {
		coin?: CoinProps;
	};
	realTimeRate: number;
	slotInfo: {
		acceptedSlot: number;
		totalSlot: number;
	};
}

export const PartnerBountyCard: FC<PartnerBountyCardProps> = ({
	talent,
	price,
	title,
	bountyId,
	isCancelled,
	totalDeliverables,
	completedDeliverables,
	isCompleted,
	reviewRequestChange,
	bountyProgress,
	meta,
	realTimeRate,
	slotInfo,
}) => {
	const router = useRouter();
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const progress = Math.floor(
		(completedDeliverables / totalDeliverables) * 100
	);
	return (
		<div className="container_style flex w-full grow flex-col gap-1 rounded-3xl p-4 pt-0">
			<div className="flex w-full gap-4">
				<div className="-ml-3">
					<SnowProfile
						score={talent.paktScore}
						size="md"
						src={talent.avatar}
						url={`/members/${talent.id}`}
					/>
				</div>
				<div className="-ml-3 flex grow flex-col gap-2 pt-4">
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm font-bold text-white min-[1440px]:text-lg">
							{talent.name}
						</span>

						<BountyAmountAndSlot
							coin={meta?.coin}
							paymentFee={price}
							realTimeRate={realTimeRate}
							spotVariant="dark"
							amountVariant="dark"
							isPartner
							acceptedSlot={slotInfo.acceptedSlot}
							totalSlot={slotInfo.totalSlot}
						/>
					</div>
					<div className="flex grow items-center break-words text-lg leading-normal tracking-wide text-white min-[1440px]:text-[22px]">
						{title}
					</div>
				</div>
			</div>
			<div className="mt-auto flex w-full items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					{!isCompleted && (
						<Button
							size="md"
							variant="white"
							onClick={() => {
								setIsUpdateModalOpen(true);
							}}
						>
							{bountyProgress === 100
								? reviewRequestChange
									? "View Request"
									: "Review"
								: "See Updates"}
						</Button>
					)}
					<Button
						size="md"
						variant="outline"
						onClick={() => {
							router.push(`/messages?userId=${talent.id}`);
						}}
					>
						Message Talent
					</Button>
				</div>

				<DeliverableProgressBar
					isCancelled={isCancelled}
					percentageProgress={progress}
					totalDeliverables={totalDeliverables}
					className="w-full max-w-none"
				/>

				<DesktopSheetWrapper
					isOpen={isUpdateModalOpen}
					onOpenChange={() => {
						setIsUpdateModalOpen(false);
					}}
					className="flex flex-col"
				>
					<PartnerBountySheet4Desktop
						bountyId={bountyId}
						ambassadorId={talent.id}
						closeModal={() => {
							setIsUpdateModalOpen(false);
						}}
					/>
				</DesktopSheetWrapper>
			</div>
		</div>
	);
};
