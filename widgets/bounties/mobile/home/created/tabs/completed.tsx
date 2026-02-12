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
import {
	completedBounties,
	removeDuplicatesFromArray,
	slotInfo,
} from "@/lib/actions";
import { useGetBountiesInfinitely } from "@/lib/api/bounty";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import {
	CollectionCategory,
	CollectionStatus,
	CollectionTypes,
} from "@/lib/enums";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type CollectionProps } from "@/lib/types/collection";

import { PartnerBountyCard } from "../misc/partner-card";

interface CompletedBountiesProps {
	rates: ExchangeRateRecord | undefined;
}

export const CompletedBounties: React.FC<CompletedBountiesProps> = ({
	rates,
}) => {
	const {
		data: slots,
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
		type: CollectionTypes.SLOT,
	});
	const tooManyReq =
		failureReason?.response?.data.message ===
			"Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;
	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;

	const slotData = useMemo(
		() => ({
			...slots,
			pages: slots?.pages?.map((page) => page.data) ?? [],
		}),
		[slots]
	);

	const { observerTarget, currentData } = useInfiniteScroll<CollectionProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: slotData,
		refetch,
		error: error?.response?.data.message as string,
	});

	const cb = completedBounties(currentData);
	const d = removeDuplicatesFromArray(cb);

	if (isError && !tooManyReq) return <PageError className="" />;

	return (
		<div className="scrollbar-hide relative mt-[64px] h-full w-full overflow-auto pb-20">
			{isLoading ? (
				<PageLoading className="!h-full" color="#ffffff" />
			) : d.length > 0 ? (
				<div className="relative flex w-full flex-col overflow-y-auto">
					{d.map((bounty) => {
						const si = slotInfo(bounty.parent);
						const realTimeRate = rates
							? (rates[bounty.meta.coin?.reference] as number)
							: 0;

						return (
							<PartnerBountyCard
								bountyId={bounty._id}
								isCancelled={
									bounty.status === CollectionStatus.CANCELLED
								}
								totalDeliverables={
									bounty.collections.filter(
										(collection) =>
											collection.type ===
											CollectionTypes.DELIVERABLE
									).length
								}
								completedDeliverables={
									bounty.collections.filter(
										(collection) =>
											collection.type ===
												CollectionTypes.DELIVERABLE &&
											collection.progress === 100
									).length
								}
								key={bounty._id}
								price={bounty.paymentFee ?? 0}
								title={bounty.name}
								talent={{
									id: bounty.owner?._id ?? "",
									paktScore: bounty.owner?.score ?? 0,
									avatar: bounty.owner?.profileImage?.url,
									name: `${bounty.owner?.firstName} ${bounty.owner?.lastName}`,
								}}
								meta={bounty.meta}
								realTimeRate={realTimeRate}
								slotInfo={si}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty
					label="Your completed bounties will appear here."
					className="!h-full"
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
