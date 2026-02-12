"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useMemo, useRef } from "react";
import { Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { useGetFeedInfinitely } from "@/lib/api/group-feed";
import { PageEmpty } from "@/components/common/page-empty";
import CardView from "@/components/common/card-view";
import { PageLoading } from "@/components/common/page-loading";
import { FeedCard } from "../../../../_components/cards/feed-card";
import { useCardVisibility } from "@/providers/card-visibility-provider";

export default function InviteListFeedView(): ReactElement | null {
	const queryClient = useQueryClient();
	const ref = useRef<HTMLDivElement>(null);
	useCardVisibility(ref);

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
	} = useGetFeedInfinitely({ page: 1, limit: 5, type: "invites" });

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
		error: error?.response?.data.message ?? "",
	});

	const handleRefetch = () => {
		refetch();
		queryClient.invalidateQueries(["get-user-invite-count"]);
	};

	return (
		<>
			<div className="relative flex w-full flex-col md:gap-6 " ref={ref}>
				<div className="h-[0.05px]" ref={ref}></div>
				{isLoading ? (
					<CardView className="!h-[70vh] w-full rounded-none bg-none md:mx-0 md:!h-[60vh] md:!rounded-3xl">
						<PageLoading className="rounded-2xl" color="#ffffff" />
					</CardView>
				) : (feedData?.pages?.flat().length ?? 0) > 0 ? (
					feedData?.pages?.flat().map((feed, index) => (
						<div key={index} className="post-card flex gap-4">
							<div className="flex w-full items-center gap-2">
								<FeedCard
									props={feed}
									viewType="others"
									callback={handleRefetch}
								/>
							</div>
						</div>
					))
				) : (
					<PageEmpty
						label="No connections available."
						className="!h-[70vh] w-full rounded-none md:!max-h-[60vh] md:rounded-2xl"
					/>
				)}

				{isFetchingNextPage && (
					<div className="mx-auto flex w-full flex-row items-center justify-center text-center">
						<Loader
							size={15}
							className="animate-spin text-center text-white"
						/>
					</div>
				)}
				<div ref={observerTarget} className="!h-2 !w-full" />
			</div>
		</>
	);
}
