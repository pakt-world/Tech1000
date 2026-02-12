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
import { useGetFeedInfinitely } from "@/lib/api/group-feed";
import { useCardVisibility } from "@/providers/card-visibility-provider";

export default function TrendingFeedView(): ReactElement | null {
	let prevPage = 0;
	let currentPage = 1;
	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetFeedInfinitely({ page: 1, limit: 4, type: "trending" });
	const ref = useRef<HTMLDivElement>(null);
	useCardVisibility(ref);

	const feedData = useMemo(
		() => ({
			...data,
			pages: data?.pages?.map((page) => page.data) ?? [],
		}),
		[data]
	);

	const { observerTarget } = useInfiniteScroll({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: feedData,
		refetch,
		error: error?.message ?? "",
	});

	const handleRefetch = () => refetch();

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
			) : feedData?.pages?.flat().length > 0 ? (
				feedData.pages.flat().map((feedItem, index) => (
					<div key={index} className="post-card trending flex">
						<div className="flex w-full items-center gap-2">
							<FeedCard
								props={feedItem}
								viewType="post_comments"
								callback={handleRefetch}
							/>
						</div>
					</div>
				))
			) : (
				<PageEmpty
					label="Awaiting Posts From Your Groups"
					className="!h-[70vh] w-full rounded-none md:!max-h-[60vh] md:rounded-2xl"
				/>
			)}

			{isFetchingNextPage && (
				<div className="mx-auto flex w-full items-center justify-center">
					<Loader size={15} className="animate-spin text-white" />
				</div>
			)}
			<div ref={observerTarget} className="!h-2 !w-full" />
		</div>
	);
}
