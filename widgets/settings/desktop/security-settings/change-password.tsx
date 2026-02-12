"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "pakt-ui";
import { type ReactElement, useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { PasswordCriteria } from "@/components/common/password-criteria";
import { useChangePassword } from "@/lib/api/account";
import { spChars } from "@/lib/utils";
import { changePasswordFormSchema } from "@/lib/validations";

import { Spinner } from "../../../../components/common/loader";
import CardView from "../../../../components/common/card-view";

type EditProfileFormValues = z.infer<typeof changePasswordFormSchema>;

export const ChangePasswordForm = (): ReactElement => {
	const changePassword = useChangePassword();

	const form = useForm<EditProfileFormValues>({
		resolver: zodResolver(changePasswordFormSchema),
		reValidateMode: "onChange",
	});

	const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
		changePassword.mutate(
			{
				oldPassword: values.currentPassword,
				newPassword: values.newPassword,
			},
			{
				onSuccess: () => {
					form.reset({
						currentPassword: "",
						newPassword: "",
						confirmNewPassword: "",
					});
				},
			}
		);
	};

	const { newPassword } = form.getValues();
	const { confirmNewPassword } = form.getValues();

	const newPasswordWatch = form.watch("newPassword");
	const confirmNewPasswordWatch = form.watch("confirmNewPassword");

	const validatingErr = useMemo(
		() => ({
			isMinLength: newPassword?.length >= 8 || false,
			checkLowerUpper:
				(/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) ||
				false,
			checkNumber: !(newPassword?.match(/\d+/g) == null),
			specialCharacter: spChars.test(newPassword) || false,
			confirmedPassword:
				(newPassword === confirmNewPassword &&
					newPassword !== "" &&
					newPassword !== undefined &&
					newPassword !== null) ||
				false,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[newPasswordWatch, confirmNewPasswordWatch]
	);

	// Check if when user starts typing the password
	const isPasswordTyping =
		newPasswordWatch !== "" &&
		newPasswordWatch !== undefined &&
		newPasswordWatch !== null;

	return (
		<div className="flex h-fit w-full max-w-[420px] flex-col">
			{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
			<CardView className="flex w-full flex-col !p-0">
				<form
					className="flex w-full flex-col gap-4 p-4"
					onSubmit={form.handleSubmit(onSubmit)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
						}
					}}
				>
					<h3 className="text-lg font-bold text-white">
						Change Password
					</h3>
					<Input
						{...form.register("currentPassword")}
						type="password"
						className="input-style w-full"
						placeholder="Enter current password"
						label="Current Password"
					/>
					{form.formState.errors.currentPassword?.message && (
						<span className="text-sm text-red-500">
							{form.formState.errors.currentPassword?.message}
						</span>
					)}
					<Input
						{...form.register("newPassword")}
						type="password"
						className="input-style w-full"
						placeholder="Enter new password"
						label="New Password"
					/>
					{isPasswordTyping && (
						<div className="flex flex-col gap-4">
							<p className="text-sm text-body">
								Password must contain
							</p>
							<div className="flex flex-col gap-4 p-4 text-xs text-body">
								<PasswordCriteria
									isValidated={validatingErr.isMinLength}
									criteria="At least 8 characters"
								/>
								<PasswordCriteria
									isValidated={validatingErr.checkLowerUpper}
									criteria="Upper and lower case characters"
								/>
								<PasswordCriteria
									isValidated={validatingErr.checkNumber}
									criteria="1 or more numbers"
								/>
								<PasswordCriteria
									isValidated={validatingErr.specialCharacter}
									criteria="1 or more special characters"
								/>
								<PasswordCriteria
									isValidated={
										validatingErr.confirmedPassword
									}
									criteria="Password must match"
								/>
							</div>
						</div>
					)}
					<Input
						{...form.register("confirmNewPassword")}
						type="password"
						className="input-style w-full"
						placeholder="Re-enter new password"
						label="Confirm New Password"
					/>
					{form.formState.errors.confirmNewPassword?.message && (
						<span className="text-sm text-red-500">
							{form.formState.errors.confirmNewPassword?.message}
						</span>
					)}
					<Button
						variant="default"
						type="submit"
						size="xs"
						className=" w-fit rounded-3xl"
						disabled={
							!form.formState.isValid || changePassword.isLoading
						}
					>
						{changePassword.isLoading ? (
							<Spinner />
						) : (
							"Save Changes"
						)}
					</Button>
				</form>
			</CardView>
		</div>
	);
};
