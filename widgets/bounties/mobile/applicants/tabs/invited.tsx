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
import { type MemberProps } from "@/lib/types/member";

import { ApplicantCard } from "../misc/card";

interface InvitedApplicantProps {
	bountyInvites: UseInfiniteQueryResult<GetBountyResponse, ApiError>;
	bountyAcceptedInvites: UseInfiniteQueryResult<GetBountyResponse, ApiError>;
	bounty: CollectionProps;
}

export const Invited = ({
	bountyInvites,
	bountyAcceptedInvites,
	bounty,
}: InvitedApplicantProps): JSX.Element => {
	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;
	const {
		data: invites,
		refetch: refetchInvites,
		failureReason,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = bountyInvites;

	const invitesData = useMemo(
		() => ({
			...invites,
			pages: invites?.pages?.map((page) => page.data) ?? [],
		}),
		[invites]
	);
	const { observerTarget, currentData } = useInfiniteScroll<CollectionProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: invitesData,
		refetch: refetchInvites,
		error: error?.response?.data.message as string,
	});

	// ===== Filter Invites ===== //

	// Remove Data that `invite` happens to be null - A theory that a user's account was deleted or maybe application rejected
	const filteredData = currentData.filter(
		(data) => data.invite !== null && data.invite !== undefined
	);
	// Remove duplicates
	const uniqueIds = Array.from(
		new Set(filteredData.map((a) => a.invite?.receiver?._id))
	);
	const uniqueData = uniqueIds.map((id) =>
		filteredData.find((a) => a.invite?.receiver?._id === id)
	);
	// Remove any data that can be found in acceptedInvites
	const acceptedIds = Array.from(
		new Set(
			bountyAcceptedInvites.data?.pages[0]?.data.map(
				(data) => data.invite?.receiver?._id
			) ?? []
		)
	);
	const invitedApplicantsData = uniqueData.filter(
		(data) => !acceptedIds.includes(data?.invite?.receiver?._id)
	);

	// ===== Filter Invites ===== //
	const bountyApplicantCollections =
		bounty.collections.filter(isBountyApplicant);

	const tooManyReq =
		failureReason?.response?.data.message ===
			"Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	if (isError && !tooManyReq) return <PageError className="h-[60vh]" />;

	return (
		<div className="flex h-full grow flex-col overflow-y-auto pb-20">
			{invitedApplicantsData.length > 0 ? (
				<div className="flex flex-col overflow-y-auto ">
					{invitedApplicantsData.map((applicant) => {
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
								key={applicant?.invite?.receiver?._id}
								talent={
									applicant?.invite?.receiver as MemberProps
								}
								message={m}
								bounty={bounty}
								disableAcceptButton
							/>
						);
					})}
				</div>
			) : (
				<PageEmpty className="h-[60vh]" label="No Invited Applicants" />
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
