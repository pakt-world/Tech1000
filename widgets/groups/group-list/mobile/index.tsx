"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useMemo, useEffect, useRef } from "react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetGroupsInfinitely } from "@/lib/api/group";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import useQueryParams from "@/hooks/use-query-params";
import GroupsFilterComponent4Mobile from "./_components/groups-filter-4-moble";
import GroupListView4Mobile from "./_components/group-list-view-4-mobile";

const GroupListPage4Mobile = (): ReactElement | null => {
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

	const scrollRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({ top: -100, behavior: "smooth" });
		}
	}, [params.type]);

	return (
		<div className="scrollbar-hide flex h-full flex-col">
			<GroupsFilterComponent4Mobile />
			<div
				ref={scrollRef}
				className="jiu relative mt-14  w-full overflow-scroll"
			>
				<div className="h-[1px]"></div>
				<GroupListView4Mobile
					isLoading={isLoading}
					groupsData={groupsData}
					data={data}
					isFetchingNextPage={isFetchingNextPage}
					observerTarget={observerTarget}
				/>
			</div>
		</div>
	);
};

export default GroupListPage4Mobile;
