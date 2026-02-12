/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseInfiniteQueryResult } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { isBountyApplicant } from "@/lib/actions";
import { type GetBountyResponse } from "@/lib/api/bounty";
import { type ApiError } from "@/lib/axios";
import { type CollectionProps } from "@/lib/types/collection";

import { ApplicantCard } from "../misc/card";

interface AcceptedApplicantProps {
	bountyAcceptedInvites: UseInfiniteQueryResult<GetBountyResponse, ApiError>;
	bounty: CollectionProps;
}

export const Accepted = ({
	bounty,
	bountyAcceptedInvites,
}: AcceptedApplicantProps): JSX.Element => {
	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;
	const {
		data: acceptedInvites,
		refetch: refetchInvites,
		failureReason,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = bountyAcceptedInvites;

	const acceptedInvitesData = useMemo(
		() => ({
			...acceptedInvites,
			pages: acceptedInvites?.pages?.map((page) => page.data) ?? [],
		}),
		[acceptedInvites]
	);
	const { observerTarget, currentData } = useInfiniteScroll<CollectionProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: acceptedInvitesData,
		refetch: refetchInvites,
		error: error?.response?.data.message ?? "",
	});
	const bountyApplicantCollections =
		bounty.collections.filter(isBountyApplicant);

	const tooManyReq =
		failureReason?.response?.data.message ===
			"Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	if (!tooManyReq && isError)
		return <PageError className="h-[60vh] rounded-2xl" />;

	return (
		<div className="flex h-full grow flex-col gap-4 overflow-y-auto">
			{currentData.length > 0 ? (
				<div className="flex flex-col gap-4 overflow-y-auto ">
					{currentData.map((applicant) => {
						// Check if this applicant has an application collection
						const app = bountyApplicantCollections.find(
							(a) =>
								a.creator?._id ===
								applicant?.invite?.receiver?._id
						);
						// Get the message from the application collection
						const m = app?.description ?? "";

						return (
							<ApplicantCard
								key={applicant.invite?.receiver?._id}
								talent={applicant.invite?.receiver}
								message={m}
								bounty={bounty}
								disableAcceptButton
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty
					className="h-[60vh] rounded-2xl"
					label="No accepted applicants yet"
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
			<div ref={observerTarget} className="!h-4 !w-full" />
		</div>
	);
};
