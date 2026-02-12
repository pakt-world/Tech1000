"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseInfiniteQueryResult } from "@tanstack/react-query";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Tabs } from "@/components/common/tabs";
import { type GetBountyResponse } from "@/lib/api/bounty";
import { type ApiError } from "@/lib/axios";
import { SortApplicationsBy, SortApplicationsScoresBy } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";
import { ApplicantFilter } from "@/widgets/bounties/desktop/applicants/misc/filter";
import { ApplicantHeader } from "@/widgets/bounties/desktop/applicants/misc/header";
import { Accepted } from "@/widgets/bounties/desktop/applicants/tabs/accepted";
import { Applied } from "@/widgets/bounties/desktop/applicants/tabs/applied";
import { Invited } from "@/widgets/bounties/desktop/applicants/tabs/invited";

interface Props {
	bounty: CollectionProps;
	bountyApplications: UseInfiniteQueryResult<GetBountyResponse, ApiError>;
	bountyInvites: UseInfiniteQueryResult<GetBountyResponse, ApiError>;
	bountyAcceptedInvites: UseInfiniteQueryResult<GetBountyResponse, ApiError>;
	count: number;
	invitesCount: number;
	acceptedInvitesCount: number;
	realTimeRate: number;
}

export default function BountyApplications4Desktop({
	bounty,
	bountyApplications,
	bountyInvites,
	bountyAcceptedInvites,
	count,
	invitesCount,
	acceptedInvitesCount,
	realTimeRate,
}: Props): JSX.Element {
	// State
	const [skillFilters, setSkillFilters] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<SortApplicationsBy>(
		SortApplicationsBy.SCORE
	);
	const [scoreSort, setScoreSort] = useState<SortApplicationsScoresBy>(
		SortApplicationsScoresBy.HIGHEST_TO_LOWEST
	);

	return (
		<div className="flex h-full flex-col gap-6">
			<ApplicantHeader bounty={bounty} realTimeRate={realTimeRate} />

			<div className="flex w-full  grow gap-6 overflow-hidden">
				<ApplicantFilter
					setSkillFilters={setSkillFilters}
					setSortBy={setSortBy}
					setScoreSort={setScoreSort}
					skillFilters={skillFilters}
					scoreSort={scoreSort}
					bounty={bounty}
				/>
				<div className="flex flex-1 basis-0 overflow-y-auto">
					<Tabs
						tabs={[
							{
								label: (
									<span className="flex items-center gap-1">{`Applied (${count >= 10 ? "10+" : count})`}</span>
								),
								value: "applied",
								content: (
									<Applied
										bountyApplications={bountyApplications}
										skillFilters={skillFilters}
										scoreSort={scoreSort}
										sortBy={sortBy}
										bounty={bounty}
									/>
								),
							},
							{
								label: (
									<span className="flex items-center gap-1">{`Invited (${invitesCount >= 10 ? "10+" : invitesCount})`}</span>
								),
								value: "invited",
								content: (
									<Invited
										bountyInvites={bountyInvites}
										bountyAcceptedInvites={
											bountyAcceptedInvites
										}
										bounty={bounty}
									/>
								),
							},
							{
								label: (
									<span className="flex items-center gap-1">{`Accepted (${acceptedInvitesCount >= 10 ? "10+" : acceptedInvitesCount})`}</span>
								),
								value: "accepted",
								content: (
									<Accepted
										bounty={bounty}
										bountyAcceptedInvites={
											bountyAcceptedInvites
										}
									/>
								),
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}
