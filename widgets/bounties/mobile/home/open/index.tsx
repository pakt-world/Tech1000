"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { PageError } from "@/components/common/page-error";
import { Tabs } from "@/components/common/tabs";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import {
	bountiesWithAvailableSlots,
	bountiesWithCoin,
	isBountyPaid,
	sortLatestFirst,
} from "@/lib/actions";
import { useGetBountiesInfinitely } from "@/lib/api/bounty";
import { CollectionCategory } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { useExchangeRateStore } from "@/lib/store/misc";
import { type CollectionProps } from "@/lib/types/collection";
import { createQueryStrings2, determineRole } from "@/lib/utils";
import { useMobileContext } from "@/providers/mobile-context-provider";

import { AllBounties } from "./all";
import { MobileOpenBountiesSearch } from "./misc/header";
import { SavedBounties } from "./saved";

export const OpenBounties = (): JSX.Element | null => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const user = useUserState();
	const loggedInUser = determineRole(user);

	const { showOpenBounties, setShowOpenBounties } = useMobileContext();

	const [searchQuery, setSearchQuery] = useState(
		searchParams.get("search") ?? ""
	);
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const [minimumPriceQuery, setMinimumPriceQuery] = useState(
		searchParams.get("range")?.split(",")[0] ?? ""
	);
	const debouncedMinimumPriceQuery = useDebounce(minimumPriceQuery, 300);

	const [maximumPriceQuery, setMaximumPriceQuery] = useState<string | number>(
		searchParams.get("range")?.split(",")[1] ?? ""
	);
	const debouncedMaximumPriceQuery = useDebounce(maximumPriceQuery, 300);

	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;

	useEffect(() => {
		const queries = createQueryStrings2({
			...(debouncedSearchQuery && { search: debouncedSearchQuery }),
			...(debouncedMinimumPriceQuery &&
				debouncedMaximumPriceQuery && {
					range: `${debouncedMinimumPriceQuery},${debouncedMaximumPriceQuery}`,
				}),
		});

		router.push(`${pathname}?${queries}`);
	}, [
		router,
		pathname,
		debouncedSearchQuery,
		debouncedMinimumPriceQuery,
		debouncedMaximumPriceQuery,
	]);

	const queryParams = new URLSearchParams(searchParams);
	const searchQ = queryParams.get("search") ?? "";
	const rangeQ = queryParams.get("range") ?? "";

	const {
		data: bountiesPagesData,
		refetch: refetchBounties,
		failureReason,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetBountiesInfinitely({
		limit: 10,
		category: CollectionCategory.OPEN,
		filter: {
			...(searchQ && { search: searchQ }),
			...(rangeQ && { range: rangeQ }),
		},
	});

	const bountiesData = useMemo(
		() => ({
			...bountiesPagesData,
			pages: bountiesPagesData?.pages?.map((page) => page.data) ?? [],
		}),
		[bountiesPagesData]
	);

	const { observerTarget, currentData } = useInfiniteScroll<CollectionProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: bountiesData,
		refetch: refetchBounties,
		error: error?.response?.data.message as string,
	});

	const d = sortLatestFirst(currentData);

	const isPaidBounties = isBountyPaid(d);
	const availableBounties = bountiesWithAvailableSlots(isPaidBounties);
	const b = bountiesWithCoin(availableBounties);

	const { data: rates } = useExchangeRateStore();

	const tooManyReq =
		failureReason?.response?.data.message ===
			"Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	if (isError && !tooManyReq) return <PageError className="" />;

	return (
		<div className="flex h-full flex-1 overflow-y-auto">
			<Tabs
				urlKey="open-bounties"
				tabs={[
					{
						label: "All",
						value: "all",
						content: (
							<AllBounties
								bounties={b}
								onRefresh={refetchBounties}
								loading={isLoading}
								rates={rates}
								loggedInUser={loggedInUser}
								isFetchingNextPage={isFetchingNextPage}
								ref={observerTarget}
								tooManyReq={tooManyReq}
							/>
						),
					},
					{
						label: "Saved",
						value: "saved",
						content: (
							<SavedBounties
								rates={rates}
								loggedInUser={loggedInUser}
							/>
						),
					},
				]}
				tabListClassName="!justify-start gap-4 px-5 !border-b-0 max-sm:top-[131px] !z-40 max-sm:fixed"
				tabTriggerClassName="px-2"
				tabContentContainerClassName="mt-[60px] !z-30"
				customExtraItem={
					<Button
						className="!z-30 !m-0 flex flex-1 items-center justify-end !p-0"
						onClick={() => {
							setShowOpenBounties(!showOpenBounties);
						}}
						variant="ghost"
					>
						<Search className="h-6 w-6 text-white" />
					</Button>
				}
			/>
			{pathname === "/bounties" && (
				<MobileOpenBountiesSearch
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					minimumPriceQuery={minimumPriceQuery}
					setMinimumPriceQuery={setMinimumPriceQuery}
					maximumPriceQuery={maximumPriceQuery}
					setMaximumPriceQuery={setMaximumPriceQuery}
				/>
			)}
		</div>
	);
};
