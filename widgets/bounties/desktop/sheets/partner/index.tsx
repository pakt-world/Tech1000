"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";

import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { isBountyCancellation } from "@/lib/actions";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetBountyById } from "@/lib/api/bounty";
import { CollectionStatus, CollectionTypes } from "@/lib/enums";
import warning from "@/lottiefiles/warning.json";

import { BountyCancellationRequest } from "./cancel/bounty-cancellation-request";
import { BountyCancellationSuccessRequested } from "./cancel/bounty-cancellation-success-requested";
import { RequestBountyCancellation } from "./cancel/request-bounty-cancellation";
import { ReviewTalent } from "./review/review-talent";
import { BountyUpdates } from "./update";
import Lottie from "@/components/common/lottie";

interface PartnerBountySheet4DesktopProps {
	bountyId: string;
	ambassadorId: string;
	closeModal: () => void;
	extras?: string;
}

export const PartnerBountySheet4Desktop: FC<
	PartnerBountySheet4DesktopProps
> = ({ bountyId, ambassadorId, closeModal, extras }) => {
	const query = useGetBountyById({ bountyId, extras });
	const [isRequestingBountyCancellation, setIsRequestingBountyCancellation] =
		useState(false);

	if (query.isError) return <PageError className="absolute inset-0" />;

	if (query.isLoading)
		return <PageLoading className="absolute inset-0" color="#FF99A2" />;

	const bounty = query.data;

	if (isRequestingBountyCancellation) {
		return (
			<RequestBountyCancellation
				type={CollectionTypes.CANCELLATION}
				bountyId={bountyId}
				ambassadorId={ambassadorId}
				closeModal={() => {
					setIsRequestingBountyCancellation(false);
				}}
				cancelBountyCancellationRequest={() => {
					setIsRequestingBountyCancellation(false);
				}}
			/>
		);
	}

	const bountyCancellation = bounty.collections.find(isBountyCancellation);

	const clientRequestedCancellation =
		bountyCancellation?.creator._id === bounty.creator._id;

	if (bounty.status === CollectionStatus.CANCELLED) {
		return (
			<div className="flex h-full flex-col items-center justify-center bg-red-50 text-red-500">
				<div className="flex w-[200px] items-center justify-center">
					<Lottie animationData={warning} loop={false} />
				</div>
				<span>This Bounty has been cancelled</span>
			</div>
		);
	}

	if (bountyCancellation) {
		return (
			<BountyCancellationRequest
				bounty={bounty}
				closeModal={() => {
					setIsRequestingBountyCancellation(false);
				}}
			/>
		);
	}

	if (bountyCancellation && clientRequestedCancellation) {
		return <BountyCancellationSuccessRequested closeModal={closeModal} />;
	}
	if (bounty.status === CollectionStatus.COMPLETED) {
		return <ReviewTalent bounty={bounty} closeModal={closeModal} />;
	}

	return <BountyUpdates bounty={bounty} />;
};
