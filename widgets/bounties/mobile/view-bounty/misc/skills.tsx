"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/common/button";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { sentenceCase } from "@/lib/utils";

interface BountySkillsProps {
	skills: Array<{ name: string; color: string }>;
}

export const BountySkills = ({ skills }: BountySkillsProps): JSX.Element => {
	const [showSkill, setShowSkill] = useState(false);
	return (
		<div className="primary_border-y flex w-full flex-col gap-2 p-4">
			<Button
				className="!m-0 flex w-full items-center justify-between !p-0"
				onClick={() => {
					setShowSkill(!showSkill);
				}}
				variant="ghost"
			>
				<h3 className="text-base font-bold leading-normal tracking-wide text-white">
					Preferred Skills
				</h3>
				<ChevronRight
					className={`h-6 w-6 text-body transition-transform duration-300 sm:hidden ${showSkill ? "rotate-90 transform" : ""}`}
				/>
			</Button>
			<div
				className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${showSkill ? "mt-2 h-fit" : "h-0"} sm:mt-0 sm:h-fit`}
			>
				{skills.map((skill, index) => (
					<span
						key={index}
						className="w-fit whitespace-nowrap rounded-full bg-[#F7F9FA] px-4 py-2 text-[#090A0A]"
						style={{ background: skill.color }}
					>
						{sentenceCase(skill.name)}
					</span>
				))}
			</div>
		</div>
	);
};
