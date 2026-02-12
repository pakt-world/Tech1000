"use client";

import CardView from "@/components/common/card-view";
import { CustomInput } from "@/components/common/custom-input";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { NumericInput } from "@/components/common/numeric-input";
import { useProductVariables } from "@/hooks/use-product-variables";

export const MemberHeader = ({
	searchQuery,
	setSearchQuery,
	skillsQuery,
	setSkillsQuery,
	minimumPriceQuery,
	setMinimumPriceQuery,
	maximumPriceQuery,
	setMaximumPriceQuery,
}: {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	skillsQuery: string;
	setSkillsQuery: (value: string) => void;
	minimumPriceQuery: string | number;
	setMinimumPriceQuery: (value: string) => void;
	maximumPriceQuery: string | number;
	setMaximumPriceQuery: (value: string | number) => void;
}): JSX.Element => {
	const { variables } = useProductVariables();
	return (
		<CardView className=" flex w-full flex-col gap-10 !border-[#F2C650] !p-6 lg:flex-row lg:items-end">
			<div className="relative flex w-full grow flex-col gap-1">
				<CustomInput
					htmlFor="search"
					label="Search"
					type="text"
					value={searchQuery}
					placeholder="Name, Category, etc."
					onChange={(e) => {
						setSearchQuery(e.target.value);
					}}
				/>
			</div>
			<div className="relative flex w-full grow flex-col gap-1">
				<CustomInput
					htmlFor="skill"
					label="Interests"
					type="text"
					value={skillsQuery}
					placeholder="Memes, Finance, etc."
					onChange={(e) => {
						setSkillsQuery(e.target.value);
					}}
				/>
			</div>
			{variables?.NAME !== "Tech1000" && (
				<div className="relative flex w-full grow flex-col gap-1">
					<label htmlFor="" className="text-sm">
						{variables?.SCORE_LABEL}
					</label>
					<div className="input-style flex h-11 w-full gap-2 rounded-lg py-2">
						<NumericInput
							type="text"
							value={minimumPriceQuery}
							placeholder="From:"
							onChange={(e) => {
								setMinimumPriceQuery(e.target.value);
							}}
							className="w-full grow bg-transparent px-3 !text-white placeholder:text-sm focus:outline-none"
						/>
						<div className="border-r border-line" />
						<NumericInput
							type="text"
							placeholder="To:"
							value={maximumPriceQuery}
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>
							) => {
								setMaximumPriceQuery(e.target.value);
							}}
							className="w-full grow bg-transparent px-3 text-white placeholder:text-sm focus:outline-none"
						/>
					</div>
				</div>
			)}
		</CardView>
	);
};
