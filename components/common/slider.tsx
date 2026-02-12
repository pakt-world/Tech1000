"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { cloneElement, type FC, isValidElement, useRef, useState } from "react";

export interface SlideItemProps {
	goToNextSlide?: () => void;
	goToPreviousSlide?: () => void;
	isActive?: boolean;
}

interface SliderProps {
	items: Array<{
		SlideItem: FC<{
			goToNextSlide: () => void;
			goToPreviousSlide: () => void;
			isActive?: boolean;
		}>;
	}>;
}

export const Slider = ({ items }: SliderProps): JSX.Element => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const wrapperWidth = wrapperRef.current?.clientWidth ?? 0;

	const [currentSlide, setCurrentSlide] = useState(0);

	const handleNext = (): void => {
		if (currentSlide === items.length - 1) return;
		if (currentSlide === items.length) return;
		setCurrentSlide((prev) => prev + 1);
	};

	const handlePrevious = (): void => {
		if (currentSlide === 0) return;
		if (currentSlide === items.length) return;
		setCurrentSlide((prev) => prev - 1);
	};

	return (
		<div
			ref={wrapperRef}
			className="relative flex h-full flex-col overflow-hidden"
		>
			<motion.div
				className="flex h-full grow items-stretch "
				animate={{ translateX: -currentSlide * wrapperWidth }}
				transition={{
					damping: 20,
					duration: 0.1,
					type: "spring",
					stiffness: 100,
				}}
			>
				{items.map(({ SlideItem }, index) => {
					const slideItemElement = (
						<SlideItem
							goToNextSlide={handleNext}
							goToPreviousSlide={handlePrevious}
							key={index}
						/>
					);
					if (isValidElement(slideItemElement)) {
						return cloneElement(slideItemElement, {
							// eslint-disable-next-line react/no-array-index-key
							key: index,
							// @ts-expect-error ---
							isActive: currentSlide === index,
						});
					}

					return null;
				})}
			</motion.div>
		</div>
	);
};
