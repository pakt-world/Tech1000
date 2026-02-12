"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { Tabs } from "@/components/common/tabs";
import { useGetBountiesInfinitely } from "@/lib/api/bounty";
import { type ApiError } from "@/lib/axios";
import { CollectionCategory, CollectionTypes } from "@/lib/enums";
import { useExchangeRateStore } from "@/lib/store/misc";

import { AmbassadorCompletedBounties } from "./tabs/ambassador-completed-bounties";
import { AmbassadorOngoingBounties } from "./tabs/ambassador-ongoing-bounties";

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
		return <PageError className="" />;
	if (isLoadingBounties) return <PageLoading className="" color="#ffffff" />;

	return (
		<div className="flex h-full flex-1 overflow-y-auto">
			<Tabs
				urlKey="partner-bounties"
				tabs={[
					{
						label: "Ongoing",
						value: "ongoing",
						content: (
							<AmbassadorOngoingBounties
								bounties={bounties}
								rates={rates}
								fetchNextPage={fetchNextPageBounties}
								hasNextPage={hasNextPageBounties}
								isFetchingNextPage={isFetchingNextPageBounties}
								isLoading={isLoadingBounties}
								refetch={refetchBounties}
								error={errorBounties as unknown as ApiError}
								tooManyReq={tooManyReqBounties}
							/>
						),
					},
					{
						label: "Completed",
						value: "completed",
						content: (
							<AmbassadorCompletedBounties
								bounties={bounties}
								rates={rates}
								fetchNextPage={fetchNextPageBounties}
								hasNextPage={hasNextPageBounties}
								isFetchingNextPage={isFetchingNextPageBounties}
								isLoading={isLoadingBounties}
								refetch={refetchBounties}
								error={errorBounties as unknown as ApiError}
								tooManyReq={tooManyReqBounties}
							/>
						),
					},
				]}
				className=""
				tabListClassName="!justify-start gap-4 px-5 !border-b-0 max-sm:top-[131px] !z-30 max-sm:fixed"
				tabTriggerClassName="px-2"
				tabContentContainerClassName="mt-[60px]"
			/>
		</div>
	);
};
