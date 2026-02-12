"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
import { Plus } from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { useDebounce } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import { CustomInput } from "@/components/common/custom-input";
import { useGroupsQuery } from "@/hooks/groups/use-groups-query";
import { NumericInput } from "@/components/common/numeric-input";

// const getRandomColor = () => {
// 	const colors = ["#B2E9AA", "#E9AAAA", "#E9DBAA"];
// 	return colors[Math.floor(Math.random() * colors.length)];
// };

export default function GroupsFilterComponent(): ReactElement | null {
	const router = useRouter();

	const {
		activeTab,
		handleTabChange,
		search,
		handleSearchChange,
		minimumScore,
		maximumScore,
		handleMinimumScoreChange,
		handleMaximumScoreChange,
	} = useGroupsQuery({
		defaultTab: "public",
		tabOptions: ["created", "public", "joined", "private"],
	});

	const [searchQuery, setSearchQuery] = useState(search);
	// const [tagInput, setTagInput] = useState("");

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	useEffect(() => {
		handleSearchChange(debouncedSearchQuery);
	}, [debouncedSearchQuery, handleSearchChange]);

	// const addTag = (newTag: string) => {
	// 	if (newTag.trim() !== "") {
	// 		const newTags = [...tags, newTag.trim()];
	// 		handleTagChange(newTags);
	// 		setTagInput("");
	// 	}
	// };

	// const removeTag = (tagToRemove: string) => {
	// 	const newTags = tags.filter((tag) => tag !== tagToRemove);
	// 	handleTagChange(newTags);
	// };

	// const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
	// 	if (e.key === "Enter") {
	// 		e.preventDefault();
	// 		addTag(tagInput);
	// 	}
	// };

	// const handleScoreInputChange = () => {
	// 	handleScoreChange(minScoreQuery, maxScoreQuery);
	// };

	const goToCreateGroups = () => {
		router.push("/groups/create");
	};

	return (
		<div className="sticky -top-5 z-[100000000] flex h-fit w-full flex-col gap-6 rounded-lg !backdrop-blur-xl">
			<div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
				<CardView className=" w-fit rounded-lg !border !bg-[#7676801F]/10 !p-0 shadow-lg sm:ml-1 sm:max-w-sm ">
					<Tabs
						value={activeTab}
						onValueChange={handleTabChange}
						className="w-full"
					>
						<TabsList className="flex w-full items-center text-sm">
							<TabsTrigger
								value="public"
								className={`flex w-1/4 justify-center p-1 px-4 ${
									activeTab === "public"
										? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
										: "text-white/60"
								}`}
							>
								Public
							</TabsTrigger>
							<TabsTrigger
								value="private"
								className={`flex w-1/4 justify-center p-1 px-4 ${
									activeTab === "private"
										? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
										: "text-white/60"
								}`}
							>
								Private
							</TabsTrigger>
							<TabsTrigger
								value="created"
								className={`flex w-1/4 justify-center p-1 px-4 ${
									activeTab === "created"
										? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
										: "text-white/60"
								}`}
							>
								Created
							</TabsTrigger>
							<TabsTrigger
								value="joined"
								className={`flex w-1/4 justify-center p-1 px-4 ${
									activeTab === "joined"
										? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
										: "text-white/60"
								}`}
							>
								Joined
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardView>
				<Button
					className="flex gap-2 py-2 text-sm"
					type="button"
					variant={"default"}
					size="xs"
					onClick={goToCreateGroups}
				>
					<Plus size="18px" />
					Create Group
				</Button>
			</div>
			<CardView className="flex w-full flex-col gap-4 !border-[#F2C650] !p-4 md:flex-row">
				<CustomInput
					type="text"
					htmlFor="search"
					label="Search"
					placeholder="By name, title, etc."
					wrapper="w-1/2"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<div className="md: gap:3 relative flex w-1/2 flex-col gap-2 md:gap-3">
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
		</div>
	);
}
