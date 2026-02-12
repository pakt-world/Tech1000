/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { PasswordCriteria } from "@/components/common/password-criteria";
import { useChangePassword } from "@/lib/api/account";
import { spChars } from "@/lib/utils";
import { changePasswordFormSchema } from "@/lib/validations";

type EditProfileFormValues = z.infer<typeof changePasswordFormSchema>;

export const ChangePassword = (): JSX.Element => {
	const router = useRouter();
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
					Change Password
				</h1>
			</div>
			<form
				className="flex w-full flex-col gap-2 overflow-y-auto p-5 py-20"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="mb-5 flex flex-col gap-3">
					<label className="text-base leading-normal tracking-tight text-gray-800">
						Current Password
					</label>
					<input
						{...form.register("currentPassword")}
						type="password"
						className=" h-12 w-full rounded-lg !bg-[#FCFCFD1A] px-4 py-[13px] !text-white outline-none"
						placeholder="enter current password"
					/>
					{form.formState.errors.currentPassword?.message && (
						<span className="text-sm text-red-500">
							{form.formState.errors.currentPassword?.message}
						</span>
					)}
				</div>
				<div className="mb-5 flex flex-col gap-3">
					<label className="text-base leading-normal tracking-tight text-gray-800">
						New Password
					</label>
					<input
						{...form.register("newPassword")}
						type="password"
						className=" h-12 w-full rounded-lg !bg-[#FCFCFD1A] px-4 py-[13px] !text-white outline-none"
						placeholder="enter new password"
					/>
				</div>
				<p className="text-sm text-body">Password must contain</p>
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
						isValidated={validatingErr.confirmedPassword}
						criteria="Passwords must be match"
					/>
				</div>
				<div className="mb-5 flex flex-col gap-3">
					<label className="text-base leading-normal tracking-tight text-gray-800">
						Confirm New Password
					</label>
					<input
						{...form.register("confirmNewPassword")}
						type="password"
						className=" h-12 w-full rounded-lg !bg-[#FCFCFD1A] px-4 py-[13px] !text-white outline-none"
						placeholder="re-enter new password"
					/>
					{form.formState.errors.confirmNewPassword?.message && (
						<span className="text-sm text-red-500">
							{form.formState.errors.confirmNewPassword?.message}
						</span>
					)}
				</div>
				<Button
					variant="white"
					size="lg"
					type="submit"
					className="flex-end mt-auto w-full"
					disabled={
						!form.formState.isValid || changePassword.isLoading
					}
				>
					{changePassword.isLoading ? <Spinner /> : "Save Changes"}
				</Button>
			</form>
		</div>
	);
};
