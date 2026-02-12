"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, Star, X } from "lucide-react";
import { type ReactElement } from "react";
import Rating from "react-rating";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

interface ReferralBountyCompletionProps {
	id: string;
	title: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	bookmarked: boolean;
	bookmarkId: string;
	rating: number;
	close?: (id: string) => void;
}
export const ReferralBountyCompletion = ({
	id,
	talent,
	title,
	bookmarked,
	bookmarkId,
	rating,
	close,
}: ReferralBountyCompletionProps): ReactElement => {
	return (
		<div className="container_style relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl p-4">
			<SnowProfile
				src={talent?.avatar}
				score={talent?.score}
				size="lg"
				url={`/members/${talent?._id}`}
			/>
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-white">
						{talent.name} a{" "}
						{
							// @ts-expect-error --- 'Rating' cannot be used as a JSX component. Its type 'typeof Rating' is not a valid JSX element type.
							<Rating
								readonly
								initialRating={rating || 0}
								fullSymbol={
									<Star fill="#15D28E" color="#15D28E" />
								}
								emptySymbol={
									<Star fill="transparent" color="#15D28E" />
								}
							/>
						}{" "}
						completed a bounty
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
				<p className="text-3xl text-body">{title}</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button size="sm" variant="white" className="w-[120px]">
							See Review
						</Button>
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
	);
};
