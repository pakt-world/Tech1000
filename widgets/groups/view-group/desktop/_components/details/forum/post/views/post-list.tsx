"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { FilePlus2 } from "lucide-react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
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
import { Button } from "@/components/common/button";
import CreatePostModal from "../misc/create-post-modal";

interface PostListViewType {
	group: Group;
}
type TabType = "trending" | "recent" | "top";

export default function PostListView({
	group,
}: PostListViewType): ReactElement | null {
	// const router = useRouter();
	const [activeTab, setActiveTab] = useState<TabType>("recent");
	const [previousTab, setPreviousTab] = useState<TabType>("recent");
	const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

	const groupId = group._id;
	const limit = 10;

	const nabArray = ["user", "invited", "applied"];
	const notAMember = group ? nabArray.includes(group.type) : false;

	const handleTabChange = (e: string) => {
		const newTab = e as TabType;
		setPreviousTab(activeTab);
		setActiveTab(newTab);
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

	const { observerTarget } = useInfiniteScroll({
		fetchNextPage:
			activeTab === "top"
				? fetchNextTopPage
				: activeTab === "recent"
					? fetchNextRecentPage
					: fetchNextTrendingPage,
		hasNextPage:
			activeTab === "top"
				? hasNextTopPage
				: activeTab === "recent"
					? hasNextRecentPage
					: hasNextTrendingPage,
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

	if (topPostsLoading || recentPostsLoading || trendingPostsLoading) {
		return <PageLoading className="h-[60vh] rounded-2xl" color="#ffffff" />;
	}

	if (topPostsError || recentPostsError || trendingPostsError) {
		return <PageError className="max-h-[60vh] rounded-2xl" />;
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
			<div className="relative flex  w-full flex-col gap-6">
				<div className="sticky -top-[10px] z-[100000] flex w-full items-center justify-between pt-4">
					<CardView className="h-fit w-full rounded-xl !border !bg-[#5A4642]/90 !p-0 shadow-lg sm:ml-1 sm:max-w-xs">
						<Tabs
							value={activeTab}
							onValueChange={handleTabChange}
							className="w-full"
						>
							<TabsList className="flex w-full items-center  text-sm ">
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
					{!notAMember && (
						<Button
							className=" flex gap-3 rounded-3xl border-none py-2 font-bold"
							type="button"
							variant={"default"}
							size="sm"
							onClick={() => setOpenCreateModal(true)}
						>
							<FilePlus2 size={22} />
							Create Post
						</Button>
					)}
				</div>

				<div className="relative h-full overflow-scroll">
					<motion.div
						key={activeTab}
						className="tabs-content h-full w-full"
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
					>
						<div className="flex h-fit flex-col">
							{pages?.flat().length > 0 ? (
								pages?.flat()?.map((post: GroupPost, index) => (
									<motion.div
										key={post?.postId}
										className="post-card flex  gap-4"
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
												pages?.flat().length ===
												index + 1
											}
										/>
									</motion.div>
								))
							) : (
								<PageEmpty
									label="No post available."
									className="max-h-[50vh] rounded-2xl !border-[#9BDCFD]"
								/>
							)}
						</div>
					</motion.div>
				</div>
				<>
					{isFetchingNextPage && (
						<div className="mx-auto flex w-full flex-row items-center justify-center text-center">
							<Spinner
								size={15}
								className="animate-spin text-center text-white"
							/>
						</div>
					)}

					<div ref={observerTarget} className="!h-2 !w-full" />
				</>
			</div>
			<CreatePostModal
				open={openCreateModal}
				setOpen={() => setOpenCreateModal(!openCreateModal)}
				group={group}
			/>
		</>
	);
}
