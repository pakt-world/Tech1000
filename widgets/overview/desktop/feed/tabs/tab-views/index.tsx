"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React from "react";
import { useIsClient } from "usehooks-ts";
import { useSearchParams } from "next/navigation";
// import { motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import InviteListFeedView from "./invites";
import BookmaksistFeedView from "./bookmarks";
import TrendingFeedView from "./trending-user-post";
import TopFeedView from "./top-user-post";
import RecentFeedView from "./recent-user-post";
import { MotionDiv } from "@/components/navigations/motionRef";

export default function FeedListView() {
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab") ?? "";
	const isClient = useIsClient();

	return isClient ? (
		<>
			<div className="relative flex w-full flex-col gap-6">
				<div className="relative max-sm:h-full">
					<MotionDiv
						className="tabs-content w-full max-sm:h-full"
						initial={{
							x: "100%",
						}}
						animate={{
							x: 0,
						}}
						exit={{
							x: "-100%",
						}}
						transition={{
							duration: 0.1,
							ease: "easeInOut",
						}}
					>
						<div className="flex h-full flex-col gap-4 pb-[50px]">
							{tab === "invites" ? (
								<InviteListFeedView />
							) : tab === "bookmarks" ? (
								<BookmaksistFeedView />
							) : tab === "trending" ? (
								<TrendingFeedView />
							) : tab === "top" ? (
								<TopFeedView />
							) : tab === "recents" ? (
								<RecentFeedView />
							) : (
								<RecentFeedView />
							)}
						</div>
					</MotionDiv>
				</div>
			</div>
		</>
	) : (
		<></>
	);
}
