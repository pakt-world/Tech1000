"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight } from "lucide-react";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";

import { Socials } from "./misc/socials";

export const Bio = ({
	body,
	profileLinks,
	tab,
}: {
	body: string;
	profileLinks:
		| {
				website?: string;
				x?: string;
				tiktok?: string;
				instagram?: string;
				github?: string;
		  }
		| undefined;
	tab: boolean;
}): JSX.Element => {
	const [showBio, setShowBio] = useState(false);

	const lines = body.split("\n");
	const bodyLines = lines.map((line, index) => (
		<p key={index} className="text-neutral-300">
			{line}
			{line === "" && <br />} {/* To handle empty lines */}
		</p>
	));
	return (
		<div className="flex w-full grow flex-col border-2 border-white/10 bg-ink-darkest/40 from-white via-transparent to-white p-4 backdrop-blur-sm max-sm:border-l-0 max-sm:border-r-0  sm:w-[60%] sm:gap-3 sm:rounded-2xl md:!border-[#9BDCFD]">
			<div className="flex w-full items-center justify-between">
				<Button
					className="!m-0 flex w-full items-center justify-between !p-0"
					onClick={() => {
						setShowBio(!showBio);
					}}
					variant="ghost"
				>
					<h3 className="text-left text-lg font-bold text-white sm:text-2xl sm:font-medium">
						Bio
					</h3>
					<ChevronRight
						className={`h-6 w-6 text-body transition-transform duration-300 sm:hidden ${showBio ? "rotate-90 transform" : ""}`}
					/>
				</Button>
				{tab && <Socials profileLinks={profileLinks} />}
			</div>
			<div
				className={`flex flex-wrap gap-2 overflow-hidden text-neutral-300 transition-all duration-300 max-sm:flex-col ${showBio ? "mt-4 h-fit" : "h-0"} sm:mt-0 sm:h-fit`}
			>
				{bodyLines}
				{!tab && (
					<Socials profileLinks={profileLinks} className="mt-4" />
				)}
			</div>
		</div>
	);
};
