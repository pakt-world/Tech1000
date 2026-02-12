"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

interface BountyDescriptionProps {
	description: string;
}

export const BountyDescription = ({
	description,
}: BountyDescriptionProps): ReactElement => {
	return (
		<div className="flex w-full flex-col gap-2">
			<h3 className="text-lg font-bold text-white">Bounty Description</h3>
			<p className="container_style rounded-2xl p-4 text-lg font-normal text-white">
				{description}
			</p>
		</div>
	);
};
