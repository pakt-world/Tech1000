"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useMemo, useRef } from "react";
import { Loader } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { PageEmpty } from "@/components/common/page-empty";
import CardView from "@/components/common/card-view";
import { PageLoading } from "@/components/common/page-loading";
import { FeedCard } from "../../../../_components/cards/feed-card";
import { useGetGroupsBookmarksInfinitely } from "@/lib/api/bookmark";
import { useCardVisibility } from "@/providers/card-visibility-provider";

export default function BookmaksistFeedView(): ReactElement | null {
	let prevPage = 0;
	let currentPage = 1;

	const ref = useRef<HTMLDivElement>(null);
	useCardVisibility(ref);

	// Set up React Query caching behavior using `staleTime` and `cacheTime`
	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetGroupsBookmarksInfinitely({
		page: 1,
		limit: 4,
		filter: {},
		options: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			cacheTime: 1000 * 60 * 10, // 10 minutes cache
		},
	});

	// Memoize bookmark data
	const bookmarkData = useMemo(
		() => ({
			...data,
			pages: data?.pages?.map((page) => page.data) ?? [],
		}),
		[data]
	);

	// Infinite scroll hook
	const { observerTarget } = useInfiniteScroll({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: bookmarkData,
		refetch,
		error: error?.response?.data.message ?? "",
	});

	const handleRefetch = () => {
		refetch();
	};

	return (
		<div className="relative flex w-full flex-col md:gap-6">
			<div className="h-[0.05px]" ref={ref}></div>
			{isLoading && !data ? (
				<CardView className="!h-[70vh] w-full rounded-none bg-none md:mx-0 md:!h-[60vh] md:!rounded-3xl">
					<PageLoading
						className="h-full rounded-2xl"
						color="#ffffff"
					/>
				</CardView>
			) : (bookmarkData?.pages?.flat().length ?? 0) > 0 ? (
				bookmarkData?.pages?.flat().map((bookmark, index) => (
					<div key={index} className="post-card bookmark flex">
						<div className="flex w-full items-center gap-2">
							<FeedCard
								props={{
									...bookmark?.data,
									bookmarkId: bookmark?.bookmarkId,
								}}
								viewType="bookmarked"
								callback={handleRefetch}
							/>
						</div>
					</div>
				))
			) : (
				<PageEmpty
					label="No bookmarks available."
					className="!h-[70vh] w-full rounded-none md:!max-h-[60vh] md:rounded-2xl"
				/>
			)}

			{/* Show loader for next page */}
			{isFetchingNextPage && (
				<div className="mx-auto flex w-full flex-row items-center justify-center text-center">
					<Loader
						size={15}
						className="animate-spin text-center text-white"
					/>
				</div>
			)}

			{/* Infinite scroll target */}
			<div ref={observerTarget} className="!h-2 !w-full" />
		</div>
	);
}
