/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import * as Form from "@radix-ui/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import type { UserDataProps } from "@/app/(dashboard)/settings/page";
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { useUpdateAccount } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { determineRole, linkChecker, sentenceCase } from "@/lib/utils";
import { editProfileFormSchema4Mobile3 } from "@/lib/validations";

export type EditProfileFormValues = z.infer<
	typeof editProfileFormSchema4Mobile3
>;

export const ProfileLinks = (): JSX.Element => {
	const router = useRouter();
	const userAccount = useUserState();
	const queryClient = useQueryClient();
	const refetchUser = () => {
		queryClient.invalidateQueries(["account-details"]);
	};

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

	const form = useForm<EditProfileFormValues>({
		resolver: zodResolver(editProfileFormSchema4Mobile3),
		defaultValues: userData,
	});

	const updateAccount = useUpdateAccount();

	const loading = updateAccount.isLoading || form.formState.isLoading;

	const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
		const payload = {
			firstName: userData.firstName,
			profile: {
				contact: {
					state: userData.location,
					city: userData.location,
					country: userData.country,
				},
				bio: {
					title: userData.title,
					description: userData.bio,
				},
				talent: {
					tags: [...(userData.tags ?? [])],
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
		};
		updateAccount.mutate(
			{ ...payload },
			{
				onSuccess: () => {
					refetchUser();
					router.back();
				},
			}
		);
	};

	return (
		<div className="relative size-full overflow-hidden bg-ink-darkest/40 from-white via-transparent to-white font-circular">
			<div className="fixed top-[70px] z-50 flex w-full items-center gap-2 bg-ink-darkest/40 from-white via-transparent to-white p-4 backdrop-blur-sm">
				<Button
					className="p-0"
					onClick={() => {
						router.back();
					}}
					variant="ghost"
				>
					<ChevronLeft className="text-white" />
				</Button>
				<h1 className="text-lg font-bold leading-[27px] tracking-wide text-white">
					Profile Links
				</h1>
			</div>
			<Form.Root
				className="flex w-full flex-col gap-4 overflow-y-auto p-5 py-20"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Form.Field name="lastName" className="relative w-full">
					<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
						Website
					</Form.Label>
					<input
						{...form.register("website")}
						className="h-12 w-full rounded-lg border border-gray-200 border-opacity-20 !bg-[#FCFCFD1A] px-4 py-[13px] !text-white"
						placeholder="Enter website url"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.website?.message && (
							<span className="text-sm text-red-500">
								{form.formState.errors.website?.message}
							</span>
						)}
					</span>
				</Form.Field>
				<Form.Field name="lastName" className="relative w-full">
					<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
						X
					</Form.Label>
					<input
						{...form.register("x")}
						className="h-12 w-full rounded-lg border border-gray-200 border-opacity-20 !bg-[#FCFCFD1A] px-4 py-[13px] !text-white"
						placeholder="Enter x url"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.x?.message && (
							<span className="text-sm text-red-500">
								{form.formState.errors.x?.message}
							</span>
						)}
					</span>
				</Form.Field>

				<Form.Field name="lastName" className="relative w-full">
					<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
						Tiktok
					</Form.Label>
					<input
						{...form.register("tiktok")}
						className="h-12 w-full rounded-lg border border-gray-200 border-opacity-20 !bg-[#FCFCFD1A] px-4 py-[13px] !text-white"
						placeholder="Enter tiktok url"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.tiktok?.message && (
							<span className="text-sm text-red-500">
								{form.formState.errors.tiktok?.message}
							</span>
						)}
					</span>
				</Form.Field>
				<Form.Field name="lastName" className="relative w-full">
					<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
						Instagram
					</Form.Label>
					<input
						{...form.register("instagram")}
						className="h-12 w-full rounded-lg border border-gray-200 border-opacity-20 !bg-[#FCFCFD1A] px-4 py-[13px] !text-white"
						placeholder="Enter instagram url"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.instagram?.message && (
							<span className="text-sm text-red-500">
								{form.formState.errors.instagram?.message}
							</span>
						)}
					</span>
				</Form.Field>

				<Form.Field name="lastName" className="relative w-full">
					<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
						Github
					</Form.Label>
					<input
						{...form.register("github")}
						className="h-12 w-full rounded-lg border border-gray-200 border-opacity-20 !bg-[#FCFCFD1A] px-4 py-[13px] !text-white"
						placeholder="Enter github url"
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.github?.message && (
							<span className="text-sm text-red-500">
								{form.formState.errors.github?.message}
							</span>
						)}
					</span>
				</Form.Field>

				<Button
					className="flex-end mt-6 w-full"
					type="submit"
					variant="white"
					size="lg"
					disabled={loading || !form.formState.isValid}
				>
					{loading ? <Spinner size={18} /> : "Save Changes"}
				</Button>
			</Form.Root>
		</div>
	);
};
