"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, Star, X } from "lucide-react";
import Rating from "react-rating";
import { useMediaQuery } from "usehooks-ts";

import { SnowProfile } from "@/components/common/snow-profile";
import { titleCase } from "@/lib/utils";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

const MAX_LEN = 150;

interface ReviewBountyProps {
	id: string;
	title: string;
	description: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		role: string;
	};
	bookmarked: boolean;
	bookmarkId: string;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		role: string;
	};
	isCreator: boolean;
	rating?: number;
	close?: (id: string) => void;
}

export const BountyReviewedFeed = ({
	id,
	talent,
	creator,
	title,
	description,
	bookmarked,
	bookmarkId,
	isCreator,
	rating,
	close,
}: ReviewBountyProps): JSX.Element => {
	const tab = useMediaQuery("(min-width: 640px)");

	return tab ? (
		<div className="container_style relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl border-[#9BDCFD] px-4 pl-2">
			<SnowProfile
				src={creator?.avatar}
				score={creator?.score}
				size="lg"
				url={`/members/${creator?._id}`}
				isPartner
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex justify-between">
					<h3 className="w-[90%] items-center text-xl text-white">
						{creator?.name} has reviewed your work on{" "}
						<span className="font-bold">{title}</span>
					</h3>
					{close && (
						<X
							size={20}
							className="cursor-pointer text-white"
							onClick={() => {
								close(id);
							}}
						/>
					)}
				</div>

				<p className="text-white">
					{description.length > MAX_LEN
						? `${description.slice(0, MAX_LEN)}...`
						: description}
				</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						{rating && (
							// @ts-expect-error -- Rating' cannot be used as a JSX component. Its type 'typeof Rating' is not a valid JSX element type.ts(2786)
							<Rating
								initialRating={rating}
								fullSymbol={
									<Star
										fill="#15D28E"
										color="#15D28E"
										className="mt-[4px]"
									/>
								}
								emptySymbol={
									<Star
										fill="transparent"
										color="#15D28E"
										className="mt-[4px]"
									/>
								}
								readonly
							/>
						)}
					</div>
					<RenderBookMark
						size={20}
						isBookmarked={bookmarked}
						type="feed"
						id={id}
						bookmarkId={bookmarkId}
					/>
				</div>
			</div>

			<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
				<Briefcase size={200} color="#F2F4F5" className="opacity-20" />
			</div>
		</div>
	) : (
		<div className="container_style z-10 flex w-full cursor-pointer flex-col gap-4 overflow-hidden !border-l-0 !border-r-0 border-b border-t !border-[#9BDCFD] px-[21px] py-4 sm:hidden">
			<div className="relative -left-[5px] flex items-center gap-2">
				<SnowProfile
					src={creator.avatar}
					score={creator.score}
					size="sm"
					url={`/members/${creator._id}`}
					isPartner
				/>
				<div className="inline-flex flex-col items-start justify-start">
					<p className="flex text-lg leading-[27px] tracking-wide text-white">
						{creator.name}
					</p>
					<span className="text-xs leading-[18px] tracking-wide text-gray-300">
						{titleCase(creator.role)}
					</span>
				</div>
			</div>
			<div className="flex w-full flex-col gap-2">
				<h3 className="w-[90%] items-center text-base font-medium text-white">
					{isCreator ? talent.name : creator.name} has reviewed your
					work on <span className="font-bold">{title}</span>
				</h3>

				<p className="break-words text-base capitalize text-gray-400">
					{description}
				</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						{rating && (
							// @ts-expect-error -- Rating' cannot be used as a JSX component. Its type 'typeof Rating' is not a valid JSX element type.ts(2786)
							<Rating
								initialRating={rating}
								fullSymbol={
									<Star
										fill="#15D28E"
										color="#15D28E"
										className="mt-[4px]"
									/>
								}
								emptySymbol={
									<Star
										fill="transparent"
										color="#15D28E"
										className="mt-[4px]"
									/>
								}
								readonly
							/>
						)}
					</div>
					<RenderBookMark
						size={20}
						isBookmarked={bookmarked}
						type="feed"
						id={id}
						bookmarkId={bookmarkId}
					/>
				</div>
			</div>
		</div>
	);
};
