"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Search } from "lucide-react";

export const ChatListSearch = ({
	searchChat,
	searchHandler,
}: {
	searchChat: string;
	searchHandler: (value: string) => void;
}): JSX.Element => {
	return (
		<div className="border-gradient-to-r f relative mx-auto flex w-full flex-col items-center gap-4 bg-transparent to-white p-4 py-4 backdrop-blur-sm max-sm:fixed max-sm:left-0 max-sm:top-[0px] max-sm:z-30 md:h-[74px]">
			<h4 className="w-full text-left text-xl font-bold text-white md:hidden">
				Messaging
			</h4>
			<div className="relative w-full">
				<div className="absolute left-2 top-3">
					<Search size={18} className="text-body" />
				</div>
				<input
					type="text"
					className="input-style w-full resize-none rounded-lg border px-2 py-2 pl-8 text-white focus:outline-none"
					placeholder="Search Chat"
					value={searchChat}
					onChange={(e) => {
						searchHandler(e.target.value);
					}}
				/>
			</div>
		</div>
	);
};
