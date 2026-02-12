"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import ProfileForm from "./_components/profile-form";
import BasicInfo from "./_components/profile-form/basic-info";
import { useUpdateAccount } from "@/lib/api/account";
import { linkChecker } from "@/lib/utils";
import { editProfileFormSchema } from "@/lib/validations";

import { ProfileSteps } from "./_components/steps";
import { useUserState } from "@/lib/store/account";

export type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

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

export const ProfileView = ({ userData }: Props): JSX.Element => {
	const updateAccount = useUpdateAccount();
	// const router = useRouter();
	const queryClient = useQueryClient();

	const form = useForm<EditProfileFormValues>({
		resolver: zodResolver(editProfileFormSchema),
		//@ts-expect-error
		defaultValues: { ...userData, role: userData?.profile?.bio?.title },
		reValidateMode: "onBlur",
		mode: "onBlur",
	});

	const profileSteps = {
		name:
			form.watch("firstName") !== "" &&
			!form.getFieldState("firstName").invalid, // &&
		// form.watch("lastName") !== "" &&
		// !form.getFieldState("lastName").invalid,
		location:
			form.watch("location") !== "" &&
			!form.getFieldState("location").invalid,
		skills:
			Array.isArray(form.watch("tags")) &&
			form.watch("tags").filter((r) => r !== undefined && r !== "")
				.length >= 3 &&
			!form.getFieldState("tags").invalid,
		bio: form.watch("bio") !== "" && !form.getFieldState("bio").invalid,
	};

	const updateAccountFunc = (values: EditProfileFormValues): void => {
		const payload = {
			...(values.firstName && { firstName: values.firstName }),
			profile: {
				contact: {
					...(values.location && { state: values.location }),
					...(values.location && { city: values.location }),
					...(values.country && { country: values.country }),
				},
				bio: {
					...(values.role && { title: values.role }),
					...(values.bio && { description: values.bio }),
				},
				talent: {
					...(values.tags?.length && { tags: [...values.tags] }),
				},
			},
			meta: {
				profileLinks: {
					...(values.website && {
						website: linkChecker(values.website),
					}),
					...(values.x && { x: linkChecker(values.x) }),
					...(values.tiktok && {
						tiktok: linkChecker(values.tiktok),
					}),
					...(values.instagram && {
						instagram: linkChecker(values.instagram),
					}),
					...(values.github && {
						github: linkChecker(values.github),
					}),
				},
			},
			...(values.isPrivate !== undefined && {
				isPrivate: values.isPrivate,
			}),
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

	const toggleUserProfile = (state: string): void => {
		const validState = state === "true";
		form.setValue("isPrivate", validState);
		updateAccountFunc({ ...form.getValues() });
	};

	const { profileCompleteness } = useUserState();
	const profileCompleted = (profileCompleteness as number) > 70;

	// if (accountIsLoading) return <Spinner />;

	return (
		<div className="z-1000 flex w-full flex-col overflow-visible">
			<div className="relative flex h-full grow flex-col gap-4 overflow-visible  lg:flex-row 2xl:gap-6">
				<div className="flex h-full flex-col gap-4 lg:w-[30%] 2xl:w-1/4 2xl:gap-6">
					<BasicInfo
						userData={userData}
						form={form}
						toggleUserProfile={toggleUserProfile}
						refetchUser={() => {
							queryClient.invalidateQueries(["account-details"]);
						}}
					/>
					{/* {!profileSteps.name ||
					!profileSteps.location ||
					!profileSteps.skills ||
					!profileSteps.bio ? ( */}
					<div className="hidden lg:block">
						{(!profileCompleted ||
							!profileSteps.name ||
							!profileSteps.location ||
							!profileSteps.skills ||
							!profileSteps.bio) && (
							<ProfileSteps profileSteps={profileSteps} />
						)}
					</div>
					{/* ) : null} */}
				</div>
				<ProfileForm
					form={form}
					updateAccountFunc={updateAccountFunc}
				/>
			</div>
		</div>
	);
};
