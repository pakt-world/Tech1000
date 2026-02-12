"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
import { Plus, Search } from "lucide-react";
import React, { ReactElement, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { useDebounce } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */

import CardView from "@/components/common/card-view";
import { useGroupsQuery } from "@/hooks/groups/use-groups-query";
import { GroupsSearchModal4Mobile } from "./groups-search-modal-4-mobile";

export default function GroupsFilterComponent4Mobile(): ReactElement | null {
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
	const [showMemberSearch, setShowMemberSearch] = useState(false);

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	const goToCreateGroups = () => {
		router.push("/groups/create");
	};

	useEffect(() => {
		handleSearchChange(debouncedSearchQuery);
	}, [debouncedSearchQuery]);

	return (
		<div>
			<div className="fixed top-[70px] z-[100000000] flex w-full flex-col rounded-lg !backdrop-blur-xl">
				<div className="flex flex-col items-start gap-4 bg-[#000000]/60 p-2 sm:flex-row sm:justify-between">
					<CardView className=" w-fit rounded-lg !border !bg-[#7676801F]/20 !p-0 shadow-lg sm:ml-1 sm:max-w-sm ">
						<Tabs
							value={activeTab}
							onValueChange={handleTabChange}
							className="w-full"
						>
							<TabsList className="flex w-full items-center font-circular text-sm">
								<TabsTrigger
									value="public"
									className={`flex w-1/4 justify-center p-2 px-4 ${
										activeTab === "public"
											? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
											: "text-white/60"
									}`}
								>
									Public
								</TabsTrigger>
								<TabsTrigger
									value="private"
									className={`flex w-1/4 justify-center p-2 px-4 ${
										activeTab === "private"
											? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
											: "text-white/60"
									}`}
								>
									Private
								</TabsTrigger>
								<TabsTrigger
									value="created"
									className={`flex w-1/4 justify-center p-2 px-4 ${
										activeTab === "created"
											? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
											: "text-white/60"
									}`}
								>
									Created
								</TabsTrigger>
								<TabsTrigger
									value="joined"
									className={`flex w-1/4 justify-center p-2 px-4 ${
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
				</div>
			</div>
			<div className="fixed bottom-[10%] right-2 z-30 flex w-fit flex-col justify-end gap-4 md:hidden">
				<button
					className="flex h-16 w-16 items-center justify-center rounded-full bg-lemon-green text-sm text-black"
					onClick={() => goToCreateGroups()}
				>
					<Plus size={30} />
				</button>
				<button
					className="flex h-16 w-16 items-center justify-center rounded-full bg-lemon-green text-sm text-black"
					onClick={() => setShowMemberSearch(true)}
				>
					<Search size={30} />
				</button>
			</div>
			<GroupsSearchModal4Mobile
				searchQuery={searchQuery}
				minimumScore={minimumScore}
				maximumScore={maximumScore}
				setSearchQuery={setSearchQuery}
				handleMinimumScoreChange={handleMinimumScoreChange}
				handleMaximumScoreChange={handleMaximumScoreChange}
				setShowMemberSearch={setShowMemberSearch}
				showMemberSearch={showMemberSearch}
			/>
		</div>
	);
}
