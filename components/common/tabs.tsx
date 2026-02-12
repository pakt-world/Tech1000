"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { type ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn, createQueryString } from "@/lib/utils";

interface Tab {
	label: JSX.Element | string;
	value: string;
	content: React.ReactNode;
}

interface Props {
	tabs: Tab[];
	urlKey?: string;
	defaultTab?: string;
	className?: string;
	tabListClassName?: string;
	tabTriggerClassName?: string;
	tabContentContainerClassName?: string;
	tabContentMotionWrapperClassName?: string;
	tabContentMotionDivClassName?: string;
	customExtraComponent?: ReactNode;
	customExtraItem?: ReactNode;
	updateTab?: (arg?: any) => void;
}

export const Tabs = ({
	tabs,
	defaultTab,
	urlKey,
	className,
	tabListClassName,
	tabTriggerClassName,
	customExtraComponent,
	customExtraItem,
	tabContentContainerClassName,
	tabContentMotionWrapperClassName,
	tabContentMotionDivClassName,
	updateTab,
}: Props): JSX.Element => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const urlTab = searchParams.get(urlKey ?? "tab") || "";
	const initialTab = urlTab || defaultTab || tabs[0]?.value || "";
	const [activeTab, setActiveTab] = useState<string>(initialTab);
	const [swipeDirection, setSwipeDirection] = useState<
		"left" | "right" | null
	>(null);

	const handleTabChange = (value: string): void => {
		const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
		const newIndex = tabs.findIndex((tab) => tab.value === value);

		if (newIndex > currentIndex) {
			setSwipeDirection("right");
		} else {
			setSwipeDirection("left");
		}

		setActiveTab(value);
		router.push(`${pathname}?${createQueryString(urlKey ?? "tab", value)}`);
	};

	const handleTabTrigger = (value: string) => {
		router.push(`${pathname}?${createQueryString(urlKey ?? "tab", value)}`);
	};

	useEffect(() => {
		if (urlTab) {
			setActiveTab(urlTab);
			updateTab ? updateTab(urlTab) : null;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [urlTab]);

	return (
		<RadixTabs.Root
			value={activeTab}
			onValueChange={handleTabChange}
			className={cn(
				"relative flex size-full flex-col items-start justify-start",
				className
			)}
		>
			<RadixTabs.List
				className={`flex w-full items-center border-b px-2 max-sm:h-[64px] max-sm:justify-between  ${tabListClassName}`}
			>
				{tabs.map((tab) => (
					<RadixTabs.Trigger
						key={tab.value}
						value={tab.value}
						onClick={() => handleTabTrigger(tab.value)}
						className={`border-b-2 border-transparent py-5 text-center text-sm font-medium text-white transition-all duration-200 hover:text-gray-400 data-[state=active]:border-lemon-green sm:min-w-[100px] sm:px-8 sm:py-2 ${tabTriggerClassName}`}
					>
						{tab.label}
					</RadixTabs.Trigger>
				))}
				{customExtraItem}
			</RadixTabs.List>
			{customExtraComponent}
			<div
				className={`relative h-full w-full overflow-hidden sm:mt-4 ${tabContentContainerClassName}`}
			>
				{tabs.map((tab) => (
					<RadixTabs.Content
						key={tab.value}
						value={tab.value}
						className={`size-full justify-start ${tabContentMotionWrapperClassName}`}
					>
						<motion.div
							key={activeTab}
							initial={{
								opacity: 0,
								x: swipeDirection === "right" ? 100 : -100,
							}}
							animate={{ opacity: 1, x: 0 }}
							exit={{
								opacity: 0,
								x: swipeDirection === "right" ? -100 : 100,
							}}
							transition={{ duration: 0.1 }}
							className={`h-full ${tabContentMotionDivClassName}`} //check---
						>
							{tab.content}
						</motion.div>
					</RadixTabs.Content>
				))}
			</div>
		</RadixTabs.Root>
	);
};
