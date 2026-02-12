"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { CollectionStatus } from "@/lib/enums";
import type { CollectionProps } from "@/lib/types/collection";

import { AmbassadorBountyUpdates4Mobile } from "./update";
import { AmbassadorBountyUpdateCancelled4Mobile } from "./update/update-cancelled";
import { AmbassadorBountyUpdateSuccess4Mobile } from "./update/update-success";

interface AmbassadorBountySheet4MobileProps {
	bounty: CollectionProps;
	closeMobileSheet: () => void;
}

export const AmbassadorBountySheet4Mobile: FC<
	AmbassadorBountySheet4MobileProps
> = ({ bounty, closeMobileSheet }) => {
	return (
		<div className="size-full overflow-y-auto">
			{bounty.status === CollectionStatus.CANCELLED ? (
				<AmbassadorBountyUpdateCancelled4Mobile />
			) : bounty.progress === 100 ? (
				<AmbassadorBountyUpdateSuccess4Mobile
					closeMobileSheet={closeMobileSheet}
				/>
			) : (
				<AmbassadorBountyUpdates4Mobile bounty={bounty} />
			)}
		</div>
	);
};
