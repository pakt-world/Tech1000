"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode } from "react";

export const TabContentWrapper = ({
	children,
}: {
	children: ReactNode;
}): JSX.Element => {
	return (
		<div
			// ref={scrollableRef}
			className="scrollbar-hide mb-1 h-full w-full overflow-auto pb-20 sm:rounded-2xl sm:p-4 [&:last]:mb-0 [&>*]:mb-0 sm:[&>*]:mb-5"
		>
			{children}
		</div>
	);
};
