"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";
import { type FC, useMemo } from "react";

import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import {
	assignedSlots,
	isReviewChangeRequest,
	removeDuplicatesFromArray,
	slotInfo,
} from "@/lib/actions";
import { useGetBountiesInfinitely } from "@/lib/api/bounty";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { CollectionCategory, CollectionTypes } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";

import { PartnerBountyCard } from "../misc/client-card";

interface OngoingBountiesProps {
	rates: ExchangeRateRecord | undefined;
}

export const AssignedBounties: FC<OngoingBountiesProps> = ({ rates }) => {
	const {
		data: slots,
		refetch,
		isLoading,
		failureReason,
		isError,
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
		error: failureReason?.response?.data.message ?? "",
	});

	const bd = assignedSlots(currentData);
	const d = removeDuplicatesFromArray(bd);
	if (!tooManyReq && isError)
		return <PageError className="h-[85vh] rounded-2xl" />;

	return (
		<div className="h-full overflow-y-auto overflow-x-hidden">
			{isLoading ? (
				<PageLoading className="h-[85vh] rounded-2xl" color="#ffffff" />
			) : d.length > 0 ? (
				<div className="grid h-full grid-cols-1 grid-rows-3 gap-4 lg:grid-cols-2">
					{d.map((bounty) => {
						const si = slotInfo(bounty.parent);
						const realTimeRate =
							rates?.[bounty.meta?.coin?.reference ?? ""] ?? 0;
						const reviewRequestChange = bounty.collections.find(
							isReviewChangeRequest
						);
						return (
							<PartnerBountyCard
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
								reviewRequestChange={reviewRequestChange}
								bountyId={bounty._id}
								key={bounty._id}
								price={bounty.paymentFee ?? 0}
								title={bounty.name}
								talent={{
									id: bounty.owner?._id ?? "",
									paktScore: bounty.owner?.score ?? 0,
									avatar: bounty.owner?.profileImage?.url,
									name: `${bounty.owner?.firstName} ${bounty.owner?.lastName}`,
								}}
								bountyProgress={bounty.progress}
								meta={bounty.meta}
								realTimeRate={realTimeRate}
								slotInfo={si}
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty
					label="Your ongoing bounties will appear here."
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
