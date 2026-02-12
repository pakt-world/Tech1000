"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

import { isBountyDeliverable } from "@/lib/actions";
import { useExchangeRateStore } from "@/lib/store/misc";
import { type CollectionProps } from "@/lib/types/collection";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { DeliverablesStepper } from "@/widgets/bounties/misc/deliverables-stepper";

import { BountyUpdateHeader } from "./header";

interface BountyUpdatesProps {
	bounty: CollectionProps;
}

export const BountyUpdates: FC<BountyUpdatesProps> = ({ bounty }) => {
	const deliverables = bounty?.collections.filter(isBountyDeliverable);

	const { data: rates } = useExchangeRateStore();
	const realTimeRate = rates
		? (rates?.[bounty?.parent?.meta?.coin?.reference] as number)
		: 0;

	return (
		<>
			<div className="flex items-start justify-between bg-hover-gradient px-4 py-6 text-3xl font-bold text-white">
				<div className="max-w-[90%] break-words">{bounty?.name}</div>
			</div>
			<div className="container_style flex grow flex-col gap-6 px-4 py-6">
				<BountyUpdateHeader
					createdAt={bounty?.createdAt}
					profile={bounty?.owner ?? bounty?.creator}
					deliveryDate={bounty?.deliveryDate ?? "N/A"}
					paymentFee={bounty?.paymentFee ?? 0}
					tags={bounty?.tags}
					meta={bounty?.parent?.meta}
					realTimeRate={realTimeRate}
				/>

				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-bold text-white">
						Bounty Description
					</h3>
					<p className="input-style-2 rounded-xl p-3 text-white">
						{bounty?.description}
					</p>
				</div>
				<div className="flex grow flex-col gap-2">
					<div>
						<h3 className="text-lg font-bold text-white">
							Bounty Deliverables
						</h3>
						<p className="text-white">
							Deliverables will check off as the talent completes
							them.
						</p>
					</div>

					<div className="h-full grow">
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
			</div>
		</>
	);
};
