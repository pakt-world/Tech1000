"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft, Star } from "lucide-react";
import { type FC } from "react";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { SnowProfile } from "@/components/common/snow-profile";
import { isBountyDeliverable, isReviewChangeRequest } from "@/lib/actions";
import {
	useAcceptReviewChange,
	useDeclineReviewChange,
} from "@/lib/api/bounty";
import { type CollectionProps } from "@/lib/types/collection";

interface ReviewChangeRequestedProps {
	bounty: CollectionProps;
	closeModal?: () => void;
}

export const ReviewChangeRequested: FC<ReviewChangeRequestedProps> = ({
	closeModal,
	bounty,
}) => {
	const acceptMutation = useAcceptReviewChange({
		bountyId: bounty._id,
		recipientId: String(bounty.owner?._id),
	});
	const declineMutation = useDeclineReviewChange({
		bountyId: bounty._id,
		recipientId: String(bounty.owner?._id),
	});

	const reviewChangeRequest = bounty.collections.find(isReviewChangeRequest);
	const talent = bounty.owner;
	const clientReview = bounty.ratings?.find(
		(review) => review.owner._id === bounty.creator._id
	);

	const deliverableIds = bounty.collections
		.filter(isBountyDeliverable)
		.map((deliverable) => deliverable._id);

	return (
		<>
			<div className="bg-hover-gradient px-4 py-6 text-2xl font-bold text-white">
				<div className="flex items-center gap-2">
					<button
						onClick={closeModal}
						type="button"
						aria-label="Back"
					>
						<ChevronLeft />
					</button>
					<span>Request To Improve</span>
				</div>
			</div>
			<div className="container_style flex h-full flex-col gap-6 px-4 py-4">
				<div className="flex flex-col gap-1">
					<h3 className="text-lg font-medium text-white">
						Bounty Description
					</h3>
					<div className="input-style-2 flex flex-col gap-1 rounded-xl p-3">
						<h3 className="text-sm font-medium text-white">
							{bounty.name}
						</h3>
						<p className="text-sm text-white">
							{bounty.description}
						</p>
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="text-lg font-medium text-white">
						Talent Comment
					</h3>
					<div className="input-style-2 flex flex-col gap-1 rounded-xl p-3">
						<p className="text-lg text-white">
							{reviewChangeRequest?.description}
						</p>

						<div className="flex items-center gap-2">
							<SnowProfile
								score={talent?.score ?? 0}
								size="md"
								src={talent?.profileImage?.url}
								url={`/members/${talent?._id}`}
							/>

							<div className="flex flex-col gap-1">
								<span className="text-base font-medium leading-none text-white">{`${talent?.firstName} ${talent?.lastName}`}</span>
								<span className="text-sm capitalize leading-none text-sky">
									{talent?.profile.bio.title}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="input-style-2 flex flex-col gap-3 rounded-xl p-3">
					<div className="flex w-full items-center justify-between">
						<h3 className="text-sm font-medium text-white">
							Your review
						</h3>

						{/*  @ts-expect-error --- */}
						<Rating
							readonly
							initialRating={clientReview?.rating ?? 0}
							fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
							emptySymbol={
								<Star fill="transparent" color="#15D28E" />
							}
						/>
					</div>
					<p className="text-white">{clientReview?.review}</p>
				</div>

				<div className="ml-auto mt-auto flex w-full max-w-[70%] items-center gap-3">
					<Button
						fullWidth
						onClick={() => {
							declineMutation.mutate({
								reviewChangeRequestId:
									reviewChangeRequest?._id ?? "",
							});
						}}
						variant="outline"
					>
						{declineMutation.isLoading ? (
							<Spinner size={20} />
						) : (
							"Decline Request"
						)}
					</Button>

					<Button
						fullWidth
						onClick={() => {
							acceptMutation.mutate({
								bountyId: bounty._id,
								reviewId: clientReview?._id ?? "",
								requestId: reviewChangeRequest?._id ?? "",
								deliverableIds: [...deliverableIds, bounty._id],
							});
						}}
						variant="white"
					>
						{acceptMutation.isLoading ? (
							<Spinner size={20} />
						) : (
							"Reopen Bounty"
						)}
					</Button>
				</div>
			</div>
		</>
	);
};
