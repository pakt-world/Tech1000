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
import {
	useCreateBountyReview,
	useReleaseBountyPayment,
} from "@/lib/api/bounty";
import { type CollectionProps } from "@/lib/types/collection";

interface ReviewTalentProps {
	bounty: CollectionProps;
	closeMobileSheet: () => void;
}

const MAX_COMMENT_LENGTH = 150;

export const PartnerReviewAmbassador4Mobile: FC<ReviewTalentProps> = ({
	bounty,
	closeMobileSheet,
}) => {
	const mutation = useCreateBountyReview();
	const releasePaymentMutation = useReleaseBountyPayment();

	const { description, name, _id, owner } = bounty;
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	return (
		<>
			<div className="z-50 bg-hover-gradient p-4 text-lg font-bold text-white">
				<div className="flex items-center gap-2">
					<button
						onClick={(e) => {
							closeMobileSheet();
							e.stopPropagation();
						}}
						type="button"
						aria-label="Back"
					>
						<ChevronLeft />
					</button>
					<span>Review</span>
				</div>
			</div>

			<div className="flex flex-col gap-6 bg-primary px-4 py-4">
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

				<div className="w-full">
					<h3 className="text-lg text-white">
						How was your experience with
					</h3>
					<div className="primary_border-y primary_border-x flex flex-wrap items-center justify-between gap-1 rounded-lg bg-primary-light p-4">
						<div className="flex items-center">
							<SnowProfile
								score={owner?.score ?? 0}
								size="sm"
								src={owner?.profileImage?.url}
								url={`/members/${owner?._id}`}
								className="-left-2"
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

				<div className="flex flex-col gap-1">
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
