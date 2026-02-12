"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tabs } from "@/components/common/tabs";
import { ProfileView } from "@/widgets/settings/desktop/profile-settings";
import { SecurityView } from "@/widgets/settings/desktop/security-settings";

interface Props {
	userData: {
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
	};
}

export default function DesktopSettingsView({ userData }: Props): JSX.Element {
	return (
		<div className="relative flex h-full flex-col gap-8 overflow-y-auto">
			<Tabs
				tabContentContainerClassName="!overflow-visible z-[200]"
				tabs={[
					{
						label: "Profile",
						value: "profile",
						content: <ProfileView userData={userData} />,
					},
					{
						label: "Security",
						value: "security",
						content: <SecurityView />,
					},
				]}
			/>
		</div>
	);
}
