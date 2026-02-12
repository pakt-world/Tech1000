"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactElement, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import { type Roles } from "@/lib/enums";
import { titleCase } from "@/lib/utils";
import { AmbassadorBountySheet4Desktop } from "@/widgets/bounties/desktop/sheets/ambassador";
import { PartnerBountySheet4Desktop } from "@/widgets/bounties/desktop/sheets/partner";
import { DesktopSheetWrapper } from "@/widgets/bounties/desktop/sheets/wrapper";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

interface BountyCompletedProps {
	id: string;
	title: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		role: Roles;
	};
	bookmarked: boolean;
	bookmarkId: string;
	bountyId: string;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		role: Roles;
	};
	isCreator: boolean;
	close?: (id: string) => void;
	tab: boolean;
}
export const BountyCompletionFeed = ({
	id,
	bountyId,
	talent,
	creator,
	title,
	bookmarked,
	bookmarkId,
	isCreator,
	close,
	tab,
}: BountyCompletedProps): ReactElement => {
	const router = useRouter();
	const [isDesktopSheetOpen, setIsDesktopSheetOpen] = useState(false);
	return tab ? (
		<div className="container_style relative z-10 flex w-full  gap-4 overflow-hidden rounded-2xl !border-[#9BDCFD] px-4 pl-2">
			<SnowProfile
				src={isCreator ? talent?.avatar : creator?.avatar}
				score={isCreator ? talent?.score : creator?.score}
				size="lg"
				url={`/members/${isCreator ? talent?._id : creator?._id}`}
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-white">
						{talent?.name} completed all deliverables
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
				<p className="text-3xl text-white">{title}</p>
				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="white"
							className="w-[120px]"
							onClick={() => {
								setIsDesktopSheetOpen(true);
							}}
						>
							Review
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
			<DesktopSheetWrapper
				isOpen={isDesktopSheetOpen}
				onOpenChange={setIsDesktopSheetOpen}
			>
				{isCreator ? (
					<PartnerBountySheet4Desktop
						bountyId={bountyId}
						ambassadorId={talent?._id}
						closeModal={() => {
							setIsDesktopSheetOpen(false);
						}}
						extras={id}
					/>
				) : (
					<AmbassadorBountySheet4Desktop
						bountyId={bountyId}
						closeModal={() => {
							setIsDesktopSheetOpen(false);
						}}
						extras={id}
					/>
				)}
			</DesktopSheetWrapper>
		</div>
	) : (
		<div className="container_style z-10 flex w-full cursor-pointer flex-col gap-4 overflow-hidden !border-l-0 !border-r-0 border-b border-t !border-[#9BDCFD] px-[21px] py-4 sm:hidden">
			<div className="relative -left-[5px] flex items-center gap-2">
				<SnowProfile
					src={isCreator ? talent.avatar : creator.avatar}
					score={isCreator ? talent.score : creator.score}
					size="sm"
					url={`/members/${isCreator ? talent._id : creator._id}`}
				/>
				<div className="inline-flex flex-col items-start justify-start">
					<p className="flex text-lg leading-[27px] tracking-wide text-white">
						{talent.name}
					</p>
					<span className="text-xs leading-[18px] tracking-wide text-gray-300">
						{titleCase(talent.role)}
					</span>
				</div>
			</div>
			<div className="flex w-full flex-col gap-2">
				<h3 className="w-[90%] items-center text-base font-medium text-white">
					{talent.name} completed all deliverables
				</h3>
				<div className="mt-auto flex items-center justify-between">
					<p className="text-base capitalize text-gray-300">
						{title}
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
				fullWidth
				variant="outline"
				className="w-[120px]"
				onClick={() => {
					router.push(`/bounties/${bountyId}/updates`);
				}}
			>
				Review Deliverables
			</Button>
		</div>
	);
};
