"use client";

import React from "react";

import FeedTab from "./tabs/tab-nav";
import FeedListView from "./tabs/tab-views";

const FeedView4Desktop: React.FC = () => (
	<div className="flex w-full flex-col gap-4 max-sm:h-full">
		<FeedTab />
		<div className="pb-[65px] pt-[50px] max-sm:overflow-scroll md:pb-0 md:pt-0">
			<FeedListView />
		</div>
	</div>
);

export default FeedView4Desktop;
