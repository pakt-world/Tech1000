"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const useScrollToTop = (noScroll?: boolean): void => {
	const pathname = usePathname();

	useEffect(() => {
		// Scroll to top whenever the route changes
		if (!noScroll) {
			window.scrollTo(0, 0);
			document.documentElement.scrollTop = 0; // For some mobile browsers
		}
	}, [pathname]);
};
