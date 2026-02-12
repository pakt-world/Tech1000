"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft, Star } from "lucide-react";
import { type FC, useState } from "react";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { SnowProfile } from "@/components/common/snow-profile";
import { isReviewChangeRequest } from "@/lib/actions";
import {
	useCreateBountyReview,
	useReleaseBountyPayment,
} from "@/lib/api/bounty";
import { CollectionStatus } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";

import { ReviewChangeRequested } from "./review-change-requested";
import { ReviewSuccess } from "./review-success";

interface ReviewTalentProps {
	bounty: CollectionProps;
	closeModal: () => void;
}

const MAX_COMMENT_LENGTH = 150;

export const ReviewTalent: FC<ReviewTalentProps> = ({ bounty, closeModal }) => {
	const mutation = useCreateBountyReview();
	const releasePaymentMutation = useReleaseBountyPayment();

	const { description, name, _id, owner } = bounty;
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const reviewChangeRequest = bounty.collections.find(isReviewChangeRequest);

	const reviewChangeRequestPending =
		reviewChangeRequest?.status === CollectionStatus.PENDING;

	const clientHasReviewed = bounty.ratings?.some(
		(review) => review?.owner?._id === bounty?.creator?._id
	);

	if (reviewChangeRequestPending) {
		return (
			<ReviewChangeRequested bounty={bounty} closeModal={closeModal} />
		);
	}

	if (clientHasReviewed) {
		return <ReviewSuccess closeModal={closeModal} />;
	}

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
					<span>Review</span>
				</div>
			</div>

			<div className="container_style flex h-full flex-col gap-6 px-4 py-4">
				<div className="flex flex-col gap-1">
					<h3 className="text-lg font-medium text-white">
						Bounty Description
					</h3>
					<div className="input-style-2 flex flex-col gap-1 rounded-xl border border-blue-300 p-3">
						<h3 className="text-base font-medium text-white">
							{name}
						</h3>

						<p className="text-sm text-white">{description}</p>
					</div>
				</div>

				<div className="rounded-xl p-3">
					<h3 className="text-lg text-white">
						How was your experience with
					</h3>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<SnowProfile
								score={owner?.score ?? 0}
								size="md"
								src={owner?.profileImage?.url}
								url={`/members/${owner?._id}`}
							/>

							<div className="flex flex-col gap-1">
								<span className="text-base font-medium leading-none text-white">{`${owner?.firstName} ${owner?.lastName}`}</span>
								<span className="text-sm capitalize leading-none text-sky">
									{owner?.profile?.bio?.title}
								</span>
							</div>
						</div>

						<div>
							{/* @ts-expect-error --- */}
							<Rating
								initialRating={rating}
								onChange={(value) => {
									setRating(value);
								}}
								fullSymbol={
									<Star fill="#15D28E" color="#15D28E" />
								}
								emptySymbol={
									<Star fill="transparent" color="#15D28E" />
								}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-1 p-3">
					<h3 className="text-white">Comment</h3>
					<div>
						<textarea
							rows={3}
							value={comment}
							onChange={(e) => {
								if (
									e.target.value.length <= MAX_COMMENT_LENGTH
								) {
									setComment(e.target.value);
								}
							}}
							placeholder="Write your comment..."
							className="input-style w-full grow resize-none rounded-lg p-2 !text-white placeholder:text-sm focus:outline-none"
						/>
						<div className="ml-auto w-fit">
							<span className="text-sm text-body">
								{comment.length}
							</span>
							<span className="text-sm text-body">/</span>
							<span className="text-sm text-body">
								{MAX_COMMENT_LENGTH}
							</span>
						</div>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						fullWidth
						onClick={() => {
							mutation.mutate(
								{
									rating,
									bountyId: _id,
									review: comment,
									recipientId: owner?._id ?? "",
								},
								{
									onSuccess: () => {
										releasePaymentMutation.mutate({
											bountyId: _id,
											owner: owner?._id ?? "",
										});
									},
								}
							);
						}}
						variant="white"
					>
						{mutation.isLoading ? (
							<Spinner size={20} />
						) : (
							"Submit Review"
						)}
					</Button>
				</div>
			</div>
		</>
	);
};
