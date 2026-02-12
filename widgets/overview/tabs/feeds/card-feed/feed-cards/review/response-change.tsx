"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, X } from "lucide-react";
import { type ReactElement, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import { AmbassadorBountySheet4Desktop } from "@/widgets/bounties/desktop/sheets/ambassador";
import { PartnerBountySheet4Desktop } from "@/widgets/bounties/desktop/sheets/partner";
import { DesktopSheetWrapper } from "@/widgets/bounties/desktop/sheets/wrapper";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

interface ReviewResponseChangeProps {
	id: string;
	title: string;
	description: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	bookmarked: boolean;
	bookmarkId: string;
	bountyId: string;
	isCreator: boolean;
	isDeclined: boolean;
	close?: (id: string) => void;
}

export const ReviewResponseChangeCard = ({
	id,
	title,
	bountyId,
	description,
	creator,
	talent,
	bookmarked,
	bookmarkId,
	isCreator,
	isDeclined,
	close,
}: ReviewResponseChangeProps): ReactElement => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return (
		<div
			className={`
			${
				isDeclined
					? "border-[#FF5247] bg-[#FFF4F4]"
					: "container_style !border-[#9BDCFD]"
			} relative z-10 flex h-[174px] w-full gap-4 overflow-hidden rounded-2xl border p-4`}
		>
			<SnowProfile
				src={isCreator ? talent?.avatar : creator?.avatar}
				score={isCreator ? talent?.score : creator?.score}
				size="lg"
				url={`/members/${isCreator ? talent?._id : creator?._id}`}
			/>
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-white">{title}</h3>
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

				<p className="text-sky">{description}</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="white"
							onClick={() => {
								setIsModalOpen(true);
							}}
						>
							{isDeclined ? "Review" : "Update"}
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
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			>
				{isCreator ? (
					<PartnerBountySheet4Desktop
						bountyId={bountyId}
						ambassadorId={talent?._id}
						closeModal={() => {
							setIsModalOpen(false);
						}}
						extras={id}
					/>
				) : (
					<AmbassadorBountySheet4Desktop
						bountyId={bountyId}
						closeModal={() => {
							setIsModalOpen(false);
						}}
						extras={id}
					/>
				)}
			</DesktopSheetWrapper>
		</div>
	);
};
