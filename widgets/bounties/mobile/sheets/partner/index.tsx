"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { isBountyCancellation } from "@/lib/actions";
import { CollectionStatus, CollectionTypes } from "@/lib/enums";
import type { CollectionProps } from "@/lib/types/collection";

import { PartnerBountyCancellationRequest4Mobile } from "./cancel/accept/bounty-cancellation-request-from-ambassador";
import { PartnerBountyCancellationRequestSuccess4Mobile } from "./cancel/request/bounty-cancellation-request-success";
import { PartnerRequestBountyCancellation4Mobile } from "./cancel/request/request-bounty-cancellation";
import { PartnerReview4Mobile } from "./review";
import { PartnerBountyUpdates4Mobile } from "./update";
import { PartnerBountyUpdateCancelled4Mobile } from "./update/update-cancelled";

interface PartnerBountySheet4MobileProps {
	bountyId: string;
	ambassadorId: string;
	closeMobileSheet: () => void;
	bounty: CollectionProps;
}

export const PartnerBountySheet4Mobile: FC<PartnerBountySheet4MobileProps> = ({
	bountyId,
	bounty,
	ambassadorId,
	closeMobileSheet,
}) => {
	const [isRequestingBountyCancellation, setIsRequestingBountyCancellation] =
		useState(false);

	const bountyCancellation = bounty.collections.find(isBountyCancellation);

	const clientRequestedCancellation =
		bountyCancellation?.creator._id === bounty.creator._id;

	return (
		<div className="size-full overflow-y-auto">
			{isRequestingBountyCancellation ? (
				<PartnerRequestBountyCancellation4Mobile
					type={CollectionTypes.CANCELLATION}
					bountyId={bountyId}
					ambassadorId={ambassadorId}
					closeMobileSheet={() => {
						setIsRequestingBountyCancellation(false);
					}}
					cancelBountyCancellationRequest={() => {
						setIsRequestingBountyCancellation(false);
					}}
				/>
			) : bounty.status === CollectionStatus.CANCELLED ? (
				<PartnerBountyUpdateCancelled4Mobile />
			) : bountyCancellation ? (
				<PartnerBountyCancellationRequest4Mobile bounty={bounty} />
			) : bountyCancellation && clientRequestedCancellation ? (
				<PartnerBountyCancellationRequestSuccess4Mobile
					closeModal={closeMobileSheet}
				/>
			) : bounty.status === CollectionStatus.COMPLETED ? (
				<PartnerReview4Mobile
					bounty={bounty}
					closeMobileSheet={closeMobileSheet}
				/>
			) : (
				<PartnerBountyUpdates4Mobile bounty={bounty} />
			)}
		</div>
	);
};
