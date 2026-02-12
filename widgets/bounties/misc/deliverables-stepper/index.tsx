"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import {
	useMarkBountyAsComplete,
	// useReleaseBountyPayment,
	useUpdateBountyProgress,
} from "@/lib/api/bounty";
import { type MetaProps } from "@/lib/types/collection";

import { DeliverableStep } from "./deliverables-step";

interface DeliverableProps {
	bountyId: string;
	bountyCreator: string;
	progress: number; // 0 or 100
	updatedAt: Date;
	description: string;
	deliverableId: string;
	meta?: MetaProps | undefined;
}

interface DeliverablesStepperProps {
	bountyId: string;
	ambassadorId: string;
	readonly?: boolean;
	bountyCreator: string;
	bountyProgress: number;
	showActionButton?: boolean;
	deliverables: DeliverableProps[];
}

export const DeliverablesStepper = ({
	bountyId,
	bountyCreator,
	ambassadorId,
	bountyProgress,
	deliverables,
	readonly: isClient,
	showActionButton = true,
}: DeliverablesStepperProps): ReactElement => {
	const [disableCheckboxes, setDisableCheckboxes] = useState(false);

	const updateBountyProgress = useUpdateBountyProgress({
		creatorId: bountyCreator,
	});
	const markBountyAsComplete = useMarkBountyAsComplete();

	const totalDeliverables = deliverables.length;
	const completedDeliverables = deliverables.filter(
		(deliverable) => deliverable.progress === 100
	).length;

	return (
		<div className="flex h-full w-full grow flex-col pb-6">
			{deliverables
				.sort((a, b) => b.progress - a.progress)
				.map(
					(
						{
							deliverableId,
							description,
							bountyId: bId,
							progress,
							meta,
						},
						index
					) => {
						return (
							<DeliverableStep
								bountyId={bId}
								bountyCreator={bountyCreator}
								isClient={isClient}
								progress={progress}
								key={deliverableId}
								updatedAt={meta?.completedAt as string}
								description={description}
								deliverableId={deliverableId}
								totalDeliverables={totalDeliverables}
								isLast={index === totalDeliverables - 1}
								completedDeliverables={completedDeliverables}
								disableCheckboxes={disableCheckboxes}
								setDisableCheckboxes={setDisableCheckboxes}
							/>
						);
					}
				)}

			<div className="mt-auto">
				{showActionButton && isClient && bountyProgress === 100 && (
					<Button
						className="mt-6"
						fullWidth
						onClick={() => {
							markBountyAsComplete.mutate(
								{
									bountyId,
									talentId: ambassadorId,
								},
								{
									onError: () => {
										markBountyAsComplete.reset();
									},
								}
							);
						}}
						variant="white"
					>
						{markBountyAsComplete.isLoading ? (
							<Spinner size={20} />
						) : (
							"Finalize Bounty and Review"
						)}
					</Button>
				)}

				{showActionButton &&
					!isClient &&
					bountyProgress !== 100 &&
					completedDeliverables === totalDeliverables && (
						<Button
							className="mt-6"
							fullWidth
							onClick={() => {
								updateBountyProgress.mutate(
									{
										bountyId,
										progress: 100,
									},
									{
										onError: () => {
											updateBountyProgress.reset();
										},
									}
								);
							}}
							variant="white"
						>
							{updateBountyProgress.isLoading ? (
								<Spinner size={20} />
							) : (
								"Complete Bounty"
							)}
						</Button>
					)}
			</div>
		</div>
	);
};
