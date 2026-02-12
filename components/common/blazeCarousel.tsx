"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import "blaze-slider/dist/blaze.css";

import BlazeSlider, { type BlazeConfig } from "blaze-slider";
import { type KeenSliderInstance } from "keen-slider";
import { useKeenSlider } from "keen-slider/react";
import React, { useEffect, useRef, useState } from "react";

const defaultConfig: BlazeConfig = {
	all: {
		loop: false,
		slidesToShow: 2,
		slidesToScroll: 2,
		transitionDuration: 300,
		slideGap: "10px",
	},
	"(max-width: 500px)": {
		slidesToShow: 1,
		slidesToScroll: 1,
	},
};

interface BlazeSliderHook {
	ref: React.RefObject<HTMLDivElement>;
	slider: BlazeSlider | undefined;
	currentSlide: number;
	firstSlide: number;
	lastSlide: number;
	totalSlides: number;
	prevSlide: () => void;
	nextSlide: () => void;
}

export const useBlazeSlider = (config?: BlazeConfig): BlazeSliderHook => {
	const sliderRefIn = React.useRef<BlazeSlider>();
	const elRef = useRef<HTMLDivElement>(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [lastSlideIndex, setLastSlide] = useState(0);
	const [firstSlideIndex, setFirstSlide] = useState(0);
	const [sliderRef, setSliderRef] = useState<BlazeSlider>();
	const totalSlides = Number(sliderRef?.states.length) - 1;
	useEffect(() => {
		if (!sliderRefIn.current && elRef.current) {
			sliderRefIn.current = new BlazeSlider(
				elRef.current,
				config ?? defaultConfig
			);
			setSliderRef(sliderRefIn.current);
		}
	}, [config]);

	useEffect(() => {
		const unsubscribe = sliderRef?.onSlide(
			(pageIndex, firstSlideIndex, lastSlideIndex) => {
				setCurrentSlide(pageIndex);
				setLastSlide(lastSlideIndex);
				setFirstSlide(firstSlideIndex);
			}
		);
		return () => {
			unsubscribe?.();
		};
	}, [sliderRef]);
	const prevSlide = (): void => sliderRef?.next();
	const nextSlide = (): void => sliderRef?.prev();
	return {
		ref: elRef,
		slider: sliderRef,
		currentSlide,
		firstSlide: firstSlideIndex,
		lastSlide: lastSlideIndex,
		totalSlides,
		prevSlide,
		nextSlide,
	};
};

interface CarouselProps {
	elRef: React.RefObject<HTMLDivElement>;
	children: React.ReactNode;
}

export const BlazeCarousel: React.FC<CarouselProps> = ({ elRef, children }) => {
	return (
		// <div className='relative w-full'>
		<div
			ref={elRef}
			className="blaze-slider"
			style={{ ["--slides-to-show" as string | number]: 2 }}
		>
			<div className="blaze-container">
				<div className="blaze-track-container">
					<div className="blaze-track">
						{React.Children.map(children, (Child) => Child)}
					</div>
				</div>
			</div>
		</div>
		// </div>
	);
};

interface KeenSliderHooks {
	ref: React.RefObject<HTMLDivElement>;
	slider: KeenSliderInstance<HTMLDivElement> | null;
	currentSlide: number;
	totalSlides: number | undefined;
	prevSlide: () => void;
	nextSlide: () => void;
}

export const useKeenSlide = (): KeenSliderHooks => {
	const [actualSlide, setActualSlide] = useState(0);
	const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(
		{
			mode: "snap",
			slides: {
				perView: 2,
				spacing: 15,
			},
			initial: 0,
			slideChanged(s) {
				setActualSlide(s.track.details.rel);
			},
		},
		[]
	);

	const currentSlide = actualSlide;

	const totalSlides = slider.current?.slides.length;

	const prevSlide = (): void => slider.current?.prev();
	const nextSlide = (): void => slider.current?.next();
	return {
		// @ts-expect-error --- TODO: fix this
		ref: sliderRef,
		// @ts-expect-error --- TODO: fix this
		slider,
		currentSlide,
		totalSlides,
		prevSlide,
		nextSlide,
	};
};

export const KeenCarousel: React.FC<CarouselProps> = ({ elRef, children }) => {
	return (
		<div ref={elRef} className="keen-slider">
			<div className="absolute">
				{React.Children.map(children, (Child, index) => (
					<div
						key={index}
						className={`keen-slider__slide number-slide_${index}`}
					>
						{Child}
					</div>
				))}
			</div>
		</div>
	);
};
