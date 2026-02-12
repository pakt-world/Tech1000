/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import * as Form from "@radix-ui/react-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import type { UserDataProps } from "@/app/(dashboard)/settings/page";
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { useUpdateAccount } from "@/lib/api/account";
import { useUserState } from "@/lib/store/account";
import { determineRole, sentenceCase } from "@/lib/utils";
import { editProfileFormSchema4Mobile } from "@/lib/validations";

import CountryDropdown from "../_shared/dropdowns/countries";
import StateDropdown from "../_shared/dropdowns/states";
import { Roles } from "@/lib/enums";
import { CustomInput } from "@/components/common/custom-input";

export type EditProfileFormValues = z.infer<
	typeof editProfileFormSchema4Mobile
>;

export const EditProfile = (): JSX.Element => {
	const router = useRouter();
	const userAccount = useUserState();
	const queryClient = useQueryClient();
	const refetchUser = () => {
		queryClient.invalidateQueries(["account-details"]);
	};

	const user = useUserState();
	const userIsPartner = determineRole(user) === Roles.PARTNER;

	// const { refetch: refetchUser, isLoading: accountIsLoading } = getAccount;

	const userData: UserDataProps = useMemo(
		() => ({
			...userAccount,
			firstName: userAccount?.firstName ?? "",
			lastName: userAccount?.lastName ?? "",
			title: sentenceCase(determineRole(userAccount)),
			bio: userAccount?.profile?.bio?.title ?? "",
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
		resolver: zodResolver(editProfileFormSchema4Mobile),
		defaultValues: { ...userData, role: userData?.bio },
	});

	const updateAccount = useUpdateAccount();

	const loading = updateAccount.isLoading || form.formState.isLoading;

	const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
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
				},
				// talent: {
				// 	...(values.tags?.length && { tags: [...values.tags] }),
				// },
			},
			// meta: {
			// 	profileLinks: {
			// 		website: userData.website,
			// 		x: userData.x,
			// 		tiktok: userData.tiktok,
			// 		instagram: userData.instagram,
			// 		github: userData.github,
			// 	},
			// },
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
	// Get country form value
	const countryValue = form.watch("country");

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		form.setValue("firstName", value || "");
		form.setValue("lastName", "");
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
				<h1 className="text-lg font-bold leading-[27px] tracking-wide text-white ">
					Edit Profile
				</h1>
			</div>

			<Form.Root
				className="flex w-full flex-col overflow-y-auto p-5 py-20 backdrop-blur-sm"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="mb-5 flex flex-col gap-2">
					<Form.Field className="relative" name="firstName">
						<CustomInput
							type="text"
							htmlFor="name"
							label={
								userIsPartner ? "Organization Name" : "Username"
							}
							placeholder="Enter full name"
							register={form.register("firstName")}
							onChange={handleNameChange}
							maxLength={18}
						/>
						<span className="absolute -bottom-6 flex w-full">
							{form.formState.errors.firstName?.message && (
								<span className="text-sm text-red-500">
									{form.formState.errors.firstName?.message}
								</span>
							)}
						</span>
					</Form.Field>
				</div>

				<div className="mb-5 flex flex-col gap-2">
					<Form.Field className="relative" name="title">
						<CustomInput
							type="text"
							htmlFor="role"
							label="Role"
							placeholder="e.g Developer"
							register={form.register("role")}
						/>
						<span className="absolute -bottom-6 flex w-full">
							{form.formState.errors.role?.message && (
								<span className="text-sm text-red-500">
									{form.formState.errors.role?.message}
								</span>
							)}
						</span>
					</Form.Field>
				</div>

				<div className="mb-5 flex flex-col gap-2">
					<Form.Field
						className="relative cursor-not-allowed"
						name="email"
					>
						<CustomInput
							type="email"
							htmlFor="email"
							label="Email Address"
							placeholder="Email Address"
							register={form.register("email")}
							disabled
						/>

						<span className="absolute -bottom-6 flex w-full">
							{form.formState.errors.email?.message && (
								<span className="text-sm text-red-500">
									{form.formState.errors.email?.message}
								</span>
							)}
						</span>
					</Form.Field>
				</div>
				<div className="relative mb-5 flex flex-col">
					<Controller
						name="country"
						control={form.control}
						render={({ field: { onChange, value } }) => {
							return (
								<div className="flex w-full flex-col gap-2">
									<label className="text-base leading-normal tracking-tight text-gray-800">
										Country
									</label>
									<CountryDropdown
										onChange={onChange}
										value={value}
									/>
								</div>
							);
						}}
					/>

					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.country?.message && (
							<span className="text-sm text-red-500">
								{form.formState.errors.country?.message}
							</span>
						)}
					</span>
				</div>
				<div className="relative mb-10 flex flex-col">
					<Controller
						name="location"
						control={form.control}
						render={({ field: { onChange, value } }) => {
							return (
								<div className="flex w-full flex-col gap-2">
									<label className="text-base leading-normal tracking-tight text-gray-800">
										Region
									</label>
									<StateDropdown
										onChange={onChange}
										value={value}
										countryValue={countryValue}
									/>
								</div>
							);
						}}
					/>
					<span className="absolute -bottom-6 flex w-full">
						{form.formState.errors.location?.message && (
							<span className="text-sm text-red-500">
								{form.formState.errors.location?.message}
							</span>
						)}
					</span>
				</div>

				<Button
					className="py-3"
					type="submit"
					variant="white"
					size="lg"
					//disabled={loading || !form.formState.isValid}
				>
					{loading ? <Spinner size={18} /> : "Save Changes"}
				</Button>
			</Form.Root>
		</div>
	);
};
