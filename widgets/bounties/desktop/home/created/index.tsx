"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Tabs } from "@/components/common/tabs";
import { useExchangeRateStore } from "@/lib/store/misc";

import { AssignedBounties } from "./tabs/assigned";
import { CompletedBounties } from "./tabs/completed";
import { UnassignedBounties } from "./tabs/unassigned";
import { UnfundedBounties } from "./tabs/unfunded";

export const CreatedBounties = (): JSX.Element => {
	// Rates
	const { data: rates } = useExchangeRateStore();

	return (
		<div className="relative w-full">
			<Tabs
				urlKey="my-bounties"
				tabs={[
					{
						label: "Assigned",
						value: "assigned",
						content: <AssignedBounties rates={rates} />,
					},
					{
						label: "Unassigned",
						value: "unassigned",
						content: <UnassignedBounties rates={rates} />,
					},
					{
						label: "Unfunded",
						value: "unfunded",
						content: <UnfundedBounties rates={rates} />,
					},
					{
						label: "Completed",
						value: "completed",
						content: <CompletedBounties rates={rates} />,
					},
				]}
			/>
		</div>
	);
};
