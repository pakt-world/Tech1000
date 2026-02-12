"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/common/button";
import { GroupAchievemtProps } from "@/lib/types/member";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { AchievementBar } from "./bar";
import { type AchievementType } from "./types";

export interface MODAchievementProps {
	score?: number;
	achievements: GroupAchievemtProps;
	isPartner?: boolean;
}

export const Achievements = ({
	score,
	achievements,
	isPartner,
}: MODAchievementProps): JSX.Element => {
	const [showAchievements, setShowAchievements] = useState(false);
	const ach = [
		// temp
		{
			"type": "TechScore",
			"total": score || 0,
			"value": score || 0,
		},
		{
			"type": "Posts",
			"total": achievements?.posts || 0,
			"value": achievements?.posts || 0,
		},
		{
			"type": "Comments",
			"total": achievements?.comments || 0,
			"value": achievements?.comments || 0,
		},
		{
			"type": "Upvotes",
			"total": achievements?.upvotes || 0,
			"value": achievements?.upvotes || 0,
		},
	];

	return (
		<div className="shrink-0 bg-ink-darkest/40 from-white via-transparent to-white backdrop-blur-sm max-sm:border-l-0 max-sm:border-r-0 sm:rounded-2xl md:border-2 md:border-[#7DDE86] md:p-[4px]">
			<div className="flex h-full w-full shrink-0 flex-col items-center px-4 py-4 sm:gap-4 sm:rounded-xl sm:px-6 md:w-fit">
				<Button
					className="!m-0 flex !w-full items-start justify-between !p-0 md:items-center md:justify-center"
					onClick={() => {
						setShowAchievements(!showAchievements);
					}}
					variant="ghost"
				>
					<h3 className="text-left text-lg font-medium text-white sm:text-2xl md:text-center">
						Achievements
					</h3>
					<ChevronRight
						className={`h-6 w-6 text-body transition-transform duration-300 sm:hidden ${showAchievements ? "rotate-90 transform" : ""}`}
					/>
				</Button>

				<div
					className={`grid w-full grid-cols-4 gap-3 overflow-hidden transition-all duration-300  ${showAchievements ? " mt-4 h-fit" : "h-0"} sm:mt-0 sm:h-fit`}
				>
					{ach.length > 0 &&
						ach.map(({ total, type, value }) => {
							return (
								<AchievementBar
									key={type}
									achievement={{
										minValue: 0,
										value: Math.floor(Number(value)),
										maxValue: Number(total),
										type: type as AchievementType,
									}}
									isPartner={isPartner}
								/>
							);
						})}
				</div>
			</div>
		</div>
	);
};
