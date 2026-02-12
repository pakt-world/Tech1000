"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

// import clsx from "clsx";
import {} from // Feather,
// Library,
// type LucideIcon,
// PenTool,
// Terminal,
// Users,
// Volume2,
"lucide-react";
import React, { useEffect, useState } from "react";
import { XIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { type SlideItemProps } from "@/components/common/slider";
import { useUserState } from "@/lib/store/account";
import { useOnboardingState } from "@/lib/store/onboarding";
import { useRouter } from "next/navigation";
import { useGetAccount } from "@/lib/api/account";
import CardView from "@/components/common/card-view";

interface PillSelectorProps {
	onPillsChange: (pills: string[]) => void;
}

interface PillSelectorProps {
	onPillsChange: (pills: string[]) => void;
}

const PillSelector: React.FC<PillSelectorProps> = ({ onPillsChange }) => {
	const [textInput, setTextInput] = useState<string>("");
	const [pills, setPills] = useState<string[]>([]);

	const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTextInput(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && textInput.trim()) {
			addPill(textInput.trim());
			setTextInput("");
		}
	};

	const addPill = (label: string) => {
		const newPills = [...pills, label];
		setPills(newPills);
		onPillsChange(newPills);
	};

	const removePill = (pill: string) => {
		const newPills = pills.filter((p) => p !== pill);
		setPills(newPills);
		onPillsChange(newPills);
	};

	const toggleSelectPill = (pill: string) => {
		const newPills = pills.includes(pill)
			? pills.filter((p) => p !== pill)
			: [...pills, pill];

		setPills(newPills);
		onPillsChange(newPills);
	};

	const availablePills = [
		"Startup",
		"Memes",
		"Gaming",
		"Ai",
		"Web 3",
		"Defi",
		"Entertainment",
		"Engineering",
		"Investment",
		"Sport",
		"Travel",
		"Music",
		"NFTs",
		"Crypto Law",
		"Metaverse",
		"Predictions",
	];

	return (
		<div className="col-span-3 flex min-w-full flex-col gap-4">
			<CardView className="flex min-h-[170px] w-full flex-col !items-start justify-start rounded-md !bg-[#FCFCFD1A]/10 !px-2 !py-1.5">
				<div className="mb-2 flex w-full flex-wrap gap-2">
					{pills.map((pill, index) => (
						<div
							key={index}
							className="flex items-center gap-2 rounded-full bg-[#FCFCFD1A] px-4 py-2 text-white"
						>
							{pill}
							<XIcon
								className="h-4 w-4 cursor-pointer"
								onClick={() => removePill(pill)}
							/>
						</div>
					))}
				</div>

				{/* Input to add pills */}
				<input
					className="w-full border-none bg-transparent !p-0 text-white"
					placeholder="Enter at least three interests. Use “enter” to separate them."
					value={textInput}
					onChange={handleTextChange}
					onKeyDown={handleKeyDown}
				/>
			</CardView>

			{/* Available Pills with Toggle Selection */}
			<div className="mt-4 flex flex-col gap-6">
				<h3 className="!font-mono text-xl text-[#CDCFD0] sm:text-2xl">
					Or choose from the options below
				</h3>
				<div className=" flex flex-wrap gap-2">
					{availablePills.map((pill, index) => (
						<div
							key={index}
							className={`flex cursor-pointer items-center gap-2 rounded-full bg-[#FCFCFD1A] px-4 py-2 text-white
              ${pills.includes(pill) ? "border-2 border-lemon-green" : "border-2 border-transparent"}`}
							onClick={() =>
								pills.includes(pill)
									? removePill(pill)
									: toggleSelectPill(pill)
							}
						>
							{pill}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PillSelector;

export function Skills({ goToNextSlide }: SlideItemProps): React.JSX.Element {
	const router = useRouter();
	useGetAccount();
	const { firstName, role, profileCompleteness } = useUserState();
	const { setTags } = useOnboardingState();
	const [tagsList, setTagList] = useState<string[]>([]);
	const profileCompleted = (profileCompleteness as number) > 70;

	const handlePillChange = (value: string[]) => {
		setTags(value);
		setTagList(value);
	};

	useEffect(() => {
		if (profileCompleted) {
			router.push("/overview");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [role, router]);
	return (
		<div className="flex w-full shrink-0 flex-col items-center sm:gap-4">
			<div className="flex w-full flex-col gap-3 text-left">
				<p className="!font-mono text-lg text-[#CDCFD0] sm:text-2xl">
					Great to meet you, {firstName}.
				</p>
				<span className="font-mono text-2xl font-bold text-white sm:text-4xl">
					What are you interested in?
				</span>
			</div>
			<div className=" mt-2 grid w-full grid-cols-2 gap-4 rounded-2xl px-0 py-4 shadow sm:mt-6 sm:grid-cols-3 sm:gap-6 sm:rounded-none sm:border-none sm:bg-transparent sm:p-0 sm:shadow-none md:py-4">
				<PillSelector onPillsChange={handlePillChange} />
				<div className="col-span-2 ml-auto mt-2 flex w-full max-w-xs justify-end sm:hidden">
					<Button
						className="rounded-3xl px-10"
						size="sm"
						variant="default"
						disabled={tagsList.length < 1}
						onClick={goToNextSlide}
					>
						Continue
					</Button>
				</div>
			</div>
			<div className="ml-auto mt-2 hidden w-full  max-w-xs justify-end sm:flex">
				<Button
					className="rounded-3xl px-10"
					size="sm"
					variant="default"
					disabled={tagsList.length < 1}
					onClick={goToNextSlide}
				>
					Continue
				</Button>
			</div>
		</div>
	);
}
