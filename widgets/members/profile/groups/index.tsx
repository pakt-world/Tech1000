"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependencies                         */
/* -------------------------------------------------------------------------- */

import React, { useMemo, useRef, useState } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependencies                         */
/* -------------------------------------------------------------------------- */
// import { Spinner } from "@/components/common/loader";
import { useGetUserGroupsInfinitely } from "@/lib/api/group";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import GroupsCard from "@/widgets/groups/_shared/groups-card";
import useQueryParams from "@/hooks/use-query-params";
import { PageEmpty } from "@/components/common/page-empty";
import { PageLoading } from "@/components/common/page-loading";
import { useWindowSize } from "usehooks-ts";

export const UserGroups = ({
	isPartner,
	tab,
	talentId,
}: {
	isPartner?: boolean;
	tab?: boolean;
	talentId?: string;
}): JSX.Element => {
	const swiperRef = useRef<any>(null);
	const [isAtBeginning, setIsAtBeginning] = useState(true);
	const [isAtEnd, setIsAtEnd] = useState(false);
	const size = useWindowSize();
	const params = useQueryParams(["limit"], {
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
	} = useGetUserGroupsInfinitely({
		...params,
		limit: params.limit,
		userId: talentId,
	});

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
		currentPage: 1,
		prevPage: 0,
		data: groupsData,
		refetch,
		error: error?.response?.data.message ?? "",
	});

	const slidesPerView = useMemo(() => {
		if (size.width > 2600) {
			return 5.5;
		} else if (size.width > 2500) {
			return 5.3;
		} else if (size.width > 2200) {
			return 4.7;
		} else if (size.width > 1900) {
			return 3.8;
		} else if (size.width > 1800) {
			return 3.6;
		} else if (size.width > 1650) {
			return 3.5;
		} else if (size.width > 1600) {
			return 3.1;
		} else if (size.width > 1500) {
			return 2.8;
		} else if (size.width > 1200) {
			return 2.35;
		} else if (size.width > 480) {
			return 1.5;
		} else {
			return 1;
		}
	}, [size.width]);

	const handleSwiper = (swiper: any) => {
		setIsAtBeginning(swiper.isBeginning);
		setIsAtEnd(swiper.isEnd);
	};

	const handleNextSlide = () => {
		if (hasNextPage) fetchNextPage();
		swiperRef.current?.swiper.slideNext();
	};

	const handlePrevSlide = () => {
		swiperRef.current?.swiper.slidePrev();
	};

	return (
		<div
			className={`w-full gap-1 py-6 max-sm:border-l-0 max-sm:border-r-0 sm:rounded-2xl ${
				!isPartner &&
				" border-2 border-white/20 bg-ink-darkest/40 from-white via-transparent to-white py-4 backdrop-blur-sm sm:px-6"
			} ${!tab && ""}`}
		>
			<div className="mb-4 flex w-full flex-row justify-between px-4">
				<h3 className="text-lg font-medium text-white sm:text-2xl">
					Group Membership
				</h3>
				<div className="flex flex-row gap-2">
					{/* Left Arrow Button */}
					<ArrowLeftCircle
						size={32}
						className={`${
							isAtBeginning
								? "cursor-not-allowed text-body"
								: "cursor-pointer text-white"
						}`}
						onClick={() => {
							if (!isAtBeginning) {
								handlePrevSlide();
							}
						}}
					/>

					{/* Right Arrow Button */}
					<ArrowRightCircle
						size={32}
						className={`${
							isAtEnd ||
							groupsData?.pages?.flat().length <
								Math.floor(slidesPerView) //&& !hasNextPage
								? "cursor-not-allowed text-body"
								: "cursor-pointer text-white"
						}`}
						onClick={() => {
							if (!isAtEnd || hasNextPage) {
								handleNextSlide();
							}
						}}
					/>
				</div>
			</div>

			<div className="relative flex h-full w-full basis-0 overflow-scroll px-4 md:px-0">
				{isLoading ? (
					<PageLoading
						className="h-[200px] rounded-2xl"
						color="#ffffff"
					/>
				) : groupsData?.pages?.flat().length > 0 ? (
					<Swiper
						ref={swiperRef}
						slidesPerView={slidesPerView}
						spaceBetween={10}
						className="flex w-full"
						onSlideChange={handleSwiper}
					>
						{/* {!isFetchingNextPage && (
							<div className="mx-auto ml-10 flex h-10 w-10 flex-row items-center justify-center text-center">
								<Spinner
									size={15}
									className="animate-spin text-center text-white"
								/>
							</div>
						)} */}
						{groupsData?.pages?.flat().map((group) => (
							<>
								<SwiperSlide key={group._id}>
									<GroupsCard
										key={group._id}
										name={group.name}
										id={group._id}
										image={
											group?.image ??
											"/images/onboarding-5.png"
										}
										tags={group.tags}
										members={group.memberCount}
										score={group.score}
										className="!w-[90%] min-w-full md:min-w-[394px]"
									/>
								</SwiperSlide>
								<div
									ref={observerTarget}
									className="ml-10 !h-2 !w-[10px]"
								/>
								{/* Spinner for loading more data */}
							</>
						))}
					</Swiper>
				) : (
					<PageEmpty
						className="h-[305px] w-full !py-16"
						label={"No group Available"}
					/>
				)}
			</div>
		</div>
	);
};
