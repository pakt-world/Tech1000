/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { type FC, useState } from "react";
import { ChevronRight } from "lucide-react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { getRandomReadableBgColor } from "@/lib/utils";

interface SkillsProps {
	skills: Array<{
		name: string;
		backgroundColor: string;
	}>;
}

export const ProfileSkills: FC<SkillsProps> = ({ skills }) => {
	const [showSkills, setShowSkills] = useState(false);
	return (
		<div className="primary_border-y flex h-fit w-full flex-wrap bg-ink-darkest/40 from-white via-transparent to-white p-4 backdrop-blur-sm">
			<Button
				className="!m-0 flex w-full items-center justify-between !p-0"
				onClick={() => {
					setShowSkills(!showSkills);
				}}
				variant="ghost"
			>
				<h4 className="text-lg font-bold leading-[27px] tracking-wide text-white">
					Interests
				</h4>
				<ChevronRight
					className={`h-6 w-6 text-body transition-transform duration-300 ${showSkills ? "rotate-90 transform" : ""}`}
				/>
			</Button>

			<div
				className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${showSkills ? "mt-4 h-fit" : "h-0"}`}
			>
				{skills.map((skill, i) => (
					<span
						key={i}
						className="rounded-full bg-white px-6 py-1.5 text-sm font-medium capitalize text-[#090A0A]"
						style={{
							backgroundColor:
								skill.backgroundColor ||
								getRandomReadableBgColor(),
						}}
					>
						{skill.name}
					</span>
				))}
			</div>
		</div>
	);
};

export default ProfileSkills;
