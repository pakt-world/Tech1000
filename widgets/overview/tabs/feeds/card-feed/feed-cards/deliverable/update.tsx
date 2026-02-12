"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { CheckBox } from "@/components/common/checkbox";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { SnowProfile } from "@/components/common/snow-profile";
import { type Roles } from "@/lib/enums";
import { titleCase } from "@/lib/utils";
import { AmbassadorBountySheet4Desktop } from "@/widgets/bounties/desktop/sheets/ambassador";
import { PartnerBountySheet4Desktop } from "@/widgets/bounties/desktop/sheets/partner";
import { DesktopSheetWrapper } from "@/widgets/bounties/desktop/sheets/wrapper";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

interface TalentBountyUpdateProps {
	id: string;
	title: string;
	description: string;
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
	progress: {
		total: number;
		progress: number;
	};
	bountyTitle?: string;
	isMarked: boolean;
	close?: (id: string) => void;
}

const MAX_LEN = 150;

export const BountyUpdateFeed = ({
	id,
	bountyId,
	talent,
	creator,
	title,
	description,
	progress,
	bookmarked,
	bookmarkId,
	isCreator,
	bountyTitle,
	isMarked,
	close,
}: TalentBountyUpdateProps): ReactElement => {
	const [isDesktopSheetOpen, setIsDesktopSheetOpen] = useState(false);
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	return tab ? (
		<div className="container_style relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl !border-[##CDCFD0] px-4 pl-2">
			<SnowProfile
				src={talent?.avatar}
				score={talent?.score}
				size="lg"
				url={`/members/${talent?._id}`}
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex justify-between">
					<h3 className="w-[90%] items-center text-xl text-white">
						{!isCreator
							? title
							: `${talent?.name} ${isMarked ? "completed" : "Unchecked"} a deliverable on `}{" "}
						<span className="font-bold">{bountyTitle}</span>
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
				{/* <p className="text-body">{!isCreator ? description : `✅ ${description}`}</p> */}
				<p className="flex flex-row gap-4 capitalize text-white">
					{" "}
					<CheckBox isChecked={isMarked} />{" "}
					{description.length > MAX_LEN
						? `${description.slice(0, MAX_LEN)}...`
						: description}
				</p>
				<div className="mt-auto flex items-center justify-between">
					<div className="flex w-full items-center gap-2">
						{/* {progress.progress === 100 && ( */}
						<Button
							size="sm"
							variant="white"
							className="w-[120px]"
							onClick={() => {
								setIsDesktopSheetOpen(true);
							}}
						>
							See Update
						</Button>
						{/* )} */}
						<Link
							href={`/messages?userId=${isCreator ? talent?._id : creator?._id}`}
						>
							<Button
								size="sm"
								variant="outline"
								className="w-[120px]"
							>
								Message
							</Button>
						</Link>
						<DeliverableProgressBar
							percentageProgress={progress.progress}
							totalDeliverables={progress.total}
							className="w-full max-w-[300px]"
						/>
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
						ambassadorId={talent._id}
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
					score={talent.score}
					src={talent.avatar}
					size="sm"
					url={`/members/${talent._id}`}
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
				<h3 className="w-[90%] items-center text-base text-gray-400">
					{!isCreator
						? title
						: `${talent?.name} ${isMarked ? "completed" : "Unchecked"} a deliverable on `}{" "}
					<span className="font-bold text-white">{bountyTitle}</span>
				</h3>
				<p className="line-clamp-2 text-base capitalize text-white">
					{description}
				</p>
				<div className="mt-auto flex items-center justify-between">
					<div className="flex w-[80%]">
						<DeliverableProgressBar
							percentageProgress={progress.progress}
							totalDeliverables={progress.total}
							className="w-full max-w-[300px]"
						/>
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
			<Button
				size="md"
				fullWidth
				variant="outline"
				className="w-[120px]"
				onClick={() => {
					router.push(`/bounties/${bountyId}/updates`);
				}}
			>
				See Update
			</Button>
		</div>
	);
};
