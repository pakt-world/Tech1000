"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Skeleton } from "@/components/common/skeletons/skeleton";
import { UserBalance } from "@/components/common/user-balance";
import { useUserState } from "@/lib/store/account";

export const OverviewHeader = (): JSX.Element | null => {
	const { firstName } = useUserState();

	return (
		<div className="!z-30 flex w-full items-center justify-between">
			{!firstName ? (
				<Skeleton className="h-10 w-[183px]" />
			) : (
				<div className="text-3xl font-bold text-white">
					Hello {firstName}!
				</div>
			)}
			<div className="flex items-center gap-7">
				{!firstName ? (
					<Skeleton className="h-10 w-[201px]" />
				) : (
					<div className="flex items-center gap-2 text-3xl text-white">
						<UserBalance />
						<span>|</span>{" "}
						<span className="text-white">Balance</span>
					</div>
				)}
			</div>
		</div>
	);
};
