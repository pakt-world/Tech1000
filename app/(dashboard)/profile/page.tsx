"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { type ReactElement, useEffect, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { PageLoading } from "@/components/common/page-loading";
import { useGetAchievements } from "@/lib/api/talent";
import { Roles } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { GroupAchievemtProps } from "@/lib/types/member";
import { determineRole, getRandomReadableBgColor } from "@/lib/utils";
import { Achievements } from "@/widgets/members/profile/achievements";
import { Bio } from "@/widgets/members/profile/bio";
import { ProfileHeader } from "@/widgets/members/profile/header/desktop";
import { MobileProfileHeader } from "@/widgets/members/profile/header/mobile";
import { UserGroups } from "@/widgets/members/profile/groups";
import ProfileSkills from "@/widgets/members/profile/skills";

export default function ProfilePage(): ReactElement | null {
	const router = useRouter();
	const user = useUserState();

	const talentId = String(user?._id);
	const tab = useMediaQuery("(min-width: 640px)");

	const { data: achievementsData, isLoading } = useGetAchievements();

	const userIsPartner = determineRole(user) === Roles.PARTNER;

	useEffect(() => {
		if (!talentId) {
			router.back();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const talent = useMemo(
		() => ({
			id: user?._id,
			name: userIsPartner
				? `${user?.firstName}`
				: `${user?.firstName}  ${user?.lastName}`,
			position: user?.profile?.bio?.title ?? "",
			image: user?.profileImage?.url ?? "",
			bio: user?.profile?.bio?.description ?? "",
			score: user?.score ?? 0,
			achievements: user?.achievements,
			skills:
				(user?.profile?.talent?.tagsIds ?? []).map((t) => ({
					name: t.name,
					backgroundColor: t.color ?? getRandomReadableBgColor(),
				})) || [],
			nftImageUrl: user?.meta?.imageUrl,
			nftTokenNumber: user?.meta?.tokenId,
		}),
		[user, userIsPartner]
	);

	if (isLoading) return <PageLoading color="#ffffff" />;

	return (
		<div className="scrollbar-hide flex size-full grow flex-col overflow-y-auto">
			<MobileBreadcrumb
				items={[
					{ label: "Members", link: "/members" },
					{ label: "My Profile", active: true },
				]}
				className="!fixed top-[70px] !z-50"
			/>
			<div className="relative flex flex-col items-start overflow-y-auto max-sm:!mb-[65px] max-sm:mt-[43px] sm:h-full sm:gap-6 sm:pb-4 md:pb-20">
				{tab ? (
					<ProfileHeader
						_id={talent.id}
						name={talent.name}
						position={talent.position}
						score={parseInt(talent?.nftTokenNumber || "0") || 0}
						skills={talent.skills}
						isOwnProfile
						profileImage={talent.image}
						userIsPartner={userIsPartner}
						nftDetails={{
							nftImageUrl: talent?.nftImageUrl || "",
							nftTokenNumber: talent?.nftTokenNumber || "",
						}}
					/>
				) : (
					<MobileProfileHeader
						_id={talent.id}
						name={talent.name}
						position={talent.position}
						score={parseInt(talent?.nftTokenNumber || "0") || 0}
						skills={talent.skills}
						isOwnProfile
						profileImage={talent.image}
						userIsPartner={userIsPartner}
						nftDetails={{
							nftImageUrl: talent?.nftImageUrl || "",
							nftTokenNumber: talent?.nftTokenNumber || "",
						}}
					/>
				)}

				<div className="flex w-full max-sm:flex-col sm:gap-6">
					<Bio
						body={talent.bio}
						profileLinks={user.meta?.profileLinks}
						tab={tab}
					/>
					<Achievements
						score={talent.score}
						achievements={achievementsData as GroupAchievemtProps}
						isPartner={userIsPartner}
					/>
					{!tab && <ProfileSkills skills={talent?.skills} />}
				</div>
				<div className="h-auto w-full sm:grid sm:grid-cols-1">
					<UserGroups
						isPartner={userIsPartner}
						tab={tab}
						talentId={talentId}
					/>
				</div>
			</div>
		</div>
	);
}
