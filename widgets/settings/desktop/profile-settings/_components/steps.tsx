"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { StepIndicator } from "@/components/common/step-indicator";
import CardView from "@/components/common/card-view";

interface StepsProps {
	profileSteps: {
		name: boolean;
		location: boolean;
		skills: boolean;
		bio: boolean;
	};
}

export const ProfileSteps = ({ profileSteps }: StepsProps): ReactElement => {
	return (
		<CardView className="flex h-fit flex-col gap-3 !p-4">
			<h3 className="w-full text-left font-bold text-white">Steps</h3>
			<div className=" flex w-full flex-col items-start gap-6 rounded-lg bg-[#262020] px-3 py-3 duration-200 hover:bg-opacity-80">
				<StepIndicator isComplete={profileSteps.name}>
					Name
				</StepIndicator>
				<StepIndicator isComplete={profileSteps.location}>
					Location
				</StepIndicator>
				<StepIndicator isComplete={profileSteps.skills}>
					Interests
				</StepIndicator>
				<StepIndicator isComplete={profileSteps.bio}>Bio</StepIndicator>
			</div>
		</CardView>
	);
};
