/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Checkbox } from "@/components/common/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/common/select";
import { SortApplicationsBy, SortApplicationsScoresBy } from "@/lib/enums";

const SORT_BY = [
	{
		label: "Highest to lowest",
		value: SortApplicationsScoresBy.HIGHEST_TO_LOWEST,
	},
	{
		label: "Lowest to highest",
		value: SortApplicationsScoresBy.LOWEST_TO_HIGHEST,
	},
];

interface ApplicantFilterProps {
	setSkillFilters: (value: string[]) => void;
	skillFilters: string[];
	setSortBy: (value: SortApplicationsBy) => void;
	setScoreSort: (value: SortApplicationsScoresBy) => void;
	scoreSort: SortApplicationsScoresBy;
	bounty: {
		tagsData: string[];
	};
}

export const ApplicantFilter = ({
	setSkillFilters,
	skillFilters,
	setSortBy,
	setScoreSort,
	scoreSort,
	bounty,
}: ApplicantFilterProps): JSX.Element => {
	return (
		<div className="container_style flex h-fit shrink-0 grow-0 basis-[300px] flex-col gap-4 rounded-2xl p-4">
			<div className="">
				<p className="pb-2 text-white">Snow score</p>
				<Select
					defaultValue={scoreSort}
					onValueChange={(value) => {
						setSortBy(SortApplicationsBy.SCORE);
						setScoreSort(value as SortApplicationsScoresBy);
					}}
				>
					<SelectTrigger className="input-style h-10 w-full rounded-lg text-base !text-white">
						<SelectValue placeholder="Highest to lowest" />
					</SelectTrigger>
					<SelectContent className="container_style">
						{SORT_BY.map(({ label, value }) => (
							<SelectItem
								key={value}
								value={value}
								className="cursor-pointer rounded py-2 text-white hover:!bg-white hover:!bg-opacity-20"
							>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-white">Preferred Skills</span>

				<div className="flex flex-col gap-2">
					{bounty.tagsData
						.map((tag) => tag.toLowerCase())
						.map((tag) => (
							<button
								key={tag}
								onClick={() => {
									if (skillFilters.includes(tag)) {
										setSkillFilters(
											skillFilters.filter(
												(skill) => skill !== tag
											)
										);
									} else {
										setSkillFilters([...skillFilters, tag]);
									}
								}}
								className="input-style flex w-full items-center justify-between gap-2 rounded-lg px-3 py-3 duration-300"
								type="button"
							>
								<span className="capitalize text-white">
									{tag}
								</span>
								<Checkbox
									checked={skillFilters.includes(tag)}
									className="checkbox_style"
								/>
							</button>
						))}
				</div>
			</div>
		</div>
	);
};
