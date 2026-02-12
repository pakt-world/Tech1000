"use client";

import { useEffect } from "react";

export const useViewportHeight = (): void => {
	useEffect(() => {
		// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
		const updateVh = (): void => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty("--vh", `${vh}px`);
		};

		window.addEventListener("resize", updateVh);
		updateVh();

		return () => {
			window.removeEventListener("resize", updateVh);
		};
	}, []);
};
