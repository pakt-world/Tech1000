/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseInfiniteQueryResult } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { isBountySlot, sortApplicantsHandler } from "@/lib/actions";
import { type GetBountyResponse } from "@/lib/api/bounty";
import { type ApiError } from "@/lib/axios";
import { SortApplicationsBy, type SortApplicationsScoresBy } from "@/lib/enums";
import { useApplicantTabCount } from "@/lib/store/misc";
import { type CollectionProps } from "@/lib/types/collection";

import { ApplicantCard } from "../misc/card";

interface AppliedApplicantProps {
	bountyApplications: UseInfiniteQueryResult<GetBountyResponse, ApiError>;
	scoreSort: SortApplicationsScoresBy;
	skillFilters: string[];
	sortBy: SortApplicationsBy;
	bounty: CollectionProps;
}

export const Applied = ({
	bountyApplications,
	scoreSort,
	skillFilters,
	sortBy,
	bounty,
}: AppliedApplicantProps): JSX.Element => {
	const [displayedApplicants, setDisplayedApplicants] = useState<
		CollectionProps[]
	>([]);
	const totalApplicantsRef = useRef<CollectionProps[]>([]);

	const { setCount } = useApplicantTabCount();

	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;
	const {
		data: applications,
		refetch: refetchApplications,
		failureReason,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = bountyApplications;

	const applicationData = useMemo(
		() => ({
			...applications,
			pages: applications?.pages?.map((page) => page.data) ?? [],
		}),
		[applications]
	);
	const { observerTarget, currentData } = useInfiniteScroll<CollectionProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: applicationData,
		refetch: refetchApplications,
		error: error?.response?.data.message ?? "",
	});

	const tooManyReq =
		failureReason?.response?.data.message ===
			"Too Many Requests. Please try again later." &&
		failureReason?.response.status === 429;

	useEffect(() => {
		// Invites
		const invitedSlots = bounty.collections.filter(isBountySlot);

		// Remove applicant that can be found in the invited spots
		const filterApplicant = currentData.filter((applicant) => {
			const applicantId = applicant.creator._id;
			const i = invitedSlots.filter(
				(slot) => slot.invite?.receiver?._id === applicantId
			);
			// If the applicant is found in the invited spots, remove it from the applicants
			return i.length === 0;
		});
		const filteredApplicants = filterApplicant
			.filter((applicant) => {
				if (skillFilters.length === 0) return true;
				return applicant.creator.profile.talent.tags
					.map((skill) => skill.toLowerCase())
					.some((skill) =>
						skillFilters.includes(skill.toLowerCase())
					);
			})
			.sort((a, b) => {
				const scoreSortResult = sortApplicantsHandler(
					a,
					b,
					(value) => value.creator.score,
					scoreSort
				);
				if (sortBy === SortApplicationsBy.SCORE) return scoreSortResult;
				return 0;
			});
		totalApplicantsRef.current = filteredApplicants;
		setDisplayedApplicants(filteredApplicants);
	}, [bounty, currentData, scoreSort, skillFilters, sortBy]);

	// Update Tab count
	useEffect(() => {
		setCount(displayedApplicants.length);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [displayedApplicants.length]);

	if (isError && !tooManyReq)
		return <PageError className="h-[60vh] rounded-2xl" />;

	return (
		<div className="flex h-full grow flex-col gap-4 overflow-y-auto">
			{displayedApplicants.length > 0 ? (
				<div className="flex flex-col gap-4 overflow-y-auto">
					{displayedApplicants.map((applicant) => (
						<ApplicantCard
							key={applicant.creator._id}
							talent={applicant.creator}
							message={applicant.description}
							bounty={bounty}
							// applicationId={applicant._id}
						/>
					))}
				</div>
			) : (
				<PageEmpty
					className="h-[60vh] rounded-2xl"
					label="No applicants yet"
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
