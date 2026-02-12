"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight } from "lucide-react";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";

interface DeliverablesProps {
	deliverables: string[];
}

export const BountyDeliverables = ({
	deliverables,
}: DeliverablesProps): JSX.Element => {
	const [showDeliverables, setShowDeliverables] = useState(false);
	return (
		<div className="primary_border-y flex h-auto w-full flex-col gap-2 px-4 py-5 transition-all duration-300">
			<Button
				className="!m-0 flex w-full items-center justify-between !p-0"
				onClick={() => {
					setShowDeliverables(!showDeliverables);
				}}
				variant="ghost"
			>
				<h3 className="text-base font-bold leading-normal tracking-wide text-white">
					Deliverables
				</h3>
				<ChevronRight
					className={`h-6 w-6 text-body transition-transform duration-300 sm:hidden ${showDeliverables ? "rotate-90 transform" : ""}`}
				/>
			</Button>
			<div
				className={`flex h-full flex-col gap-4 !overflow-hidden transition-all duration-300 ${showDeliverables ? "mt-2 h-fit" : "!h-0"} sm:mt-0 sm:h-fit`}
			>
				{deliverables.map((deliverable, index) => (
					<div
						key={index}
						className="primary_border-y flex items-start gap-2 !border-t-0 py-4 text-white last-of-type:!border-b-0"
					>
						<span className="text-base leading-normal tracking-wide">
							{index + 1}.
						</span>
						<p
							key={index}
							className="text-base leading-normal tracking-wide"
						>
							{deliverable}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};
