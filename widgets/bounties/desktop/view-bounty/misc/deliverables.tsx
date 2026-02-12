"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

interface DeliverablesProps {
	deliverables: string[];
}

export const BountyDeliverables = ({
	deliverables,
}: DeliverablesProps): ReactElement => {
	return (
		<div className="flex h-full w-full flex-col gap-2 py-4">
			<h3 className="text-lg font-bold text-white">Deliverables</h3>

			<div className="flex h-full flex-col gap-4 overflow-y-auto">
				{deliverables.map((deliverable, index) => (
					<div
						key={index}
						className="rounded-lg bg-[#262020] p-4 text-white"
					>
						{deliverable}
					</div>
				))}
			</div>
		</div>
	);
};
