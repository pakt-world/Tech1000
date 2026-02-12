"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import { titleCase } from "@/lib/utils";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

import { BountyFeedWrapper } from "./misc/wrapper";

interface BountyApplicationCardProps {
	id: string;
	title: string;
	applicant: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		title: string;
	};
	bookmarked: boolean;
	bookmarkId: string;
	bountyId: string;
	close?: (id: string) => void;
	tab?: boolean;
}

export const BountyApplicationCard = (
	props: BountyApplicationCardProps
): ReactElement => {
	const router = useRouter();
	const {
		id,
		title,
		bountyId,
		bookmarked,
		bookmarkId,
		applicant,
		close,
		tab,
	} = props;

	return tab ? (
		<BountyFeedWrapper>
			<SnowProfile
				src={applicant?.avatar}
				score={applicant?.score}
				size="lg"
				url={`/members/${applicant?._id}`}
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-white">
						New Bounty Application
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
					You Have Received a new bounty application for{" "}
					<span className="text-bold">&quot;{title}&quot;</span> from{" "}
					{applicant?.name}
				</p>

				<div className="mt-auto flex items-center justify-between">
					<Button
						size="lg"
						variant="white"
						onClick={() => {
							router.push(`/bounties/${bountyId}/applicants`);
						}}
					>
						View Applicants
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
		</BountyFeedWrapper>
	) : (
		<div className="container_style relative z-10 flex w-full flex-col gap-4 overflow-hidden !border-l-0 !border-r-0 border-b border-t !border-[#48A7F8] px-[21px] py-4 sm:hidden">
			<div className="relative -left-[5px] flex items-center gap-2">
				<SnowProfile
					src={applicant.avatar}
					score={applicant.score}
					size="sm"
					url={`/members/${applicant._id}`}
				/>
				<div className="inline-flex flex-col items-start justify-start">
					<p className="flex text-lg leading-[27px] tracking-wide text-white">
						{applicant.name}
					</p>
					<span className="text-xs leading-[18px] tracking-wide text-gray-300">
						{titleCase(applicant.title)}
					</span>
				</div>
			</div>
			<div className="flex w-full flex-col gap-2">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-bold text-white">
						New Bounty Application
					</h3>
				</div>
				<div className="flex w-full items-center justify-between gap-2">
					<p className="w-[90%] text-lg font-normal text-gray-300">
						You Have Received a new job application for{" "}
						<span className="text-bold text-white">
							&quot;{title}&quot;
						</span>{" "}
						from {applicant.name}
					</p>
					<RenderBookMark
						size={20}
						isBookmarked={bookmarked}
						type="feed"
						id={id}
						bookmarkId={bookmarkId}
					/>
				</div>
			</div>
			<Button
				size="md"
				variant="outline"
				fullWidth
				onClick={() => {
					router.push(`/bounties/${bountyId}/applicants`);
				}}
			>
				View Applicants
			</Button>
		</div>
	);
};
