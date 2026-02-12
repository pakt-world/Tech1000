"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { StepIndicator } from "../../../components/common/step-indicator";

interface StepsProps {
	bountySteps: {
		details: boolean;
		skills: boolean;
		description: boolean;
		deliverables: boolean;
		classification: boolean;
		escrowPaid?: boolean;
	};
}

const Steps = ({ bountySteps }: StepsProps): ReactElement => {
	return (
		<div className="container_style flex h-fit flex-col gap-3 rounded-xl p-6 max-sm:hidden">
			<h3 className="font-bold text-white">Steps</h3>
			<div className="input-style flex w-full flex-col items-start gap-6 rounded-lg px-3 py-3 duration-200 hover:bg-opacity-10">
				<StepIndicator isComplete={bountySteps.details}>
					Bounty Details
				</StepIndicator>
				<StepIndicator isComplete={bountySteps.skills}>
					Skills
				</StepIndicator>
				<StepIndicator isComplete={bountySteps.description}>
					Description
				</StepIndicator>
				<StepIndicator isComplete={bountySteps.deliverables}>
					Deliverables
				</StepIndicator>
				<StepIndicator isComplete={bountySteps.classification}>
					Classifications
				</StepIndicator>
				<StepIndicator isComplete={bountySteps.escrowPaid}>
					Deposit Payment
				</StepIndicator>
			</div>
		</div>
	);
};

export default Steps;
