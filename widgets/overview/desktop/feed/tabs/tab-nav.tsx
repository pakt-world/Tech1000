import React, { ReactElement, useCallback, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Bookmark } from "lucide-react";
import CardView from "@/components/common/card-view";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useGetInviteCount } from "@/lib/api/group-feed";
import { useMediaQuery } from "usehooks-ts";
import { useCardVisibility } from "@/providers/card-visibility-provider";

type FeedType = "trending" | "recents" | "top" | "invites" | "bookmarks";

export default function FeedTab(): ReactElement | null {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const queryTab = (searchParams.get("tab") as FeedType) || "recents";
	const [activeTab, setActiveTab] = useState<FeedType>(queryTab);
	const { data } = useGetInviteCount({
		page: 1,
		limit: 10,
		type: "invites",
	});

	const isCardVisible = useCardVisibility(null);
	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);
			return params.toString();
		},
		[searchParams]
	);

	const hasScrolled = !isCardVisible;

	const handleTabChange = (value: FeedType) => {
		setActiveTab(value);
		router.push(`${pathname}?${createQueryString("tab", value)}`);
	};

	return (
		<div
			className={`fixed z-[10000] flex h-fit w-full flex-col gap-6 transition-all duration-300 md:sticky md:top-[0px] ${
				hasScrolled ? " top-[70px]" : " top-[146px]"
			}`}
		>
			<div className="flex flex-col items-start gap-4 bg-[#000000]/60 px-3 py-2 sm:flex-row sm:justify-between md:bg-transparent md:p-0">
				<CardView className=" w-full rounded-lg !border !bg-[#494745]/80 !p-0 shadow-lg sm:ml-1 sm:max-w-2xl ">
					<Tabs
						value={activeTab}
						onValueChange={handleTabChange}
						className="w-full"
					>
						<TabsList className="flex h-fit w-full items-center font-circular text-xs">
							<TabsTrigger
								value="recents"
								className={`flex h-full w-1/4 justify-center p-2 text-xs md:px-3 md:text-sm ${
									activeTab === "recents"
										? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
										: "text-white/60"
								}`}
							>
								Recent
							</TabsTrigger>
							<TabsTrigger
								value="trending"
								className={`flex w-1/4 justify-center p-2 text-xs md:px-3 md:text-sm ${
									activeTab === "trending"
										? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
										: "text-white/60"
								}`}
							>
								Trending
							</TabsTrigger>
							<TabsTrigger
								value="top"
								className={`flex w-1/5 justify-center p-2 text-xs md:w-1/4 md:px-3 md:text-sm ${
									activeTab === "top"
										? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
										: "text-white/60"
								}`}
							>
								Top
							</TabsTrigger>
							<TabsTrigger
								value="invites"
								className={`flex w-2/5 items-center justify-center gap-2 p-2 text-xs md:w-1/4 md:px-3 md:text-sm ${
									activeTab === "invites"
										? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
										: "text-white/60"
								}`}
							>
								Connections{" "}
								{data?.data && data?.data?.length > 0 && (
									<div className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-red-500 p-2 font-circular text-[10px] font-bold leading-none">
										{data?.data?.length}
									</div>
								)}
							</TabsTrigger>
							<TabsTrigger
								value="bookmarks"
								className={`flex justify-center p-2 text-xs md:w-1/4 md:px-3 md:text-sm ${
									activeTab === "bookmarks"
										? "rounded-lg border border-lemon-green bg-ink-darkest/40 text-white"
										: "text-white/60"
								}`}
							>
								{isDesktop ? (
									"Bookmarks"
								) : (
									<Bookmark size={15} />
								)}
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardView>
			</div>
		</div>
	);
}
