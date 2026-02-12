"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "pakt-ui";
import { useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { Spinner } from "@/components/common/loader";
import { PasswordCriteria } from "@/components/common/password-criteria";
import { useSignUp } from "@/lib/api/auth";
import { createQueryStrings, spChars } from "@/lib/utils";
import {
	signupSchema4Ambassador,
	signupSchema4Partner,
} from "@/lib/validations";

const SignupReferralForm = ({
	referralCode,
	isPartner,
}: {
	referralCode: string;
	isPartner: boolean;
}): React.JSX.Element => {
	const signup = useSignUp();
	const router = useRouter();

	const types = isPartner ? signupSchema4Partner : signupSchema4Ambassador;

	const form = useForm<z.infer<typeof types>>({
		resolver: zodResolver(types),
	});

	const onSubmit: SubmitHandler<z.infer<typeof types>> = (values) => {
		// @ts-expect-error - lastName is not in the schema for partner
		const lastName = isPartner ? "partner" : values.lastName;
		signup.mutate(
			{ ...values, lastName, referral: referralCode },
			{
				onSuccess: ({ tempToken, email }) => {
					router.push(
						`/signup/verify?${createQueryStrings([
							{
								name: "email",
								value: email,
							},
							{
								name: "token",
								value: tempToken.token,
							},
						])}`
					);
				},
			}
		);
	};

	const { password } = form.getValues();
	const { confirmPassword } = form.getValues();

	const passwordWatch = form.watch("password");
	const confirmPasswordWatch = form.watch("confirmPassword");

	const validatingErr = useMemo(
		() => ({
			isMinLength: password?.length >= 8 || false,
			checkLowerUpper:
				(/[A-Z]/.test(password) && /[a-z]/.test(password)) || false,
			checkNumber: !(password?.match(/\d+/g) == null),
			specialCharacter: spChars.test(password) || false,
			confirmedPassword:
				(password === confirmPassword &&
					password !== "" &&
					password !== undefined &&
					password !== null) ||
				false,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[passwordWatch, confirmPasswordWatch]
	);

	// Check if when user starts typing the password
	const isPasswordTyping =
		passwordWatch !== "" &&
		passwordWatch !== undefined &&
		passwordWatch !== null;

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="flex w-full flex-col items-center gap-6 rounded-2xl border border-white border-opacity-30 bg-white bg-opacity-30 p-4 backdrop-blur-md sm:max-w-[600px] sm:px-[40px] sm:py-10"
		>
			<div className="flex w-full flex-col gap-4">
				<div
					className={`grid gap-4 ${isPartner ? "grid-cols-1" : "grid-cols-2"}`}
				>
					<div className="relative mb-2 flex flex-col gap-2">
						<label
							htmlFor="firstName"
							className="text-sm text-white"
						>
							{isPartner ? "Organization Name" : "First Name"}
						</label>
						<Input
							id="firstName"
							{...form.register("firstName")}
							className="border-opacity-3 border !border-neutral-200 !text-base"
							placeholder={
								isPartner ? "Organization Name" : "First Name"
							}
						/>
						<InputErrorMessage
							message={form.formState.errors.firstName?.message}
						/>
					</div>
					{!isPartner && (
						<div className="relative flex flex-col gap-2">
							<label
								htmlFor="lastName"
								className="text-sm text-white"
							>
								Last Name
							</label>
							<Input
								id="lastName"
								// @ts-expect-error - lastName is not in the schema for partner
								{...form.register("lastName")}
								placeholder="Last Name"
								className="border-opacity-3 border !border-neutral-200 !text-base"
							/>
							<InputErrorMessage
								message={
									// @ts-expect-error - lastName is not in the schema for partner
									form.formState.errors.lastName?.message
								}
							/>
						</div>
					)}
				</div>

				<div className="relative mb-2 flex flex-col gap-2">
					<label htmlFor="email" className="text-sm text-white">
						Email Address
					</label>
					<Input
						id="email"
						{...form.register("email")}
						placeholder="Email Address"
						className="border-opacity-3 border !border-neutral-200 !text-base"
					/>
					<InputErrorMessage
						message={form.formState.errors.email?.message}
					/>
				</div>

				<div className="relative mb-2 flex flex-col gap-2">
					<label htmlFor="password" className="text-sm text-white">
						Create Password
					</label>
					<Input
						id="password"
						{...form.register("password")}
						className="border-opacity-3 border !border-neutral-200 !text-base"
						placeholder="Password"
						type="password"
					/>
					{isPasswordTyping && (
						<div className="flex flex-col gap-4 p-4 text-xs text-body">
							<PasswordCriteria
								isValidated={validatingErr.isMinLength}
								criteria="At least 8 characters"
								isSignUp
							/>
							<PasswordCriteria
								isValidated={validatingErr.checkLowerUpper}
								criteria="Upper and lower case characters"
								isSignUp
							/>
							<PasswordCriteria
								isValidated={validatingErr.checkNumber}
								criteria="1 or more numbers"
								isSignUp
							/>
							<PasswordCriteria
								isValidated={validatingErr.specialCharacter}
								criteria="1 or more special characters"
								isSignUp
							/>
							<PasswordCriteria
								isValidated={validatingErr.confirmedPassword}
								criteria="Password must match"
								isSignUp
							/>
						</div>
					)}
				</div>

				<div className="relative mb-2 flex flex-col gap-2">
					<label
						htmlFor="confirmPassword"
						className="text-sm text-white"
					>
						Confirm Password
					</label>
					<Input
						id="confirmPassword"
						{...form.register("confirmPassword")}
						className="border-opacity-3 border !border-neutral-200 !text-base"
						placeholder="Confirm Password"
						type="password"
					/>
				</div>
			</div>

			<Button
				className=""
				fullWidth
				disabled={!form.formState.isValid || signup.isLoading}
			>
				{signup.isLoading ? <Spinner /> : "Sign Up"}
			</Button>
		</form>
	);
};

export default SignupReferralForm;
