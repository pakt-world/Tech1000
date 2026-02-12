"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

import {
	BlazeCarousel,
	useBlazeSlider,
} from "@/components/common/blazeCarousel";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Spinner } from "@/components/common/loader";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type CollectionProps } from "@/lib/types/collection";
import { OpenBountyCard } from "@/widgets/bounties/desktop/home/open/misc/open-card";
import { OpenBountyCard4Mobile } from "@/widgets/bounties/mobile/home/open/misc/open-card";

import { Review } from "./item";
import { type ReviewProps } from "./types";

export const Reviews = ({
	reviews,
	loading,
	isPartner,
	partnerOpenBounty,
	rates,
	tab,
}: {
	reviews: ReviewProps[];
	loading: boolean;
	isPartner?: boolean;
	partnerOpenBounty?: CollectionProps[];
	rates?: ExchangeRateRecord;
	tab?: boolean;
}): JSX.Element => {
	const sliderInstance = useBlazeSlider();

	const { currentSlide } = sliderInstance;
	const { totalSlides } = sliderInstance;

	return (
		<div
			className={`w-full gap-1 py-6 max-sm:border-l-0 max-sm:border-r-0 sm:rounded-2xl ${!isPartner && " border-2 border-white/20 bg-ink-darkest/40 from-white via-transparent to-white p-4 px-4 backdrop-blur-sm sm:px-6"} ${
				!tab && "max-sm:px-4"
			}`}
		>
			<div className="mb-4 flex w-full flex-row justify-between">
				<h3 className="text-lg font-medium text-white sm:text-2xl">
					{isPartner ? "Open Bounties" : "Reviews"}
				</h3>
				<div className="flex flex-row gap-2">
					<ArrowLeftCircle
						size={32}
						className={`cursor-pointer ${currentSlide === 0 ? "text-body" : "text-white"}`}
						onClick={() => {
							sliderInstance.nextSlide();
						}}
					/>
					<ArrowRightCircle
						size={32}
						className={`cursor-pointer ${currentSlide === totalSlides ? "text-body" : "text-white"}`}
						onClick={() => {
							sliderInstance.prevSlide();
						}}
					/>
				</div>
			</div>

			{loading ? (
				<div className="z-20 my-auto flex min-h-[307px] w-full items-center justify-center text-white">
					<Spinner />
				</div>
			) : isPartner ? (
				<div className="relative h-full basis-0">
					{tab ? (
						<BlazeCarousel elRef={sliderInstance?.ref}>
							{partnerOpenBounty &&
								partnerOpenBounty.length > 0 &&
								partnerOpenBounty.map(
									(bounty: CollectionProps, i) => (
										<OpenBountyCard
											key={bounty?._id}
											savedId={bounty?.bookmarkId}
											bounty={bounty}
											rates={rates}
											isSaved={bounty.isBookmarked}
											index={
												i < 9
													? `0${i + 1}`
													: (i + 1).toString()
											}
											className="max-w-[50%]"
										/>
									)
								)}
						</BlazeCarousel>
					) : (
						<BlazeCarousel elRef={sliderInstance?.ref}>
							{partnerOpenBounty &&
								partnerOpenBounty.length > 0 &&
								partnerOpenBounty.map(
									(bounty: CollectionProps, i) => (
										<OpenBountyCard4Mobile
											key={bounty?._id}
											savedId={bounty?.bookmarkId}
											bounty={bounty}
											rates={rates}
											isSaved={bounty.isBookmarked}
											index={
												i < 9
													? `0${i + 1}`
													: (i + 1).toString()
											}
											className="primary_border-x max-w-full rounded-md bg-primary-light"
										/>
									)
								)}
						</BlazeCarousel>
					)}
					{!partnerOpenBounty ||
						(partnerOpenBounty.length === 0 && (
							<div className="m-auto flex min-h-[207px] w-full items-center text-white">
								<p className="mx-auto">No available bounty</p>
							</div>
						))}
				</div>
			) : (
				<div className="relative h-full basis-0">
					<BlazeCarousel elRef={sliderInstance?.ref}>
						{reviews &&
							reviews.length > 0 &&
							reviews.map((_review, i) => (
								<Review
									key={i}
									title={_review.title}
									body={_review.body}
									rating={_review.rating}
									user={_review.user}
									date={_review.date}
									index={
										i < 9 ? `0${i + 1}` : (i + 1).toString()
									}
								/>
							))}
					</BlazeCarousel>

					{!reviews ||
						(reviews.length === 0 && (
							<div className="m-auto flex min-h-[207px] w-full items-center text-white">
								<p className="mx-auto">No Reviews</p>
							</div>
						))}
				</div>
			)}
		</div>
	);
};
