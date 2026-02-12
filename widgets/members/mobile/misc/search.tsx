"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { useMobileContext } from "@/providers/mobile-context-provider";

interface MemberSearchProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	skillsQuery: string;
	setSkillsQuery: (value: string) => void;
	minimumPriceQuery: string | number;
	setMinimumPriceQuery: (value: string) => void;
	maximumPriceQuery: string | number;
	setMaximumPriceQuery: (value: string | number) => void;
}

export const MemberSearch = ({
	searchQuery,
	setSearchQuery,
	skillsQuery,
	setSkillsQuery,
	minimumPriceQuery,

	maximumPriceQuery,
}: MemberSearchProps): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);

	const { showMemberSearch, setShowMemberSearch } = useMobileContext();

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

	const handleClickOutside = (): void => {
		setShowMemberSearch(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	return (
		<div
			className={`b_modal fixed left-0 top-auto !z-40 flex h-[410px] w-full shrink-0 flex-col gap-4 rounded-t-2xl bg-[#000000] px-5 py-2 font-circular transition-all duration-300 ease-in-out sm:hidden ${showMemberSearch ? "!bottom-0 !z-[999]" : "!-bottom-full !z-0"}`}
			ref={ref}
		>
			<div className="flex w-full flex-col items-center justify-center">
				<ChevronDown
					className="h-8 w-8 rounded-md bg-opacity-30 text-zinc-300"
					onClick={(e) => {
						e.stopPropagation();
						setShowMemberSearch(false);
					}}
					onKeyDown={() => {
						setShowMemberSearch(false);
					}}
					role="button"
					tabIndex={0}
					aria-label="close"
				/>
			</div>
			<div className="relative flex w-full flex-col gap-2">
				<label htmlFor="" className="text-sm text-white">
					Keyword
				</label>
				<input
					type="text"
					value={searchQuery}
					placeholder="Name, Category, etc."
					onChange={(e) => {
						setSearchQuery(e.target.value);
					}}
					className="h-11 rounded-lg border border-white/40 bg-[#72777A]/50 px-3 text-white focus:outline-none"
				/>
			</div>
			<div className="relative mt-2 flex w-full flex-col gap-2">
				<label htmlFor="" className="text-sm text-white">
					Skill
				</label>
				<input
					type="text"
					value={skillsQuery}
					placeholder="Meme, Defi, etc."
					onChange={(e) => {
						setSkillsQuery(e.target.value);
					}}
					className="h-11 rounded-lg border border-white/40 bg-[#72777A]/50 px-3 text-white focus:outline-none"
				/>
			</div>
			{/* <div className="relative flex flex-col gap-1">
				<label htmlFor="" className="text-sm text-white">
					{variables?.SCORE_LABEL}
				</label>
				<div className="input-style-2 flex h-11 w-full gap-2 rounded-lg border border-line bg-gray-50 py-2">
					<NumericInput
						type="text"
						value={minimumPriceQuery}
						placeholder="From:"
						onChange={(e) => {
							setMinimumPriceQuery(e.target.value);
						}}
						className="!w-full bg-transparent px-3 text-white placeholder:text-sm focus:outline-none"
					/>
					<div className="border-r border-line" />
					<NumericInput
						type="text"
						placeholder="To:"
						value={maximumPriceQuery}
						onChange={(e) => {
							setMaximumPriceQuery(e.target.value);
						}}
						className="!w-full bg-transparent px-3 text-white placeholder:text-sm focus:outline-none"
					/>
				</div>
			</div> */}
			<Button
				variant="default"
				fullWidth
				onClick={() => {
					setShowMemberSearch(false);
				}}
				className="mt-4 bg-lemon-green"
				disabled={
					searchQuery === "" &&
					skillsQuery === "" &&
					minimumPriceQuery === "" &&
					maximumPriceQuery === ""
				}
			>
				Search
			</Button>
		</div>
	);
};
