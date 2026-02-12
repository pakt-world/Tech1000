"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { Tabs } from "@/components/common/tabs";
import { useGetBountiesInfinitely } from "@/lib/api/bounty";
import { CollectionCategory, CollectionTypes } from "@/lib/enums";
import { useExchangeRateStore } from "@/lib/store/misc";

import { TalentCompletedBounties } from "./tabs/talent-completed-bounties";
import { TalentOngoingBounties } from "./tabs/talent-ongoing-bounties";

export const AcceptedBounties = (): ReactElement => {
	const {
		data: bounties,
		refetch: refetchBounties,
		failureReason,
		isLoading: isLoadingBounties,
		isError: isErrorBounties,
		error: errorBounties,
		fetchNextPage: fetchNextPageBounties,
		hasNextPage: hasNextPageBounties,
		isFetchingNextPage: isFetchingNextPageBounties,
	} = useGetBountiesInfinitely({
		category: CollectionCategory.ASSIGNED,
		type: CollectionTypes.SLOT,
	});

	const tooManyReqBounties =
		failureReason?.response?.data.message ===
			"Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	const { data: rates } = useExchangeRateStore();

	if (isErrorBounties && !tooManyReqBounties)
		return <PageError className="h-[85vh] rounded-2xl" />;
	if (isLoadingBounties)
		return <PageLoading className="h-[85vh] rounded-2xl" color="#ffffff" />;

	return (
		<div className="relative w-full">
			<Tabs
				urlKey="partner-bounties"
				tabs={[
					{
						label: "Ongoing",
						value: "ongoing",
						content: (
							<TalentOngoingBounties
								bounties={bounties}
								rates={rates}
								fetchNextPage={fetchNextPageBounties}
								hasNextPage={hasNextPageBounties}
								isFetchingNextPage={isFetchingNextPageBounties}
								isLoading={isLoadingBounties}
								refetch={refetchBounties}
								error={errorBounties}
								tooManyReq={tooManyReqBounties}
							/>
						),
					},
					{
						label: "Completed",
						value: "completed",
						content: (
							<TalentCompletedBounties
								bounties={bounties}
								rates={rates}
								fetchNextPage={fetchNextPageBounties}
								hasNextPage={hasNextPageBounties}
								isFetchingNextPage={isFetchingNextPageBounties}
								isLoading={isLoadingBounties}
								refetch={refetchBounties}
								error={errorBounties}
								tooManyReq={tooManyReqBounties}
							/>
						),
					},
				]}
			/>
		</div>
	);
};
