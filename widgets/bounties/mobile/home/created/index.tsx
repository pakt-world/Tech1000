"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Tabs } from "@/components/common/tabs";
import { useExchangeRateStore } from "@/lib/store/misc";

import { AssignedBounties } from "./tabs/assigned";
import { CompletedBounties } from "./tabs/completed";
import { UnassignedBounties } from "./tabs/unassigned";
import { UnfundedBounties } from "./tabs/unfunded";

export const CreatedBounties = (): ReactElement => {
	// Rates1
	const { data: rates } = useExchangeRateStore();

	return (
		<div className="flex h-full flex-1 overflow-y-auto">
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
				tabListClassName="!justify-center gap-2 !px-2 !border-b-0 max-sm:top-[131px] !z-30 max-sm:fixed"
				tabTriggerClassName="px-2 pb-[20px] items-center justify-center"
				tabContentContainerClassName="mt-[60px]"
			/>
		</div>
	);
};
