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
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type CollectionStatus } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";
import { AmbassadorBountySheet4Desktop } from "@/widgets/bounties/desktop/sheets/ambassador";
import { DesktopSheetWrapper } from "@/widgets/bounties/desktop/sheets/wrapper";

interface TalentBountyCardProps {
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
	rates: ExchangeRateRecord | undefined;
}

export const TalentBountyCard: FC<TalentBountyCardProps> = ({
	client,
	price,
	title,
	bountyId,
	isCancelled,
	isCompleted,
	totalDeliverables,
	completedDeliverables,
	bounty,
	rates,
}) => {
	const router = useRouter();
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const progress = Math.floor(
		(completedDeliverables / totalDeliverables) * 100
	);
	const realTimeRate = (
		rates ? rates?.[bounty?.parent?.meta?.coin?.reference] : 0
	) as number;

	return (
		<div className="container_style flex w-full grow flex-col gap-1 rounded-3xl border p-4 pt-0">
			<div className="flex w-full gap-4">
				<div className="-ml-3">
					<SnowProfile
						size="md"
						src={client.avatar}
						isPartner
						url={`/members/${client.id}`}
					/>
				</div>
				<div className="-ml-3 flex grow flex-col gap-2 pt-4">
					<div className="flex w-full items-center justify-between gap-2">
						<span className="text-lg font-bold text-white">
							{client.name}
						</span>
						<BountyAmountAndSlot
							coin={bounty?.parent?.meta?.coin}
							paymentFee={price}
							realTimeRate={realTimeRate}
							spotVariant="dark"
							amountVariant="dark"
							isPartner={false}
							spotVisible={false}
						/>
					</div>

					<div className="flex grow items-center break-words text-2xl text-white">
						{title}
					</div>
				</div>
			</div>
			<div className="mt-auto flex w-full items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					{!isCompleted && (
						<Button
							size="sm"
							variant={isCancelled ? "destructive" : "white"}
							onClick={() => {
								setIsUpdateModalOpen(true);
							}}
							disabled={isCancelled as boolean}
							className="w-[133px]"
						>
							{isCancelled ? "Cancelled" : "Update"}
						</Button>
					)}

					<Button
						size="sm"
						variant="outline"
						onClick={() => {
							router.push(`/messages?userId=${client.id}`);
						}}
					>
						Message Partner
					</Button>
				</div>

				<DeliverableProgressBar
					isCancelled={isCancelled as boolean}
					totalDeliverables={totalDeliverables}
					percentageProgress={progress}
					className="w-full max-w-none"
				/>

				<DesktopSheetWrapper
					isOpen={isUpdateModalOpen}
					onOpenChange={() => {
						setIsUpdateModalOpen(false);
					}}
					className="flex flex-col"
				>
					<AmbassadorBountySheet4Desktop
						bountyId={bountyId}
						closeModal={() => {
							setIsUpdateModalOpen(false);
						}}
					/>
				</DesktopSheetWrapper>
			</div>
		</div>
	);
};
