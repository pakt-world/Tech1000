"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, X } from "lucide-react";
import Link from "next/link";
import { type ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

interface BountyCancelledProps {
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
	bountyId: string;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	isCreator: boolean;
	close?: (id: string) => void;
}

export const BountyCancelled = ({
	id,
	bountyId,
	talent,
	creator,
	title,
	bookmarked,
	bookmarkId,
	isCreator,
	close,
}: BountyCancelledProps): ReactElement => {
	const tab = useMediaQuery("(min-width: 640px)");

	return tab ? (
		<div className="relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl border border-[#FF9898] bg-[#FFF4F4] px-4 pl-2">
			<SnowProfile
				src={isCreator ? talent?.avatar : creator?.avatar}
				score={isCreator ? talent?.score : creator?.score}
				size="lg"
				url={`/members/${isCreator ? talent?._id : creator?._id}`}
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-title">
						{creator?.name} Cancelled the Bounty
					</h3>
					{close && (
						<X
							size={20}
							className="cursor-pointer"
							onClick={() => {
								close(id);
							}}
						/>
					)}
				</div>
				<p className="text-3xl text-body">{title}</p>
				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Link href={`/bounty/${bountyId}`}>
							<Button
								size="sm"
								variant="white"
								className="w-[120px]"
							>
								See Details
							</Button>
						</Link>
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
				<Briefcase size={200} color="#FFE5E5" />
			</div>
		</div>
	) : (
		<div className="relative z-10 flex w-full gap-4 overflow-hidden border-b border-t border-[#FF9898] bg-[#FFF4F4] px-4 pl-2">
			<SnowProfile
				src={isCreator ? talent?.avatar : creator?.avatar}
				score={isCreator ? talent?.score : creator?.score}
				size="lg"
				url={`/members/${isCreator ? talent?._id : creator?._id}`}
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<h3 className="text-lg font-bold text-title">
					{creator?.name} Cancelled the Bounty
				</h3>

				<p className="text-xl text-body">{title}</p>
				<div className="mt-auto flex items-center gap-4">
					<Button
						size="sm"
						variant="outline"
						className="w-[120px]"
						asChild
					>
						<Link href={`/bounty/${bountyId}`}>See Details</Link>
					</Button>

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
