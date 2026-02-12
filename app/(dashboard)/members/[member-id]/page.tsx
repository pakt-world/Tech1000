"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useParams } from "next/navigation";
import { type ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";

import { Achievements } from "@/widgets/members/profile/achievements";
import { Bio } from "@/widgets/members/profile/bio";
import { ProfileHeader } from "@/widgets/members/profile/header/desktop";
import { MobileProfileHeader } from "@/widgets/members/profile/header/mobile";
import { UserGroups } from "@/widgets/members/profile/groups";
import ProfileSkills from "@/widgets/members/profile/skills";

import {
	useGetAchievements,
	useGetTalentById,
	// useGetTalentReviewById,
} from "@/lib/api/talent";
import {
	// CollectionCategory,
	Roles,
} from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { determineRole, getRandomReadableBgColor } from "@/lib/utils";
import { GroupAchievemtProps } from "@/lib/types/member";

export default function TalentDetailsPage(): ReactElement {
	const params = useParams();
	const talentId = String(params["member-id"]);
	const tab = useMediaQuery("(min-width: 640px)");
	const user = useUserState();

	const talentData = useGetTalentById(talentId, true);
	const { data: achievementsData } = useGetAchievements(talentId);

	if (
		talentData.isLoading ||
		(!talentData.isFetched && talentData.isFetching)
	)
		return <PageLoading color="#ffffff" />;

	if (talentData.isError) return <PageError />;

	const { talent } = talentData.data;

	// const reviews = reviewData.data ?? [];
	const isPartner = determineRole(talent) === Roles.PARTNER;
	const userIsPartner = determineRole(user) === Roles.PARTNER;

	const isOwnProfile = talent?._id === user?._id;

	return (
		<div className="scrollbar-hide flex h-full w-full grow flex-col sm:overflow-y-auto">
			<MobileBreadcrumb
				items={[
					{
						label: "Members",
						link: "/members",
					},
					{ label: "Member Details", active: true },
				]}
				className="!fixed top-[70px] !z-50"
			/>
			<div className="relative flex flex-col items-start overflow-y-auto max-sm:mt-[43px] sm:h-full sm:gap-4 sm:pb-4 2xl:gap-6">
				{tab ? (
					<ProfileHeader
						_id={talent._id}
						name={
							isPartner
								? (talent.firstName ?? "")
								: `${talent.firstName} ${talent.lastName}`
						}
						position={talent.profile?.bio?.title ?? ""}
						score={parseInt(talent?.nftTokenNumber || "0") || 0}
						skills={
							talent?.profile?.talent?.tagsIds?.map((t) => ({
								name: t.name,
								backgroundColor:
									t.color ?? getRandomReadableBgColor(),
							})) ?? []
						}
						profileImage={talent.profileImage?.url}
						isPartner={isPartner}
						userIsPartner={userIsPartner}
						isOwnProfile={isOwnProfile}
						nftDetails={{
							nftImageUrl: talent?.nftImageUrl || "",
							nftTokenNumber: talent?.nftTokenNumber || "",
						}}
					/>
				) : (
					<MobileProfileHeader
						_id={talent._id}
						name={
							isPartner
								? (talent.firstName ?? "")
								: `${talent.firstName} ${talent.lastName}`
						}
						position={talent.profile?.bio?.title ?? ""}
						score={parseInt(talent?.nftTokenNumber || "0") || 0}
						skills={
							talent?.profile?.talent?.tagsIds?.map((t) => ({
								name: t.name,
								backgroundColor:
									t.color ?? getRandomReadableBgColor(),
							})) ?? []
						}
						profileImage={talent.profileImage?.url}
						isPartner={isPartner}
						userIsPartner={userIsPartner}
						isOwnProfile={isOwnProfile}
						nftDetails={{
							nftImageUrl: talent?.nftImageUrl || "",
							nftTokenNumber: talent?.nftTokenNumber || "",
						}}
					/>
				)}
				<div className="flex w-full max-sm:flex-col sm:gap-6">
					<Bio
						body={talent.profile?.bio?.description ?? ""}
						profileLinks={talent.meta?.profileLinks}
						tab={tab}
					/>
					<Achievements
						score={talent.score}
						achievements={achievementsData as GroupAchievemtProps}
						isPartner={isPartner}
					/>
					{!tab && (
						<ProfileSkills
							skills={
								talent?.profile?.talent?.tagsIds?.map((t) => ({
									name: t.name,
									backgroundColor:
										t.color ?? getRandomReadableBgColor(),
								})) ?? []
							}
						/>
					)}
				</div>

				<div className="w-full sm:grid sm:h-auto sm:grid-cols-1">
					<UserGroups
						isPartner={isPartner}
						tab={tab}
						talentId={talent?._id}
					/>
				</div>
			</div>
		</div>
	);
}
