import {
	type MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

interface InfiniteScrollProps<T> {
	fetchNextPage: () => void;
	hasNextPage: boolean | undefined;
	isFetchingNextPage: boolean;
	isLoading: boolean;
	currentPage: number;
	prevPage: number;
	data: { pages: T[][] };
	refetch: () => void;
	error: string;
}

function useInfiniteScroll<T>({
	fetchNextPage,
	hasNextPage,
	isFetchingNextPage,
	data,
	error,
}: InfiniteScrollProps<T>): {
	observerTarget: MutableRefObject<HTMLDivElement | null>;
	currentData: T[];
} {
	const observerTarget = useRef<HTMLDivElement | null>(null);
	const cooldownRef = useRef<boolean>(false);

	const [currentData, setCurrentData] = useState<T[]>([]);

	const fetchMore = useCallback((): void => {
		if (hasNextPage && !isFetchingNextPage && !cooldownRef.current) {
			fetchNextPage();
		}
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	// Force fetching if items are not enough to fill the screen
	const checkIfNeedToFetch = useCallback((): void => {
		const targetElement = observerTarget.current;
		if (targetElement) {
			const targetBottomPosition =
				targetElement.getBoundingClientRect().bottom;
			const viewportHeight = window.innerHeight;

			// Fetch if the content doesn't fill the screen
			if (
				targetBottomPosition < viewportHeight &&
				hasNextPage &&
				!isFetchingNextPage
			) {
				fetchMore();
			}
		}
	}, [hasNextPage, isFetchingNextPage, fetchMore]);

	// Set up observer
	useEffect(() => {
		const currentTarget = observerTarget.current;
		if (!currentTarget || isFetchingNextPage || cooldownRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && !isFetchingNextPage)
					fetchMore();
			},
			{ threshold: 0.5 }
		);

		observer.observe(currentTarget);

		return () => {
			observer.unobserve(currentTarget);
		};
	}, [fetchMore, isFetchingNextPage]);

	// Set cooldown on errors
	useEffect(() => {
		if (error === "Too Many Requests. Please try again later.") {
			cooldownRef.current = true;
			setTimeout(() => {
				cooldownRef.current = false;
				fetchNextPage();
			}, 10000); // 10 seconds cooldown
		}
	}, [error]);

	useEffect(() => {
		let totalData: T[] = [];
		if (data && Array.isArray(data.pages)) {
			for (let i = 0; i < data.pages.length; i++) {
				const pageData = data.pages[i];
				if (Array.isArray(pageData)) {
					totalData = [...totalData, ...pageData];
				}
			}
		}
		setCurrentData(totalData);

		// Check if additional fetch is needed after data change
		checkIfNeedToFetch();
	}, [data, checkIfNeedToFetch]);

	return { observerTarget, currentData };
}

export default useInfiniteScroll;
