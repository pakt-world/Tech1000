"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseInfiniteQueryResult } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/common/button";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Tabs } from "@/components/common/tabs";
import { type GetBountyResponse } from "@/lib/api/bounty";
import { type ApiError } from "@/lib/axios";
import { SortApplicationsBy, SortApplicationsScoresBy } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";
import { MobileApplicantFilter } from "@/widgets/bounties/mobile/applicants/misc/filter";
import { ApplicantHeader } from "@/widgets/bounties/mobile/applicants/misc/header";
import { Accepted } from "@/widgets/bounties/mobile/applicants/tabs/accepted";
import { Applied } from "@/widgets/bounties/mobile/applicants/tabs/applied";
import { Invited } from "@/widgets/bounties/mobile/applicants/tabs/invited";

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

export default function BountyApplications4Mobile({
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
	const [openFilter, setOpenFilter] = useState<boolean>(false);

	return (
		<div className="flex h-full flex-col">
			<MobileBreadcrumb
				items={[
					{
						label: "Bounties",
						link: "/bounties",
					},
					{ label: "View Applicants", active: true },
				]}
			/>
			<ApplicantHeader bounty={bounty} realTimeRate={realTimeRate} />
			<div className="primary_border-y inline-flex h-[76px] w-full items-center justify-between bg-primary px-[21px] py-4">
				<div className="inline-flex flex-col items-start justify-center gap-0.5">
					<div className="text-base font-bold leading-normal tracking-wide text-white">
						All Applicants
					</div>
					<span className="text-xs leading-[18px] tracking-wide text-white">
						Click on an applicant to view Profile
					</span>
				</div>
				<Button
					className="flex w-[94px] items-center justify-center gap-2 rounded-[10px] px-4 py-2 text-white"
					onClick={() => {
						setOpenFilter(true);
					}}
					variant="outline"
				>
					<span className="text-center text-sm font-bold leading-normal tracking-wide">
						Filter
					</span>
					<SlidersHorizontal className="" />
				</Button>
			</div>
			<div className="flex w-full grow flex-col overflow-hidden">
				<MobileApplicantFilter
					setSkillFilters={setSkillFilters}
					setSortBy={setSortBy}
					setScoreSort={setScoreSort}
					skillFilters={skillFilters}
					scoreSort={scoreSort}
					bounty={bounty}
					openFilter={openFilter}
					setOpenFilter={setOpenFilter}
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
						tabListClassName="max-sm:!top-0 !relative"
						tabContentContainerClassName="!mt-0"
					/>
				</div>
			</div>
		</div>
	);
}
