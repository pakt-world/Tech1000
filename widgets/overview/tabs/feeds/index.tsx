"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";
import { type ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { FeedSkeleton } from "@/components/common/skeletons/feed-skeleton";
import { useDismissFeed, useGetTimeline } from "@/lib/api/dashboard";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { FeedType } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { determineRole } from "@/lib/utils";

import { TabContentWrapper } from "../misc/tab-contents-wrapper";
import { ParseFeedView } from "./card-feed";

export const Feeds = ({
	rates,
}: {
	rates: ExchangeRateRecord | undefined;
}): ReactElement => {
	const tab = useMediaQuery("(min-width: 640px)");
	const user = useUserState();
	const userType = determineRole(user);
	const loggedInUser = user?._id;

	const currentPageRef = useRef(1);
	const prevPageRef = useRef(0);

	const [currentData, setCurrentData] = useState([]);
	const [observe, setObserve] = useState(false);

	const {
		data: timelineData,
		refetch: feedRefetch,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetTimeline({
		page: currentPageRef.current,
		limit: 10,
		filter: {
			isOwner: true,
			type: `${FeedType.BOUNTY_DELIVERABLE_UPDATE},${FeedType.BOUNTY_APPLICATION_SUBMITTED},${FeedType.BOUNTY_CANCELLED},${FeedType.BOUNTY_COMPLETION},${FeedType.BOUNTY_INVITATION_ACCEPTED},${FeedType.BOUNTY_INVITATION_DECLINED},${FeedType.BOUNTY_INVITATION_RECEIVED},${FeedType.PUBLIC_BOUNTY_CREATED},${FeedType.PUBLIC_BOUNTY_FILLED}`,
			isPublic: true,
		},
	});

	const observerTarget = useRef<HTMLDivElement | null>(null);

	const callback = async (): Promise<void> => {
		await Promise.all([feedRefetch()]);
	};
	const dismissFeed = useDismissFeed();

	const dismissByID = (id: string): void => {
		dismissFeed.mutate(id, {
			onSuccess: () => {
				// refetch feeds
				callback?.();
			},
		});
	};

	const fetchMore = (): void => {
		setObserve(false);
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	useEffect(() => {
		const currentTarget = observerTarget.current;
		if (!currentTarget) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) setObserve(true);
			},
			{ threshold: 0.5 }
		);

		observer.observe(currentTarget);

		return () => {
			observer.unobserve(currentTarget);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [observerTarget.current]);

	useEffect(() => {
		if (
			!isLoading &&
			!isFetchingNextPage &&
			prevPageRef !== currentPageRef
		) {
			feedRefetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPageRef.current]);

	useEffect(() => {
		if (observe) {
			fetchMore();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [observe]);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let totalData: any = [];
		// if (timelineData?.pages) {
		if (timelineData && Array.isArray(timelineData.pages)) {
			for (let i = 0; i < timelineData.pages.length; i++) {
				const timeData = timelineData.pages[i];
				if (Array.isArray(timeData)) {
					totalData = [...totalData, ...timeData];
				}
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const newData = totalData.sort((a: any, b: any) => {
			if (a && b) {
				return (
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
				);
			}
			return 0;
		});

		setCurrentData(newData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timelineData, timelineData?.pages]);

	const timelineFeeds = useMemo(
		() =>
			(currentData || []).map((feed, i) =>
				ParseFeedView(
					feed,
					loggedInUser,
					i,
					rates,
					callback,
					dismissByID,
					userType,
					tab
				)
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentData]
	);

	// Add Shimmer effect if all necessary data are not ready
	if (isLoading && timelineFeeds.length === 0 && rates !== undefined) {
		return (
			<TabContentWrapper>
				<FeedSkeleton />
			</TabContentWrapper>
		);
	}
	if (isError) {
		return (
			<PageError className="max-sm:h-[35vh] sm:!h-[65vh] sm:rounded-2xl" />
		);
	}
	if (timelineFeeds.length === 0 && rates !== undefined) {
		return (
			<PageEmpty className="max-sm:h-[35vh] sm:!h-[65vh] sm:rounded-2xl" />
		);
	}
	return (
		<TabContentWrapper>
			{timelineFeeds}
			{isFetchingNextPage && (
				<div className="mx-auto flex w-full flex-row items-center justify-center text-center max-sm:my-4">
					<Loader
						size={25}
						className="animate-spin text-center text-white"
					/>
				</div>
			)}
			<span ref={observerTarget} />
		</TabContentWrapper>
	);
};
