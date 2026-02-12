"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { isBountyCancellation, isBountyDeliverable } from "@/lib/actions";
import { useExchangeRateStore } from "@/lib/store/misc";
import { type CollectionProps } from "@/lib/types/collection";
import { DeliverablesStepper } from "@/widgets/bounties/misc/deliverables-stepper";

import { BountyUpdateHeader } from "../update/header";
import { AcceptBountyCancellation } from "./accept-bounty-cancellation";

interface BountyCancellationRequestProps {
	bounty: CollectionProps;
	// eslint-disable-next-line react/no-unused-prop-types
	closeModal: () => void;
}

export const BountyCancellationRequest: FC<BountyCancellationRequestProps> = ({
	bounty,
}) => {
	const [acceptCancellation, setAcceptCancellation] = useState(false);

	const {
		creator,
		createdAt,
		paymentFee,
		deliveryDate,
		name: bountyTitle,
		_id: bountyId,
		progress,
		owner,
		tags,
		collections,
		meta,
	} = bounty;

	const deliverables = collections.filter(isBountyDeliverable);
	const bountyCancellation = bounty.collections.find(isBountyCancellation);

	const { data: rates } = useExchangeRateStore();
	const realTimeRate = rates ? (rates[meta.coin?.reference] as number) : 0;

	if (!owner) return null;

	if (acceptCancellation) {
		return (
			<AcceptBountyCancellation
				bounty={bounty}
				ambassador={owner}
				setAcceptCancellation={setAcceptCancellation}
			/>
		);
	}

	return (
		<>
			<div className="flex items-center justify-between bg-gradient-to-r from-danger via-red-500 to-red-400 px-4 py-6 text-3xl font-bold text-white">
				<div className="flex items-center gap-2">
					<span>{bountyTitle}</span>
				</div>
			</div>
			<div className="container_style flex h-full grow flex-col gap-6 px-4 py-6 pb-6">
				<BountyUpdateHeader
					status="cancel_requested"
					createdAt={createdAt}
					profile={owner}
					deliveryDate={deliveryDate ?? "N/A"}
					paymentFee={paymentFee ?? 0}
					tags={tags}
					meta={meta}
					realTimeRate={realTimeRate}
				/>

				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-bold text-white">
						Explanation
					</h3>
					<div className="input-style-2 flex flex-col gap-2 rounded-xl p-3">
						<h3 className="font-bold text-white">
							{bountyCancellation?.name}
						</h3>
						<p className="text-white">
							{bountyCancellation?.description}
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-bold text-white">
						Deliverables
					</h3>
					<DeliverablesStepper
						bountyId={bountyId}
						bountyProgress={progress}
						ambassadorId={owner?._id}
						bountyCreator={creator._id}
						readonly
						showActionButton={false}
						deliverables={deliverables.map(
							// eslint-disable-next-line @typescript-eslint/no-shadow
							({ _id, name, progress, updatedAt }) => ({
								progress,
								updatedAt,
								bountyId,
								description: name,
								deliverableId: _id,
								bountyCreator: creator._id,
							})
						)}
					/>
				</div>
				<div className="pb-6">
					<Button
						size="sm"
						fullWidth
						onClick={() => {
							setAcceptCancellation(true);
						}}
						variant="destructive"
					>
						<span className="normal-case">
							Cancel Bounty and Review
						</span>
					</Button>
				</div>
			</div>
		</>
	);
};
