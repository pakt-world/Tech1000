/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";

import { NumericInput } from "@/components/common/numeric-input";

interface OpenHeaderProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	minimumPriceQuery: string;
	setMinimumPriceQuery: (value: string) => void;
	maximumPriceQuery: string | number;
	setMaximumPriceQuery: (value: string | number) => void;
}

export const OpenHeader = ({
	searchQuery,
	setSearchQuery,
	minimumPriceQuery,
	setMinimumPriceQuery,
	maximumPriceQuery,
	setMaximumPriceQuery,
}: OpenHeaderProps): React.JSX.Element => {
	return (
		<div className="container_style sticky left-0 top-0 z-[99] flex w-full items-end gap-4 rounded-2xl p-6">
			<div className="relative flex w-1/2 grow flex-col gap-1">
				<label htmlFor="" className="text-sm">
					Search
				</label>
				<input
					type="text"
					value={searchQuery}
					placeholder="Search name, skill, category, etc."
					onChange={(e) => {
						setSearchQuery(e.target.value);
					}}
					className="input-style h-11 rounded-lg px-3 !text-white focus:outline-none"
				/>
			</div>
			<div className="relative flex w-1/2 grow flex-col gap-1">
				<label htmlFor="" className="text-sm">
					Bounty Price
				</label>
				<div className="input-style flex h-11 gap-2 rounded-lg py-2 !text-white">
					<NumericInput
						type="text"
						value={minimumPriceQuery}
						placeholder="From:"
						onChange={(e) => {
							setMinimumPriceQuery(e.target.value);
						}}
						className="grow bg-transparent px-3 placeholder:text-sm focus:outline-none"
					/>
					<div className="border-r border-line" />
					<NumericInput
						type="text"
						placeholder="To:"
						value={maximumPriceQuery}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setMaximumPriceQuery(e.target.value);
						}}
						className="grow bg-transparent px-3 placeholder:text-sm focus:outline-none"
					/>
				</div>
			</div>
		</div>
	);
};
