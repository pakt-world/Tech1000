"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Skeleton } from "@/components/common/skeletons/skeleton";
import { useUserState } from "@/lib/store/account";

export const UserGreetings4Desktop = (): JSX.Element | null => {
	const { firstName } = useUserState();

	return (
		<div className="!z-30 flex w-full items-center justify-start">
			{!firstName ? (
				<Skeleton className="h-10 w-[183px]" />
			) : (
				<div className="text-3xl font-bold text-white">
					Hello {firstName}!
				</div>
			)}
		</div>
	);
};
