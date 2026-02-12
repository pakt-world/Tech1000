"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

import { isReviewChangeRequest } from "@/lib/actions";
import { CollectionStatus } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";

import { PartnerReviewAmbassador4Mobile } from "./review-ambassador";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ReviewChangeRequested } from "./review-change-requested";
import { PartnerReviewSuccess4Mobile } from "./review-success";

interface ReviewTalentProps {
	bounty: CollectionProps;
	closeMobileSheet: () => void;
}

export const PartnerReview4Mobile: FC<ReviewTalentProps> = ({
	bounty,
	closeMobileSheet,
}) => {
	const reviewChangeRequest = bounty.collections.find(isReviewChangeRequest);

	const reviewChangeRequestPending =
		reviewChangeRequest?.status === CollectionStatus.PENDING;

	const clientHasReviewed = bounty.ratings?.some(
		(review) => review?.owner?._id === bounty?.creator?._id
	);

	return reviewChangeRequestPending ? (
		<ReviewChangeRequested bounty={bounty} closeModal={closeMobileSheet} />
	) : clientHasReviewed ? (
		<PartnerReviewSuccess4Mobile closeMobileSheet={closeMobileSheet} />
	) : (
		<PartnerReviewAmbassador4Mobile
			bounty={bounty}
			closeMobileSheet={closeMobileSheet}
		/>
	);
};
