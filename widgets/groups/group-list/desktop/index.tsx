"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useMemo } from "react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetGroupsInfinitely } from "@/lib/api/group";
import GroupsFilterComponent from "./_components/groups-filter-4-desktop";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import useQueryParams from "@/hooks/use-query-params";
import FetchingIndicator from "@/components/common/fetching-indicator";
import GroupListVie4Desktop from "./_components/group-list-view-4-desktop";

const GroupListPage4Desktop = (): ReactElement | null => {
	const params = useQueryParams(["limit", "type", "tags", "search"], {
		limit: 10,
	});

	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetGroupsInfinitely({ ...params, limit: 10, tags: params.tags });

	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;

	const groupsData = useMemo(
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
		data: groupsData,
		refetch,
		error: error?.response?.data.message ?? "",
	});

	return (
		<div className="full  flex max-h-[100vh] w-full flex-col gap-6 overflow-hidden px-2">
			<GroupsFilterComponent />

			<GroupListVie4Desktop
				isLoading={isLoading}
				groupsData={groupsData}
				data={data}
			/>

			<FetchingIndicator
				isFetchingNextPage={isFetchingNextPage}
				observerTarget={observerTarget}
			/>
		</div>
	);
};

export default GroupListPage4Desktop;
