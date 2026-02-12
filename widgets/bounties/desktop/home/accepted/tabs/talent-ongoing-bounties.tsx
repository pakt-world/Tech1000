"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type InfiniteData } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { PageLoading } from "@/components/common/page-loading";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { removeDuplicatesFromArray } from "@/lib/actions";
import { type GetBountyResponse } from "@/lib/api/bounty";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type ApiError } from "@/lib/axios";
import { CollectionStatus, CollectionTypes } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";

import { TalentBountyCard } from "../misc/ambassador-card";

interface OngoingBountiesProps {
	bounties: InfiniteData<GetBountyResponse> | undefined;
	rates: ExchangeRateRecord | undefined;
	fetchNextPage: () => void;
	hasNextPage: boolean | undefined;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	refetch: () => void;
	error: ApiError | null;
	tooManyReq?: boolean;
}

export const TalentOngoingBounties = ({
	bounties,
	rates,
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	isLoading,
	refetch,
	error,
	tooManyReq,
}: OngoingBountiesProps): JSX.Element => {
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

	const ongoingBounties = currentData.filter(
		(bounty) => bounty.status === CollectionStatus.ONGOING
	);
	const d = removeDuplicatesFromArray(ongoingBounties);

	return (
		<div className="flex h-full min-h-[80vh] flex-col">
			{isLoading ? (
				<PageLoading className="h-[85vh] rounded-2xl" color="#ffffff" />
			) : d.length > 0 ? (
				<div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20">
					{d.map((bounty) => {
						return (
							<TalentBountyCard
								bountyId={bounty?._id}
								key={bounty?._id}
								price={bounty?.paymentFee ?? 0}
								title={bounty?.name}
								totalDeliverables={
									bounty?.collections.filter(
										(collection) =>
											collection.type ===
											CollectionTypes.DELIVERABLE
									).length
								}
								completedDeliverables={
									bounty?.collections.filter(
										(collection) =>
											collection.type ===
												CollectionTypes.DELIVERABLE &&
											collection.progress === 100
									).length
								}
								client={{
									id: bounty.creator?._id ?? "",
									avatar: bounty?.creator?.profileImage?.url,
									name: `${bounty?.creator?.firstName}`,
								}}
								isCancelled={
									bounty?.status ===
									CollectionStatus.CANCELLED
								}
								bounty={bounty}
								rates={rates}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty
					label="Your ongoing bounties will appear here."
					className="h-[80vh] rounded-lg"
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
