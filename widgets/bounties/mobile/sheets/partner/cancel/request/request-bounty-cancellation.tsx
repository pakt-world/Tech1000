"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";
import { type FC, useState } from "react";

import { Button } from "@/components/common/button";
import { Checkbox } from "@/components/common/checkbox";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Spinner } from "@/components/common/loader";
import { useRequestBountyCancellation } from "@/lib/api/bounty";

import { PartnerBountyCancellationRequestSuccess4Mobile } from "./bounty-cancellation-request-success";

const BOUNTY_CANCEL_REASONS = [
	"Talent is not responsive",
	"Unforeseeable Circumstances",
];

interface RequestBountyCancellationProps {
	bountyId: string;
	closeMobileSheet: () => void;
	cancelBountyCancellationRequest: () => void;
	ambassadorId: string;
	type: string;
}

export const PartnerRequestBountyCancellation4Mobile: FC<
	RequestBountyCancellationProps
> = ({
	bountyId,
	cancelBountyCancellationRequest,
	closeMobileSheet,
	ambassadorId,
	type,
}) => {
	const requestBountyCancellationMutation = useRequestBountyCancellation({
		ambassadorId,
	});

	const [isSuccess, setIsSuccess] = useState(false);
	const [reason, setReason] = useState("");
	const [reasonNotInOptions, setReasonNotInOptions] = useState(false);
	const [explanation, setExplanation] = useState("");

	if (isSuccess) {
		return (
			<PartnerBountyCancellationRequestSuccess4Mobile
				closeModal={closeMobileSheet}
			/>
		);
	}

	return (
		<>
			<div className="z-50 flex items-center justify-between bg-hover-gradient p-4 text-lg font-bold text-white">
				<div className="flex items-center gap-2">
					<button
						onClick={cancelBountyCancellationRequest}
						type="button"
						aria-label="Back"
					>
						<ChevronLeft />
					</button>
					<span>Cancel Bounty</span>
				</div>
			</div>

			<div className="flex grow flex-col gap-6 bg-primary px-4 py-6">
				<div className="input-style-2 rounded-2xl p-4 text-white">
					The talent will need to accept for the cancellation to be
					effective.
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-white">
						Reason for cancellation{" "}
						<span className="text-red-500">*</span>
					</h2>
					<div className="flex flex-col gap-3">
						{BOUNTY_CANCEL_REASONS.map((option) => (
							<label
								key={option}
								className="flex items-center gap-2 "
							>
								<Checkbox
									checked={reason === option}
									onCheckedChange={() => {
										setReason(option);
										setReasonNotInOptions(false);
									}}
									className="checkbox_style"
								/>
								<span className="text-white">{option}</span>
							</label>
						))}

						<label className="flex items-center gap-2">
							<Checkbox
								checked={reasonNotInOptions}
								onCheckedChange={() => {
									if (!reasonNotInOptions) {
										setReason("");
									}
									setReasonNotInOptions(true);
								}}
								className="checkbox_style"
							/>
							<span className="text-white">Other</span>
						</label>

						{reasonNotInOptions && (
							<textarea
								rows={2}
								value={reason}
								placeholder="Write your reason..."
								onChange={(e) => {
									setReason(e.target.value);
								}}
								className="input-style w-full grow resize-none rounded-lg p-2 text-white placeholder:text-sm focus:outline-none"
							/>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-6">
					<div className="input-style-2 rounded-2xl p-4 text-white">
						Payment for any deliverable is at the sole discretion of
						the talent. Talent will review client but Client cannot
						review talent.
					</div>

					<div className="flex flex-col gap-1">
						<h3 className="text-white">Explanation</h3>
						<div>
							<textarea
								rows={5}
								value={explanation}
								placeholder="Write your explanation..."
								onChange={(e) => {
									setExplanation(e.target.value);
								}}
								className="input-style w-full grow resize-none rounded-lg p-2 text-white placeholder:text-sm focus:outline-none"
							/>
						</div>
					</div>
				</div>

				<div className="mt-auto">
					<Button
						fullWidth
						disabled={
							requestBountyCancellationMutation.isLoading ||
							reason.length === 0 ||
							explanation.length === 0
						}
						onClick={() => {
							requestBountyCancellationMutation.mutate(
								{
									type,
									bountyId,
									reason,
									explanation,
								},
								{
									onSuccess: () => {
										setIsSuccess(true);
									},
								}
							);
						}}
						variant="white"
					>
						{requestBountyCancellationMutation.isLoading ? (
							<Spinner size={20} />
						) : (
							"Request Cancellation"
						)}
					</Button>
				</div>
			</div>
		</>
	);
};
