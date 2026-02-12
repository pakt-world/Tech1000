/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronDown } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

import { Button } from "@/components/common/button";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { NumericInput } from "@/components/common/numeric-input";
import { useMobileContext } from "@/providers/mobile-context-provider";

interface MobileOpenBountiesSearchProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	minimumPriceQuery: string;
	setMinimumPriceQuery: (value: string) => void;
	maximumPriceQuery: string | number;
	setMaximumPriceQuery: (value: string | number) => void;
}

export const MobileOpenBountiesSearch = ({
	searchQuery,
	setSearchQuery,
	minimumPriceQuery,
	setMinimumPriceQuery,
	maximumPriceQuery,
	setMaximumPriceQuery,
}: MobileOpenBountiesSearchProps): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);

	const { showOpenBounties, setShowOpenBounties } = useMobileContext();

	const handleClickOutside = (): void => {
		setShowOpenBounties(false);
	};

	// Keyboard Open - Adjust Modal Height
	useEffect(() => {
		const initialHeight = window.innerHeight;

		const handleResize = () => {
			const modal = document.querySelector(".b_modal");
			const currentHeight = window.innerHeight;

			if (initialHeight > currentHeight) {
				// Keyboard is open, adjust modal height
				modal?.classList.add("keyboard-open");
			} else {
				// Keyboard is closed, reset modal position
				modal?.classList.remove("keyboard-open");
			}
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useOnClickOutside(ref, handleClickOutside);

	return (
		<div
			className={`b_modal chat-input-container fixed left-0 top-auto !z-10 flex h-[330px] w-full shrink-0 flex-col gap-4 rounded-t-2xl bg-gradient-leaderboard px-5 py-2 transition-all duration-300 ease-in-out sm:hidden ${showOpenBounties ? "!bottom-0 !z-[999]" : " !-bottom-full !z-0"}`}
			ref={ref}
		>
			<div className="flex w-full flex-col items-center justify-center">
				<ChevronDown
					className="h-8 w-8 rounded-md bg-opacity-30 text-zinc-300"
					onClick={(e) => {
						e.stopPropagation();
						setShowOpenBounties(false);
					}}
					onKeyDown={() => {
						setShowOpenBounties(false);
					}}
					role="button"
					tabIndex={0}
					aria-label="close"
				/>
			</div>
			<div className="relative flex w-full flex-col gap-1">
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
			<div className="relative flex w-full flex-col gap-1">
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
						className="w-full grow bg-transparent px-3 !text-base placeholder:!text-base focus:outline-none"
					/>
					<div className="border-r border-line" />
					<NumericInput
						type="text"
						placeholder="To:"
						value={maximumPriceQuery}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setMaximumPriceQuery(e.target.value);
						}}
						className="w-full grow bg-transparent px-3 !text-base placeholder:!text-base focus:outline-none"
					/>
				</div>
			</div>
			<Button
				variant="white"
				fullWidth
				onClick={() => {
					setShowOpenBounties(false);
				}}
				className="mt-4"
				disabled={
					searchQuery === "" &&
					minimumPriceQuery === "" &&
					maximumPriceQuery === ""
				}
			>
				Search
			</Button>
		</div>
	);
};
