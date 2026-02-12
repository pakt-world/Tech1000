"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Search } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { useMobileContext } from "@/providers/mobile-context-provider";

export const MemberHeader = (): JSX.Element => {
	const { showMemberSearch, setShowMemberSearch } = useMobileContext();
	return (
		<div className="fixed top-[70px] z-40 inline-flex h-[63px] w-full items-center justify-between overflow-hidden bg-ink-darkest/40 from-white via-transparent to-white px-[21px] py-4 backdrop-blur-sm">
			<h3 className="text-2xl font-bold leading-[31.20px] tracking-wide text-neutral-50">
				Members
			</h3>
			<Button
				className="!m-0 flex items-center justify-center !p-0"
				onClick={() => {
					setShowMemberSearch(!showMemberSearch);
				}}
				variant="ghost"
			>
				<Search className="h-6 w-6 text-white" />
			</Button>
		</div>
	);
};
