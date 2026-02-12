"use client";

import { ChevronRight } from "lucide-react";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState } from "react";

import { Button } from "@/components/common/button";

interface BountyDescriptionProps {
	description: string;
}

export const BountyDescription = ({
	description,
}: BountyDescriptionProps): JSX.Element => {
	const [showDescription, setShowDescription] = useState(true);
	return (
		<div className="primary_border-y flex w-full flex-col p-4">
			<Button
				className="!m-0 flex w-full items-center justify-between !p-0"
				onClick={() => {
					setShowDescription(!showDescription);
				}}
				variant="ghost"
			>
				<h3 className="text-base font-bold leading-normal tracking-wide text-white">
					Bounty Description
				</h3>
				<ChevronRight
					className={`h-6 w-6 text-body transition-transform duration-300 sm:hidden ${showDescription ? "rotate-90 transform" : ""}`}
				/>
			</Button>

			<p
				className={`overflow-hidden text-base leading-normal tracking-wide text-white transition-all duration-300 ${showDescription ? "mt-2 h-fit" : "h-0"} sm:mt-0 sm:h-fit`}
			>
				{description}
			</p>
		</div>
	);
};
