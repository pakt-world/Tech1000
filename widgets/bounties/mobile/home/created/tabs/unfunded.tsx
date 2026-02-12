"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";
import { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { isBountyUnfunded, removeDuplicatesFromArray } from "@/lib/actions";
import { useGetBountiesInfinitely } from "@/lib/api/bounty";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { CollectionCategory, CollectionTypes } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { type CollectionProps } from "@/lib/types/collection";

import { OpenBountyCard4Mobile } from "../../open/misc/open-card";

interface UnfundedBountiesProps {
	rates: ExchangeRateRecord | undefined;
}

export const UnfundedBounties = ({
	rates,
}: UnfundedBountiesProps): JSX.Element => {
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

	const user = useUserState();
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
		error: error?.response?.data.message as string,
	});

	const unfundedBounties = isBountyUnfunded(currentData, user);
	const d = removeDuplicatesFromArray(unfundedBounties);

	if (isError && !tooManyReq) return <PageError className="!h-full" />;

	return (
		<div className="scrollbar-hide relative mt-[64px] h-full w-full overflow-auto pb-20">
			{isLoading ? (
				<PageLoading className="!h-full" color="#ffffff" />
			) : d.length > 0 ? (
				<div className="relative flex w-full flex-col overflow-y-auto">
					{d.map((bounty: CollectionProps) => {
						return (
							<OpenBountyCard4Mobile
								key={bounty?._id}
								onRefresh={refetch}
								bounty={bounty}
								rates={rates}
								spotType="empty"
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty label="No open bounties yet." className="!h-full" />
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
