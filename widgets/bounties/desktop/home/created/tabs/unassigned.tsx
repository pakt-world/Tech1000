"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";
import type React from "react";
import { useMemo } from "react";

import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { removeDuplicatesFromArray, unassignedBounties } from "@/lib/actions";
import { useGetBountiesInfinitely } from "@/lib/api/bounty";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { CollectionCategory, CollectionTypes } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type CollectionProps } from "@/lib/types/collection";

import { UnAssignedBountyCard } from "../misc/unassigned-card";

interface UnassignedBountiesProps {
	rates: ExchangeRateRecord | undefined;
}

export const UnassignedBounties: React.FC<UnassignedBountiesProps> = ({
	rates,
}) => {
	const user = useUserState();

	const {
		data: bounties,
		refetch,
		failureReason,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetBountiesInfinitely({
		limit: 10,
		category: CollectionCategory.CREATED,
		type: CollectionTypes.BOUNTY,
	});
	const tooManyReq =
		failureReason?.response?.data.message ===
			"Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;

	const bountiesData = useMemo(
		() => ({
			...bounties,
			pages: bounties?.pages?.map((page) => page.data) ?? [],
		}),
		[bounties]
	);

	const { observerTarget, currentData } = useInfiniteScroll<CollectionProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: bountiesData,
		refetch,
		error: error?.response?.data.message ?? "",
	});
	const unAssignedBounties = unassignedBounties(currentData, user);
	const d = removeDuplicatesFromArray(unAssignedBounties);

	if (isError && !tooManyReq)
		return <PageError className="h-[85vh] rounded-2xl" />;

	return (
		<div className="flex h-full min-h-[80vh] flex-col">
			{isLoading ? (
				<PageLoading className="h-[85vh] rounded-2xl" color="#ffffff" />
			) : d.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 overflow-y-auto pb-20 lg:grid-cols-2">
					{d.map((bounty) => {
						return (
							<UnAssignedBountyCard
								bounty={bounty}
								key={bounty?._id}
								rates={rates}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty
					label="No open bounties yet."
					className="h-[80vh] rounded-2xl"
				/>
			)}
			{tooManyReq ? (
				<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
					<span className="inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-white shadow-md">
						Too Many Requests. Please try again later.
					</span>
				</div>
			) : isFetchingNextPage ? (
				<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
					<Loader
						size={25}
						className="animate-spin text-center text-white"
					/>
				</div>
			) : null}
			<div ref={observerTarget} className="!h-4 !w-full" />
		</div>
	);
};
