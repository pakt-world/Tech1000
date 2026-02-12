"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { z } from "zod";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { groupCreationSchema } from "@/lib/validations";
import CardView from "@/components/common/card-view";

type GroupFormInputs = z.infer<typeof groupCreationSchema>;
interface GroupsFormStepProps {
	values: GroupFormInputs;
}

const GroupsFormStep: React.FC<GroupsFormStepProps> = ({ values }) => {
	const [validationResults, setValidationResults] = useState({
		isGroupDetailsComplete: false,
		isGroupTagsComplete: false,
		isInvitePeopleComplete: false,
		isVisibilityComplete: false,
	});

	useEffect(() => {
		setValidationResults({
			isGroupDetailsComplete: Boolean(
				values.name && values.image && values.description
			),
			isGroupTagsComplete:
				Array.isArray(values.tags) && values.tags.length === 3,
			isInvitePeopleComplete:
				Array.isArray(values.invites) && values.invites.length > 0,
			isVisibilityComplete: Boolean(values.inviteType),
		});
	}, [values]);

	const StepItem = ({
		label,
		isChecked,
	}: {
		label: string;
		isChecked: boolean;
	}) => (
		<div className="flex w-full cursor-pointer items-center gap-2 rounded-[100px] bg-[#FCFCFD1A]/10 p-2">
			<div
				className={`flex h-8 w-8 items-center justify-center rounded-full ${
					isChecked ? "bg-green-500" : "bg-gray-300/20"
				}`}
			>
				{isChecked && <Check className="text-white" size={20} />}
			</div>
			<span className="text-white">{label}</span>
		</div>
	);

	return (
		<CardView className="w-full !border-lemon-green !p-4">
			<div className="flex w-full flex-col justify-start gap-4 font-bold text-white">
				<p>Steps</p>
				<div className="flex w-full flex-col gap-2">
					{/* Group Details Step */}
					<StepItem
						label="Group Details"
						isChecked={validationResults.isGroupDetailsComplete}
					/>
					{/* Group Tags Step */}
					<StepItem
						label="Group Interests"
						isChecked={validationResults.isGroupTagsComplete}
					/>
					{/* Invite People Step */}
					<StepItem
						label="Invite People"
						isChecked={validationResults.isInvitePeopleComplete}
					/>
					{/* Visibility Step */}
					<StepItem
						label="Visibility"
						isChecked={validationResults.isVisibilityComplete}
					/>
				</div>
			</div>
		</CardView>
	);
};

export default GroupsFormStep;
