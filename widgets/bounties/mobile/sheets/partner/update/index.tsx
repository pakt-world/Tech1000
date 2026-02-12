"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronDown } from "lucide-react";
import { type FC, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { isBountyDeliverable } from "@/lib/actions";
import { useExchangeRateStore } from "@/lib/store/misc";
import { type CollectionProps } from "@/lib/types/collection";
import { DeliverablesStepper } from "@/widgets/bounties/misc/deliverables-stepper";

import { BountyUpdateHeader } from "./misc/header";

interface BountyUpdatesProps {
	bounty: CollectionProps;
}

export const PartnerBountyUpdates4Mobile: FC<BountyUpdatesProps> = ({
	bounty,
}) => {
	const [showDescription, setShowDescription] = useState(false);
	const deliverables = bounty?.collections.filter(isBountyDeliverable);

	const { data: rates } = useExchangeRateStore();
	const realTimeRate = rates
		? (rates[bounty?.parent?.meta?.coin?.reference] as number)
		: 0;

	return (
		<div className="flex grow flex-col">
			<div className="break-words bg-hover-gradient px-4 py-6 text-lg font-bold text-white">
				{bounty?.name}
			</div>
			<BountyUpdateHeader
				createdAt={bounty?.createdAt}
				profile={bounty?.owner ?? bounty?.creator}
				deliveryDate={bounty?.deliveryDate ?? ""}
				paymentFee={bounty?.paymentFee ?? 0}
				tags={bounty?.tags}
				// meta={bounty?.parent?.meta}
				realTimeRate={realTimeRate}
			/>
			<div
				className={`primary_border-y flex flex-col gap-2.5 overflow-hidden bg-primary-light p-4 text-white transition-all duration-300 ${showDescription ? "!h-[237px]" : "!h-[56px]"}`}
			>
				<Button
					className="m-0 flex w-full items-center justify-between p-0"
					type="button"
					onClick={() => {
						setShowDescription(!showDescription);
					}}
					variant="ghost"
				>
					<h3 className="text-base font-bold">Bounty Description</h3>
					<ChevronDown
						className={`h-6 w-6 transform duration-300 ${showDescription ? "rotate-[360deg]" : "rotate-[270deg]"}`}
					/>
				</Button>
				<p>{bounty?.description}</p>
			</div>
			<div className="flex grow flex-col p-4">
				<div className="mb-4">
					<h3 className="text-base font-bold text-white">
						Bounty Deliverables
					</h3>
					<p className="text-sm text-white">
						Deliverables will check off as the talent completes
						them.
					</p>
				</div>

				<DeliverablesStepper
					bountyProgress={bounty?.progress}
					bountyId={bounty?._id}
					bountyCreator={bounty?.creator._id}
					ambassadorId={String(bounty?.owner?._id)}
					readonly
					deliverables={deliverables.map((b) => ({
						bountyId: bounty?._id,
						bountyCreator: bounty?.creator._id,
						progress: b.progress,
						updatedAt: b.updatedAt,
						meta: b.meta,
						description: b.name,
						deliverableId: b._id,
					}))}
				/>
			</div>
		</div>
	);
};
