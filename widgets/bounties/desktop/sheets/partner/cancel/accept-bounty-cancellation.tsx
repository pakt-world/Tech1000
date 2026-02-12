"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft, Star } from "lucide-react";
import Image from "next/image";
import { Slider } from "pakt-ui";
import { type FC, useState } from "react";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { DefaultAvatar } from "@/components/common/default-avatar";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { Spinner } from "@/components/common/loader";
import { SnowScore } from "@/components/common/snow-profile";
import { isBountyDeliverable } from "@/lib/actions";
import { useAcceptBountyCancellation } from "@/lib/api/bounty";
import { type CollectionProps } from "@/lib/types/collection";
import { type MemberProps } from "@/lib/types/member";

const MAX_REVIEW_LENGTH = 500;

interface AcceptBountyCancellationProps {
	bounty: CollectionProps;
	ambassador?: MemberProps;
	setAcceptCancellation: (value: boolean) => void;
}

export const AcceptBountyCancellation: FC<AcceptBountyCancellationProps> = ({
	setAcceptCancellation,
	ambassador,
	bounty,
}) => {
	const cancelBountyMutation = useAcceptBountyCancellation();

	const totalDeliverables =
		bounty.collections.filter(isBountyDeliverable).length;
	const completedDeliverables = bounty.collections
		.filter(isBountyDeliverable)
		.filter((deliverable) => deliverable.progress === 100).length;

	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [percentageToPay, setPercentageToPay] = useState(
		Math.floor((completedDeliverables / totalDeliverables) * 100)
	);
	const pf = bounty.paymentFee ?? 0;

	const amountToPay = (percentageToPay / 100) * pf;

	return (
		<>
			<div className="flex items-center justify-between bg-gradient-to-r from-danger via-red-500 to-red-400 px-4 py-6 text-3xl font-bold text-white">
				<div className="flex items-center gap-2">
					<button
						onClick={() => {
							setAcceptCancellation(false);
						}}
						type="button"
						aria-label="Back"
					>
						<ChevronLeft />
					</button>
					<span>Cancel Bounty</span>
				</div>
			</div>

			<div className="container_style flex h-full grow flex-col gap-10 px-4 py-6">
				<DeliverableProgressBar
					totalDeliverables={totalDeliverables}
					className="max-w-none text-base"
					percentageProgress={Math.floor(
						(completedDeliverables / totalDeliverables) * 100
					)}
				/>

				<div className="flex flex-col gap-1">
					<p className="text-white">
						Proposed Bounty Price: ${bounty.paymentFee}
					</p>

					<div className="input-style-2 flex flex-col gap-3 rounded-lg p-3">
						<p className="flex items-center gap-2 text-white">
							<span>Amount to pay the Talent:</span>{" "}
							<span className="font-bold text-green-600">
								${Math.floor(amountToPay)}
							</span>
							<span className="text-sm">
								({percentageToPay}%)
							</span>
						</p>
						<div className="my-2">
							<Slider
								value={[percentageToPay]}
								onValueChange={(value) => {
									setPercentageToPay(value[0] ?? 0);
								}}
								min={0}
								max={100}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<span className="text-white">
						How was your experience with {ambassador?.firstName}?
					</span>
					<div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-slate-50 p-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<SnowScore
									score={ambassador?.score ?? 0}
									size="sm"
								>
									<div className="relative h-full w-full rounded-full">
										{ambassador?.profileImage?.url ? (
											<Image
												src={
													ambassador?.profileImage
														?.url
												}
												fill
												alt="profile"
												className="rounded-full"
											/>
										) : (
											<DefaultAvatar />
										)}
									</div>
								</SnowScore>

								<div className="flex flex-col gap-1">
									<span className="text-base font-medium leading-none text-title">{`${ambassador?.firstName} ${ambassador?.lastName}`}</span>
									<span className="text-sm capitalize leading-none">
										{ambassador?.profile.bio.title}
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
										<Star
											fill="transparent"
											color="#15D28E"
										/>
									}
								/>
							</div>
						</div>
					</div>
				</div>

				<div>
					<h3 className="text-white">Comment</h3>
					<div>
						<textarea
							rows={5}
							value={comment}
							onChange={(e) => {
								if (
									e.target.value.length <= MAX_REVIEW_LENGTH
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
								{MAX_REVIEW_LENGTH}
							</span>
						</div>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						fullWidth
						variant="white"
						disabled={
							cancelBountyMutation.isLoading ||
							comment.length === 0 ||
							rating === 0
						}
						onClick={() => {
							cancelBountyMutation.mutate({
								rating,
								bountyId: bounty._id,
								review: comment,
								amount: Math.floor(amountToPay),
								recipientId: ambassador?._id ?? "",
							});
						}}
					>
						{cancelBountyMutation.isLoading ? (
							<Spinner size={20} />
						) : (
							"Accept Cancellation"
						)}
					</Button>
				</div>
			</div>
		</>
	);
};
