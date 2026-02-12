"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { useGetBookmarks } from "@/lib/api/bookmark";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import type { Bookmark } from "@/lib/types";

import { OpenBountyCard } from "./misc/open-card";

interface SavedBountiesProps {
	rates: ExchangeRateRecord | undefined;
	loggedInUser: string;
}

export const SavedBounties = ({
	rates,
	loggedInUser,
}: SavedBountiesProps): ReactElement | null => {
	const bookmarkData = useGetBookmarks({
		page: 1,
		limit: 5,
		filter: { type: "collection" },
	});
	const bounties = bookmarkData.data?.data ?? [];

	if (bookmarkData.isError) return <PageError />;
	if (bookmarkData.isLoading) return <PageLoading color="#ffffff" />;
	if (!bounties.length)
		return (
			<PageEmpty
				label="Your saved bounties will appear here."
				className="h-[70vh] rounded-lg py-6"
			/>
		);

	return (
		<div className="grid h-full grid-cols-2 grid-rows-3 gap-4 pb-20">
			{bounties.map((bounty: Bookmark) => {
				return (
					<OpenBountyCard
						key={bounty?._id}
						onRefresh={async (): Promise<void> => {
							await bookmarkData.refetch();
						}}
						bounty={bounty.data}
						savedId={bounty?._id}
						rates={rates}
						isSaved
						loggedInUser={loggedInUser}
					/>
				);
			})}
		</div>
	);
};
