"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";

import { Spinner } from "@/components/common/loader";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useToggleDeliverableCompletion } from "@/lib/api/bounty";
import { formatDateHandler } from "@/lib/utils";

import { CheckButton } from "./misc/check-button";

interface DeliverablesStepProps {
	bountyId: string;
	bountyCreator: string;
	progress: number; // 0 or 100
	updatedAt: string;
	description: string;
	deliverableId: string;
	isLast: boolean;
	isClient?: boolean;

	totalDeliverables: number;
	completedDeliverables: number;
	disableCheckboxes: boolean;
	setDisableCheckboxes: (value: boolean) => void;
}

export const DeliverableStep = ({
	bountyId,
	bountyCreator,
	isLast,
	isClient,
	updatedAt,
	progress,
	description,
	deliverableId,
	totalDeliverables,
	completedDeliverables,
	disableCheckboxes,
	setDisableCheckboxes,
}: DeliverablesStepProps): ReactElement => {
	const [checkBoxLoading, setCheckBoxLoading] = useState(false);
	const mutation = useToggleDeliverableCompletion({ description });
	const [isComplete, setIsComplete] = useState(progress === 100);

	return (
		<div className="relative flex w-full items-start gap-3 py-1">
			<div
				className="absolute left-3 top-0 h-full w-[2px] translate-y-3"
				style={{
					display: isLast ? "none" : "block",
					background: isComplete ? "#FF9898" : "#E8E8E8",
				}}
			/>
			{checkBoxLoading ? (
				<Spinner className="w-max text-white" />
			) : (
				<CheckButton
					isChecked={isComplete}
					isClient={isClient}
					onClick={() => {
						if (isClient) return;
						setCheckBoxLoading(true);
						setDisableCheckboxes(true);
						mutation.mutate(
							{
								bountyId,
								deliverableId,
								totalDeliverables,
								completedDeliverables,
								isComplete: !isComplete,
								bountyCreator,
								meta: {
									completedAt: !isComplete
										? formatDateHandler()
										: "",
								},
							},
							{
								onSuccess: () => {
									setCheckBoxLoading(false);
									setDisableCheckboxes(false);
								},
								onError: () => {
									setCheckBoxLoading(false);
									mutation.reset();
									setIsComplete((prev) => !prev);
								},
							}
						);
						setIsComplete((prev) => !prev);
					}}
					disabled={disableCheckboxes}
				/>
			)}
			<div className=" input-style w-full rounded-lg p-2 text-sky-dark">
				<p
					style={{
						textDecoration: isComplete ? "line-through" : "none",
					}}
				>
					{description}
				</p>

				{isComplete && updatedAt && (
					<span className="text-xs text-green-500">
						Completed:{" "}
						{formatDateHandler(updatedAt, "DD MMM YYYY hh:mm A")}
					</span>
				)}
			</div>
		</div>
	);
};
