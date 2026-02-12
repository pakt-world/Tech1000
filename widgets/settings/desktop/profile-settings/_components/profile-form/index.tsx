"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as Form from "@radix-ui/react-form";
import { type ReactElement } from "react";
import {
	Controller,
	type SubmitHandler,
	type UseFormReturn,
} from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { useUpdateAccount } from "@/lib/api/account";
import { Roles } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { determineRole } from "@/lib/utils";
import { type editProfileFormSchema } from "@/lib/validations";

import { Spinner } from "../../../../../../components/common/loader";
import CountryDropdown from "../../../../_shared/dropdowns/countries";
import StateDropdown from "../../../../_shared/dropdowns/states";
import DeleteAccount from "../../../../_shared/dropdowns/delete-account";
import ProfessionalInfo from "./professional-info";
import { ProfileLinks } from "./profile-links";
import CardView from "@/components/common/card-view";
import { CustomInput } from "@/components/common/custom-input";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface FormProps {
	form: UseFormReturn<EditProfileFormValues>;
	updateAccountFunc: (values: EditProfileFormValues) => void;
}

const ProfileForm = ({ form, updateAccountFunc }: FormProps): ReactElement => {
	const updateAccount = useUpdateAccount();

	const user = useUserState();
	const userIsPartner = determineRole(user) === Roles.PARTNER;

	const loading = updateAccount.isLoading || form.formState.isLoading;

	const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
		updateAccountFunc(values);
	};
	// Get country form value
	const countryValue = form.watch("country");
	form.watch("location");

	const combinedName = `${form.getValues("firstName")}${form.getValues("lastName")}`;

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		form.setValue("firstName", value || "");
		form.setValue("lastName", "");
	};

	return (
		<div className=" relative z-[1000] flex h-screen flex-col items-start gap-4 overflow-visible  lg:w-[70%] 2xl:w-4/5">
			<Form.Root
				className="flex h-auto w-full flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<CardView className="mb-4 w-full flex-col !p-6">
					<div className="mb-4 flex w-full flex-row items-center justify-between">
						<p className="text-lg font-bold text-white">
							Edit Profile Details
						</p>
						<Button
							title="Save Changes"
							variant="default"
							type="submit"
							className="text-md absolute -top-[55px] right-0 max-h-[37px] !py-1"
							disabled={
								form.formState.isSubmitting ||
								//!form.formState.isValid ||
								loading
							}
						>
							{loading || form.formState.isSubmitting ? (
								<Spinner size={18} />
							) : (
								"Save Changes"
							)}
						</Button>
					</div>
					<div className="flex w-full">
						<div className="relative mx-auto flex w-full flex-col gap-6">
							<div
								id="input-row"
								className="flex w-full flex-row justify-between gap-4"
							>
								<Form.Field
									className="relative w-1/2"
									name="firstName"
								>
									<CustomInput
										value={combinedName}
										type="text"
										htmlFor="name"
										label={
											userIsPartner
												? "Organization Name"
												: "Username"
										}
										placeholder="Enter full name"
										register={form.register("firstName")}
										onChange={handleNameChange}
										maxLength={18}
									/>
									<span className="absolute -bottom-6 flex w-full">
										{form.formState.errors.firstName
											?.message && (
											<span className="text-sm text-red-500">
												{
													form.formState.errors
														.firstName?.message
												}
											</span>
										)}
									</span>
								</Form.Field>

								<Form.Field
									className="relative w-1/2"
									name="title"
								>
									<CustomInput
										type="text"
										htmlFor="role"
										label="Role"
										placeholder="e.g Developer"
										register={form.register("role")}
									/>
									<span className="absolute -bottom-6 flex w-full">
										{form.formState.errors.role
											?.message && (
											<span className="text-sm text-red-500">
												{
													form.formState.errors.role
														?.message
												}
											</span>
										)}
									</span>
								</Form.Field>
							</div>
							<div
								id="input-row"
								className="flex w-full flex-row justify-between gap-4"
							>
								<Form.Field
									className="relative w-1/2"
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
										{form.formState.errors.email
											?.message && (
											<span className="text-sm text-red-500">
												{
													form.formState.errors.email
														?.message
												}
											</span>
										)}
									</span>
								</Form.Field>
								{userIsPartner && (
									<div className="relative w-1/2">
										<Controller
											name="country"
											control={form.control}
											render={({
												field: {
													onChange,
													value,
													onBlur,
												},
											}) => {
												return (
													<Form.Field
														className="flex w-full flex-col"
														name="country"
													>
														<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
															Country
														</Form.Label>
														<CountryDropdown
															onChange={onChange}
															value={value}
															onBlur={() => {
																onBlur();
																form.trigger(
																	"location"
																);
															}}
															setValue={
																form.setValue
															}
														/>
													</Form.Field>
												);
											}}
										/>

										<span className="flex w-full">
											{form.formState.errors.country
												?.message && (
												<span className="mt-2 text-sm text-red-500">
													{
														form.formState.errors
															.country?.message
													}
												</span>
											)}
										</span>
									</div>
								)}
								{!userIsPartner && (
									<div className="relative w-1/2">
										<Controller
											name="country"
											control={form.control}
											render={({
												field: {
													onChange,
													value,
													onBlur,
												},
											}) => {
												return (
													<Form.Field
														className="flex w-full flex-col"
														name="country"
													>
														<Form.Label className="text-[15px] font-medium leading-[35px] text-white">
															Country
														</Form.Label>
														<CountryDropdown
															onChange={onChange}
															value={value}
															onBlur={() => {
																onBlur();
																form.trigger(
																	"location"
																);
															}}
															setValue={
																form.setValue
															}
														/>
													</Form.Field>
												);
											}}
										/>

										<span className="flex w-full">
											{form.formState.errors.country
												?.message && (
												<span className="mt-2 text-sm text-red-500">
													{
														form.formState.errors
															.country?.message
													}
												</span>
											)}
										</span>
									</div>
								)}
							</div>
							<div
								id="input-row"
								className="flex w-full flex-row justify-between gap-4"
							>
								<div className="relative w-1/2">
									<Controller
										name="location"
										control={form.control}
										render={({
											field: { onChange, value },
										}) => {
											return (
												<Form.Field
													className="flex w-full flex-col "
													name="location"
												>
													<Form.Label className="text-[15px] font-medium leading-[35px] ">
														Region
													</Form.Label>
													<StateDropdown
														onChange={onChange}
														value={value}
														countryValue={
															countryValue
														}
													/>
												</Form.Field>
											);
										}}
									/>
									<span className="flex w-full">
										{form.formState.errors.location
											?.message && (
											<span className="mt-2 text-sm text-red-500">
												{
													form.formState.errors
														.location?.message
												}
											</span>
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</CardView>
				<ProfessionalInfo form={form} />
				<ProfileLinks form={form} />
			</Form.Root>

			<div className="relative mb-20 w-full">
				<DeleteAccount />
			</div>
		</div>
	);
};

export default ProfileForm;
