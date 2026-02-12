/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { ChevronRight, Mail, MapPin, Verified } from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "pakt-ui";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type UserDataProps } from "@/app/(dashboard)/settings/page";
import { Button } from "@/components/common/button";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { UploadAvatar } from "@/components/common/upload-avatar";
import { AUTH_TOKEN_KEY, linkChecker, sentenceCase } from "@/lib/utils";
import { Roles } from "@/lib/enums";
import { EditProfileFormValues } from "../desktop/profile-settings";
import { useUpdateAccount } from "@/lib/api/account";
import CardView from "@/components/common/card-view";

interface Props {
	userData: UserDataProps;
}

export default function MobileSettingsView({ userData }: Props): JSX.Element {
	const router = useRouter();

	const [isPublic, setIsPublic] = useState(!userData.isPrivate);

	const updateAccount = useUpdateAccount();

	const queryClient = useQueryClient();
	const refetchUser = () => {
		queryClient.invalidateQueries(["account-details"]);
	};

	const updateAccountFunc = (values: EditProfileFormValues): void => {
		const payload = {
			firstName: values.firstName,
			lastName: values.lastName,
			profile: {
				contact: {
					state: values.location,
					city: values.location,
					country: values.country,
				},
				bio: {
					title: values.title,
					description: values.bio,
				},
				role: values?.role,
				talent: {
					tags: [...(values.tags || [])],
				},
			},
			meta: {
				profileLinks: {
					website: linkChecker(values.website as string),
					x: linkChecker(values.x as string),
					tiktok: linkChecker(values.tiktok as string),
					instagram: linkChecker(values.instagram as string),
					github: linkChecker(values.github as string),
				},
			},
			isPrivate: values.isPrivate,
		};

		updateAccount.mutate(
			{ ...payload },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(["account-details"]);
					// router.push("/profile");
				},
			}
		);
	};

	const accountSettings = [
		{
			title: "Edit Profile",
			action: () => {
				router.push("/settings/edit-profile");
			},
		},
		{
			title: "Professional Information",
			action: () => {
				router.push("/settings/professional-info");
			},
		},
		{
			title: "Profile Links",
			action: () => {
				router.push("/settings/profile-links");
			},
		},
		{
			title: "Visibility",
			action: () => {},
		},
		{
			title: "Change Password",
			action: () => {
				router.push("/settings/change-password");
			},
		},
		{
			title: "2FA",
			action: () => {
				router.push("/settings/two-factor-authentication");
			},
		},
	];
	const Logout = (): void => {
		deleteCookie(AUTH_TOKEN_KEY);
		queryClient.clear();
		router.push("/login");
	};

	return (
		<div className="flex size-full flex-col overflow-hidden">
			<MobileBreadcrumb
				items={[
					{
						label: "Profile",
						link: "/profile",
					},
					{ label: "Settings", active: true },
				]}
				className="!fixed top-[70px] !z-50 px-5"
			/>
			<div className="relative w-full p-4 py-20">
				<CardView className="flex h-max flex-col items-start justify-start gap-4 rounded-2xl px-4 py-[15px] shadow">
					<div className="flex w-full flex-col items-start gap-4">
						<div className="flex items-center gap-4">
							<div className="item-center mx-auto flex flex-col justify-center gap-2 text-center">
								<UploadAvatar
									size={81}
									image={userData.avatar}
									onUploadComplete={refetchUser}
								/>
							</div>
							<div className="flex flex-col items-start justify-center">
								<div className="mb-2 flex flex-row items-center justify-center">
									{userData.title ===
									sentenceCase(Roles.PARTNER) ? (
										<p className="text-lg font-bold text-white">
											{userData.firstName}
										</p>
									) : (
										<p className="text-lg font-bold text-white">
											{userData?.firstName}{" "}
											{userData?.lastName}
										</p>
									)}
									{userData?.kycVerified && (
										<Verified className="ml-2 h-4 w-4 text-white" />
									)}
								</div>
								<div className="mb-1 flex flex-row items-center justify-center text-body">
									<Mail className="mr-2 h-4 w-4" />
									<p className="text-sm font-thin leading-[21px] tracking-wide text-body">
										{userData?.email}
									</p>
								</div>
								<div className="flex flex-row items-center justify-center text-body">
									{userData?.location &&
										userData?.country && (
											<>
												<MapPin className="mr-2 h-4 w-4" />
												<p className="text-sm font-thin leading-[21px] tracking-wide text-body">
													{sentenceCase(
														userData?.location
													)}
													,{" "}
													{sentenceCase(
														userData?.country
													)}
												</p>
											</>
										)}
								</div>
							</div>
						</div>
						<div className="h-[0.09rem] w-full border-none bg-gray-200" />
						<div className="flex w-full flex-col items-start gap-2">
							<h4 className="text-base leading-normal tracking-tight text-white">
								Account
							</h4>
							<div className="flex w-full flex-col items-start gap-2">
								{accountSettings.map((settings) => (
									<Button
										variant="ghost"
										className="flex w-full items-center justify-between p-2 !font-circular text-base leading-normal tracking-tight text-white hover:!bg-transparent"
										onClick={settings.action}
										type="button"
										key={settings.title}
									>
										{settings.title}
										{settings.title === "Visibility" ? (
											<div className="flex items-center gap-2">
												<span className="text-base !font-normal text-gray-500">
													Public
												</span>
												<Switch
													checked={
														!userData.isPrivate
													}
													onCheckedChange={(
														checked
													) => {
														setIsPublic(checked);
														updateAccountFunc({
															...userData,
															isPrivate: isPublic,
														});
													}}
												/>
											</div>
										) : (
											<ChevronRight className="h-4 w-4" />
										)}
									</Button>
								))}
								<Button
									variant="ghost"
									className="flex w-full items-center justify-between p-2 text-base leading-normal tracking-tight text-red-600 hover:!bg-transparent"
									onClick={() => {
										Logout();
									}}
									type="button"
								>
									Logout
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
						<div className="flex w-full flex-col items-start gap-2">
							<h4 className="text-base leading-normal tracking-tight text-white">
								Other
							</h4>
							<div className="flex w-full flex-col items-start gap-2">
								<Button
									variant="ghost"
									className="flex w-full items-center justify-between p-2 text-base leading-normal tracking-tight !text-red-600 hover:!bg-transparent"
									onClick={() => {
										router.push("/settings/delete-account");
									}}
									type="button"
								>
									Delete Account
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</CardView>
			</div>
		</div>
	);
}
