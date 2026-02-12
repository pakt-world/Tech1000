"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Link from "next/link";

import { SnowProfile } from "@/components/common/snow-profile";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { limitString, titleCase } from "@/lib/utils";

interface TalentBoxProps {
	id: string;
	name: string;
	title: string;
	imageUrl?: string;
	score?: string;
	skills: Array<{ name: string; color: string }>;
	nftTokenNumber?: string;
}

export const MemberCard = ({
	id,
	name,
	title,
	imageUrl,
	skills,
	nftTokenNumber,
}: TalentBoxProps): JSX.Element => {
	return (
		<Link
			key={id}
			className="m-0 w-full border-t-2 border-[#ffffff]/50 from-white via-transparent to-white px-[21px] py-4 backdrop-blur-sm"
			href={`/members/${id}`}
		>
			<div className="inline-flex w-full items-start">
				<SnowProfile
					size="2md"
					score={parseInt(nftTokenNumber || "") || 0}
					src={imageUrl}
					url={`/members/${id}`}
					className="relative -left-[10px]"
				/>
				<div className="inline-flex flex-col items-start justify-between gap-4">
					<div className="flex flex-col items-start justify-start gap-[2.58px]">
						<h4 className="flex-1 break-words text-lg font-bold leading-[27px] tracking-wide text-white">
							{name}
						</h4>
						<p className="text-base leading-normal tracking-tight text-white">
							{titleCase(title || "Builder")}
						</p>
					</div>
					<div className="flex items-center justify-start gap-1">
						{skills?.length > 0 && (
							<div className="flex w-full flex-wrap items-center gap-2">
								{skills?.slice(0, 3).map(
									(
										skill: {
											name: string;
											color: string;
										},
										i: number
									) => {
										const { color, name: n } = skill;
										const s = n || skill;
										return (
											<span
												key={i}
												className="w-max shrink-0 items-center gap-2 rounded-3xl px-3 py-1 text-center text-sm capitalize"
												style={{
													backgroundColor:
														color || "#B2AAE9",
												}}
											>
												{limitString(s as string)}
											</span>
										);
									}
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
};
