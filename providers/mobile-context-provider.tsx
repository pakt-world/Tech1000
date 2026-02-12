/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

interface ScrollContextType {
	isAtTop: boolean;
	isTouching: boolean;
	isScrolling: boolean;
	setIsScrolling: (isScrolling: boolean) => void;
	showLeaderBoard: boolean;
	setShowLeaderBoard: (showLeaderBoard: boolean) => void;
	showMemberSearch: boolean;
	setShowMemberSearch: (showLeaderBoard: boolean) => void;
	showOpenBounties: boolean;
	setShowOpenBounties: (showLeaderBoard: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function MobileProvider({
	delay = 0, // Default delay in milliseconds
	scrollThreshold = 100, // Added scrollThreshold for custom scroll triggering
	children,
}: {
	scrollThreshold?: number;
	delay?: number;
	children: ReactNode;
}): JSX.Element {
	const [showLeaderBoard, setShowLeaderBoard] = useState<boolean>(false);
	const [showMemberSearch, setShowMemberSearch] = useState<boolean>(false);
	const [showOpenBounties, setShowOpenBounties] = useState<boolean>(false);
	const [isTouching, setIsTouching] = useState(false);
	const [isScrolling, setIsScrolling] = useState(false);
	const [isAtTop, setIsAtTop] = useState(true);
	const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

	const handleScroll = useCallback(() => {
		const scrollPosition =
			window.scrollY || document.documentElement.scrollTop;

		// Check if the user has scrolled past the threshold
		setIsAtTop(scrollPosition <= scrollThreshold);

		// Start detecting scrolling
		if (!isScrolling) {
			setIsScrolling(true);
		}

		// Clear the timeout if the user continues scrolling
		if (scrollTimeout.current) {
			clearTimeout(scrollTimeout.current);
		}

		// Set a timeout to detect when scrolling stops (after `delay` milliseconds of no scrolling)
		scrollTimeout.current = setTimeout(() => {
			setIsScrolling(false);
			setIsTouching(false);
		}, delay);
	}, [delay, scrollThreshold, isScrolling]);

	const handleTouchStart = () => {
		setIsTouching(true);
	};

	const handleTouchEnd = () => {
		setIsTouching(false);
	};

	useEffect(() => {
		window.addEventListener("touchstart", handleTouchStart);
		window.addEventListener("touchend", handleTouchEnd);
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("touchend", handleTouchEnd);
			window.removeEventListener("scroll", handleScroll);
			if (scrollTimeout.current) {
				clearTimeout(scrollTimeout.current);
			}
		};
	}, [handleScroll]);

	const value = useMemo(
		() => ({
			isAtTop,
			isTouching,
			isScrolling,
			setIsScrolling,
			showLeaderBoard,
			setShowLeaderBoard,
			showMemberSearch,
			setShowMemberSearch,
			showOpenBounties,
			setShowOpenBounties,
		}),
		[
			isAtTop,
			isTouching,
			isScrolling,
			setIsScrolling,
			showLeaderBoard,
			setShowLeaderBoard,
			showMemberSearch,
			setShowMemberSearch,
			showOpenBounties,
			setShowOpenBounties,
		]
	);

	return (
		<ScrollContext.Provider value={value}>
			{children}
		</ScrollContext.Provider>
	);
}

export function useMobileContext(): ScrollContextType {
	const context = useContext(ScrollContext);
	if (context === undefined) {
		throw new Error(
			"useMobileContext must be used within a MobileProvider"
		);
	}
	return context;
}
