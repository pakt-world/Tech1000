"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo } from "react";
import { useIsClient, useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useUserState } from "@/lib/store/account";
import { determineRole, sentenceCase } from "@/lib/utils";
import DesktopSettingsView from "@/widgets/settings/desktop";
import MobileSettingsView from "@/widgets/settings/mobile";

export interface UserDataProps {
	firstName: string;
	lastName: string;
	title: string;
	bio: string;
	location: string;
	country: string;
	avatar: string;
	kycVerified: boolean;
	tags: string[];
	isPrivate: boolean;
	email: string;
	website: string;
	x: string;
	tiktok: string;
	instagram: string;
	github: string;
	role?: string;
}

export default function SettingsPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const isClient = useIsClient();

	const userAccount = useUserState();

	// const { refetch: refetchUser, isLoading: accountIsLoading } = getAccount;

	const userData: UserDataProps = useMemo(
		() => ({
			...userAccount,
			firstName: userAccount?.firstName ?? "",
			lastName: userAccount?.lastName ?? "",
			title: sentenceCase(determineRole(userAccount)),
			bio: userAccount?.profile?.bio?.description ?? "",
			location: userAccount?.profile?.contact?.city ?? "",
			country: userAccount?.profile?.contact?.country ?? "",
			avatar: userAccount?.profileImage?.url ?? "",
			kycVerified: userAccount?.kyc ?? false,
			tags: userAccount?.profile?.talent?.tags ?? [],
			isPrivate: userAccount?.isPrivate ?? false,
			email: userAccount?.email ?? "",
			website: userAccount?.meta?.profileLinks?.website ?? "",
			x: userAccount?.meta?.profileLinks?.x ?? "",
			tiktok: userAccount?.meta?.profileLinks?.tiktok ?? "",
			instagram: userAccount?.meta?.profileLinks?.instagram ?? "",
			github: userAccount?.meta?.profileLinks?.github ?? "",
		}),
		[userAccount]
	);

	return (
		isClient &&
		(tab ? (
			<DesktopSettingsView userData={userData} />
		) : (
			<MobileSettingsView userData={userData} />
		))
	);
}
