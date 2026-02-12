"use client";
import React, {
	ReactElement,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	useGetTopPostsInfinitely,
	useGetRecentPostsInfinitely,
	useGetTrendingPostsInfinitely,
} from "@/lib/api/group";
import CardView from "@/components/common/card-view";
import PostCardComponent from "../_components/post-card";
import { Group, GroupPost } from "@/lib/types/groups";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";
import { PageEmpty } from "@/components/common/page-empty";
import { Spinner } from "@/components/common/loader";
import Image from "next/image";

interface PostListViewType {
	group: Group;
}
type TabType = "trending" | "recent" | "top";

export default function PostListView({
	group,
}: PostListViewType): ReactElement | null {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<TabType>("recent");
	const [previousTab, setPreviousTab] = useState<TabType>("recent");

	const scrollRef = useRef<HTMLDivElement | null>(null);
	const parentRef = useRef<HTMLDivElement | null>(null);

	const groupId = group._id;
	const limit = 10;

	const nabArray = ["user", "invited", "applied"];
	const notAMember = group ? nabArray.includes(group.type) : false;

	const handleTabChange = (e: string) => {
		const newTab = e as TabType;
		setPreviousTab(activeTab);
		setActiveTab(newTab);
		if (scrollRef.current) {
			scrollRef.current.scrollTo({ top: -400, behavior: "smooth" });
		}
	};

	const goToCreatePost = () => {
		router.push(`/groups/${groupId}/create-post`);
	};

	const {
		data: topPostsData,
		isLoading: topPostsLoading,
		error: topPostsError,
		fetchNextPage: fetchNextTopPage,
		hasNextPage: hasNextTopPage,
		isFetchingNextPage: isFetchingNextTopPage,
		refetch: topRefetch,
	} = useGetTopPostsInfinitely({ groupId, limit });

	const {
		data: recentPostsData,
		isLoading: recentPostsLoading,
		error: recentPostsError,
		fetchNextPage: fetchNextRecentPage,
		hasNextPage: hasNextRecentPage,
		isFetchingNextPage: isFetchingNextRecentPage,
		refetch: recentRefetch,
	} = useGetRecentPostsInfinitely({ groupId, limit });

	const {
		data: trendingPostsData,
		isLoading: trendingPostsLoading,
		error: trendingPostsError,
		fetchNextPage: fetchNextTrendingPage,
		hasNextPage: hasNextTrendingPage,
		isFetchingNextPage: isFetchingNextTrendingPage,
		refetch: trendingRefetch,
	} = useGetTrendingPostsInfinitely({ groupId, limit });

	const selectedPostsData = useMemo(() => {
		switch (activeTab) {
			case "top":
				return {
					...topPostsData,
					pages: topPostsData?.pages?.map((page) => page?.data) ?? [],
				};
			case "recent":
				return {
					...recentPostsData,
					pages:
						recentPostsData?.pages?.map((page) => page?.data) ?? [],
				};
			case "trending":
			default:
				return {
					...trendingPostsData,
					pages:
						trendingPostsData?.pages?.map((page) => page?.data) ??
						[],
				};
		}
	}, [activeTab, topPostsData, recentPostsData, trendingPostsData]);

	const pages = selectedPostsData?.pages ?? [];
	const hasPages = pages?.length > 0;
	let currentPage = hasPages ? pages?.length : 1;
	let prevPage = currentPage - 1;

	const isFetchingNextPage =
		activeTab === "top"
			? isFetchingNextTopPage
			: activeTab === "recent"
				? isFetchingNextRecentPage
				: isFetchingNextTrendingPage;

	const fetchNextPage =
		activeTab === "top"
			? fetchNextTopPage
			: activeTab === "recent"
				? fetchNextRecentPage
				: fetchNextTrendingPage;

	const hasNextPage =
		activeTab === "top"
			? hasNextTopPage
			: activeTab === "recent"
				? hasNextRecentPage
				: hasNextTrendingPage;

	//@ts-ignore
	const { observerTarget } = useInfiniteScroll({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading:
			activeTab === "top"
				? topPostsLoading
				: activeTab === "recent"
					? recentPostsLoading
					: trendingPostsLoading,
		currentPage,
		prevPage,
		refetch:
			activeTab === "top"
				? topRefetch
				: activeTab === "recent"
					? recentRefetch
					: trendingRefetch,
		error:
			activeTab === "top"
				? topPostsError?.message || ""
				: activeTab === "recent"
					? recentPostsError?.message || ""
					: trendingPostsError?.message || "",
		data: selectedPostsData,
	});

	useLayoutEffect(() => {
		if (scrollRef.current) {
			scrollRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
			parentRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [activeTab]);

	if (topPostsLoading || recentPostsLoading || trendingPostsLoading) {
		return (
			<PageLoading
				className="h-full] w-full justify-center rounded-2xl"
				color="#ffffff"
			/>
		);
	}

	if (topPostsError || recentPostsError || trendingPostsError) {
		return <PageError className="max-h-[60vh] w-full rounded-2xl" />;
	}

	const swipeDirection = (() => {
		switch (true) {
			case activeTab === "recent" && previousTab === "trending":
			case activeTab === "trending" && previousTab === "top":
				return "left";
			case activeTab === "top" && previousTab === "trending":
			case activeTab === "trending" && previousTab === "recent":
				return "right";
			default:
				return "left";
		}
	})();

	return (
		<>
			<div className="relative flex w-full flex-col max-sm:h-full md:gap-6">
				<div className="fixed top-[126px] z-[100000] flex w-full items-center justify-between border-y border-white/30 bg-[#000000]/60 px-3 py-2 ">
					<CardView className="h-fit w-full rounded-xl !border !bg-[#ffffff]/10 !p-0 shadow-lg max-sm:h-full sm:ml-1 sm:max-w-xs">
						<Tabs
							value={activeTab}
							onValueChange={handleTabChange}
							className="w-full"
						>
							<TabsList className="flex w-full items-center  font-circular text-sm ">
								<TabsTrigger
									value="recent"
									className={`tab-trigger flex w-1/3 justify-center p-2 ${
										activeTab === "recent"
											? "rounded-lg border border-lemon-green bg-[#00000080]/30 text-white"
											: "text-white/60"
									}`}
								>
									Recent
								</TabsTrigger>
								<TabsTrigger
									value="trending"
									className={`tab-trigger flex w-1/3 justify-center p-2 ${
										activeTab === "trending"
											? "rounded-lg border border-lemon-green bg-[#00000080]/30 text-white"
											: "text-white/60"
									}`}
								>
									Trending
								</TabsTrigger>
								<TabsTrigger
									value="top"
									className={`tab-trigger flex w-1/3 justify-center p-2 ${
										activeTab === "top"
											? "rounded-lg border border-lemon-green bg-[#00000080]/30 text-white"
											: "text-white/60"
									}`}
								>
									Top
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</CardView>
				</div>

				<motion.div
					key={activeTab}
					className="tabs-content relative mb-20 w-full flex-1 pt-28 max-sm:h-full"
					initial={{
						x: swipeDirection === "right" ? "100%" : "-100%",
					}}
					animate={{
						x: 0,
					}}
					exit={{
						x: swipeDirection === "right" ? "-100%" : "100%",
					}}
					transition={{
						duration: 0.1,
						ease: "easeInOut",
					}}
					ref={parentRef}
				>
					<div
						ref={scrollRef}
						className="relative  max-sm:pb-[200px] md:h-[100vh] "
					>
						{pages?.flat().length > 0 ? (
							pages?.flat()?.map((post: GroupPost, index) => (
								<motion.div
									key={post?.postId}
									className="post-card flex  md:gap-4"
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									transition={{
										duration: 0.1,
										ease: "easeInOut",
									}}
									viewport={{ once: true, amount: 0.1 }}
								>
									<PostCardComponent
										groupId={groupId}
										post={post}
										type={"preview"}
										group={group}
										lastItem={
											pages?.flat().length === index + 1
										}
									/>
								</motion.div>
							))
						) : (
							<PageEmpty
								label="No post available."
								className="!h-[74vh] rounded-none"
							/>
						)}
					</div>
					<div className=" left-0 right-0 mt-1 flex w-full flex-col items-center justify-center">
						{isFetchingNextPage && (
							<div className="mx-auto flex w-full flex-row items-center justify-center text-center">
								<Spinner
									size={20}
									className="animate-spin text-center text-white"
								/>
							</div>
						)}
						{!isFetchingNextPage && hasNextPage && (
							<Image
								src={"/icons/comment-arrow-icon.svg"}
								alt="comment-arrow-icon"
								width={24}
								height={20}
								className="bottom-10 mt-4 items-center justify-center"
								onClick={() => fetchNextPage()}
							/>
						)}
						{!hasNextPage &&
							!isFetchingNextPage &&
							pages?.flat().length > 0 && (
								<Image
									src={"/icons/no-comment-tech-logo.svg"}
									alt="no-comment-arrow-icon"
									width={24}
									height={20}
									className=" bottom-10 mt-4 items-center justify-center"
								/>
							)}
					</div>
				</motion.div>

				{!notAMember && (
					<div className="fixed bottom-[10%] right-2 z-30 flex w-fit flex-col justify-end gap-4 md:hidden">
						<button
							className="flex h-16 w-16 items-center justify-center rounded-full bg-lemon-green text-sm text-black"
							onClick={goToCreatePost}
						>
							<PenLine size={30} />
						</button>
					</div>
				)}
			</div>
		</>
	);
}
