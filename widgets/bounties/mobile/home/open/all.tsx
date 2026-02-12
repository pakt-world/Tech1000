"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";
import { forwardRef } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { PageLoading } from "@/components/common/page-loading";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type CollectionProps } from "@/lib/types/collection";

import { OpenBountyCard4Mobile } from "./misc/open-card";

interface AllBountiesProps {
	bounties: CollectionProps[];
	onRefresh?: () => void;
	loading?: boolean;
	rates: ExchangeRateRecord | undefined;
	loggedInUser: string;
	isFetchingNextPage: boolean;
	tooManyReq: boolean;
}

export const AllBounties = forwardRef<HTMLDivElement, AllBountiesProps>(
	(props, ref): JSX.Element => {
		const {
			bounties,
			onRefresh,
			loading,
			rates,
			loggedInUser,
			isFetchingNextPage,
			tooManyReq,
		} = props;

		return (
			<div className="scrollbar-hide relative mt-[64px] h-full w-full overflow-auto pb-20">
				{loading ? (
					<PageLoading className="!h-full" color="#ffffff" />
				) : bounties.length > 0 ? (
					bounties.map((bounty: CollectionProps) => {
						return (
							<OpenBountyCard4Mobile
								key={bounty?._id}
								savedId={bounty?.bookmarkId}
								onRefresh={onRefresh}
								bounty={bounty}
								rates={rates}
								isSaved={bounty.isBookmarked}
								loggedInUser={loggedInUser}
							/>
						);
					})
				) : (
					<PageEmpty
						label="No open bounties yet."
						className="!h-full"
					/>
				)}
				{tooManyReq ? (
					<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
						<span className="inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-medium text-white shadow-md">
							Too Many Requests. Please try again later.
						</span>
					</div>
				) : isFetchingNextPage ? (
					<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
						<Loader
							size={25}
							className="animate-spin text-center text-white"
						/>
					</div>
				) : null}
				<div ref={ref} className="!h-4 !w-full" />
			</div>
		);
	}
);

AllBounties.displayName = "AllBounties";
