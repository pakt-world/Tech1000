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
import CardView from "@/components/common/card-view";
import { CustomInput } from "@/components/common/custom-input";
import { NumericInput } from "@/components/common/numeric-input";

interface GroupsSearchModalProps {
	handleMaximumScoreChange: (value: string) => void;
	handleMinimumScoreChange: (value: string) => void;
	searchQuery: string;
	minimumScore: string;
	maximumScore: string;
	setSearchQuery: (value: string) => void;
	setShowMemberSearch: (value: boolean) => void;
	showMemberSearch: boolean;
}

export const GroupsSearchModal4Mobile = ({
	handleMaximumScoreChange,
	handleMinimumScoreChange,
	searchQuery,
	minimumScore,
	maximumScore,
	setSearchQuery,
	setShowMemberSearch,
	showMemberSearch,
}: GroupsSearchModalProps): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);

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
			className={`b_modal fixed left-0 top-auto !z-40 flex  w-full shrink-0 flex-col gap-4 rounded-t-2xl bg-[#000000]/90 px-5 py-2 font-circular transition-all duration-300 ease-in-out sm:hidden ${showMemberSearch ? "!bottom-10 !z-[999]" : "!-bottom-full !z-0"}`}
			ref={ref}
		>
			<span className="my-2 flex w-full items-center justify-center">
				<ChevronDown
					className="h-6 w-6 rounded-md bg-opacity-30 text-zinc-300"
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
			</span>
			<CardView className="flex  w-full flex-col gap-4 bg-[#171515] !p-4">
				<CustomInput
					type="text"
					htmlFor="search"
					label="Search"
					placeholder="By name, title, etc."
					wrapper="w-full"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<div className="md: gap:3 relative flex w-full flex-col gap-2 md:gap-3">
					<label htmlFor="" className="text-md text-white">
						Group score
					</label>
					<div className=" flex  gap-2 rounded-lg border !border-neutral-600 border-opacity-30 !bg-[#FCFCFD1A] !py-[10.3px] !text-white placeholder:capitalize placeholder:!text-[#72777A]">
						<NumericInput
							type="text"
							value={minimumScore}
							placeholder="From:"
							onChange={(e) =>
								handleMinimumScoreChange(e.target.value)
							}
							className="w-full grow bg-transparent px-3 !text-base placeholder:!text-base focus:outline-none"
						/>
						<div className="border-r border-line" />
						<NumericInput
							type="text"
							placeholder="To:"
							value={maximumScore}
							onChange={(e) =>
								handleMaximumScoreChange(e.target.value)
							}
							className="w-full grow bg-transparent px-3 !text-base placeholder:!text-base focus:outline-none"
						/>
					</div>
				</div>
			</CardView>

			<Button
				className="mb-6 w-full border-none py-2 font-bold"
				fullWidth
				variant="default"
				onClick={() => setShowMemberSearch(!showMemberSearch)}
			>
				Search
			</Button>
		</div>
	);
};
