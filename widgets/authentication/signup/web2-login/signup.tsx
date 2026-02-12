"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

import { PasswordCriteria } from "@/components/common/password-criteria";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useSignUp } from "@/lib/api/auth";
import { createQueryStrings, spChars } from "@/lib/utils";
import { signupSchema4Ambassador } from "@/lib/validations";

import { Button } from "../../../../components/common/button";
import { InputErrorMessage } from "../../../../components/common/InputErrorMessage";
import { Spinner } from "../../../../components/common/loader";
import CardView from "../../../../components/common/card-view";
import { CustomInput } from "../../../../components/common/custom-input";

type FormValues = z.infer<typeof signupSchema4Ambassador>;

const SignupForm = (): React.JSX.Element => {
	const signup = useSignUp();

	const router = useRouter();

	const form = useForm<FormValues>({
		resolver: zodResolver(signupSchema4Ambassador),
	});

	const onSubmit: SubmitHandler<FormValues> = (values) => {
		const payload = {
			email: values.email,
			password: values.password,
			confirmPassword: values.confirmPassword,
			firstName: values.firstName,
			...(values.lastName ? { lastName: values.lastName } : ""),
		};
		signup.mutate(
			{ ...payload },
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
		<CardView className="!border-lemon-green sm:max-w-[600px]">
			<form
				method="post"
				onSubmit={form.handleSubmit(onSubmit)}
				className="relative z-[100] flex w-full flex-col items-center gap-6"
			>
				<div className="flex w-full flex-col gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="relative col-span-2 mb-2 flex w-full flex-col gap-2">
							<CustomInput
								htmlFor="firstName"
								label={"Full Name"}
								placeholder="First Name"
								register={form.register("firstName")}
							/>
							<InputErrorMessage
								message={
									form.formState.errors.firstName?.message
								}
							/>
						</div>
						{/* <div className="relative flex flex-col gap-2">
							<CustomInput
								htmlFor="lastName"
								label={"Last Name"}
								placeholder="Last Name"
								register={form.register("lastName")}
							/>
							<InputErrorMessage
								message={
									form.formState.errors.lastName?.message
								}
							/>
						</div> */}
					</div>

					<div className="relative mb-2 flex flex-col gap-2">
						<CustomInput
							htmlFor="email"
							label={"Email Address"}
							placeholder="Email Address"
							register={form.register("email")}
						/>
						<InputErrorMessage
							message={form.formState.errors.email?.message}
						/>
					</div>

					<div className="relative mb-2 flex flex-col gap-2">
						<CustomInput
							id="password"
							htmlFor="password"
							label="Create Password"
							placeholder="Create Password"
							type="password"
							register={form.register("password")}
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
									isValidated={
										validatingErr.confirmedPassword
									}
									criteria="Password must match"
									isSignUp
								/>
							</div>
						)}
					</div>

					<div className="relative mb-2 flex flex-col gap-2">
						<CustomInput
							id="confirmPassword"
							htmlFor="confirmPassword"
							label="Create Password"
							placeholder="Confirm Password"
							type="password"
							register={form.register("confirmPassword")}
						/>
					</div>
				</div>

				<Button
					fullWidth
					disabled={!form.formState.isValid || signup.isLoading}
				>
					{signup.isLoading ? <Spinner /> : "Signup"}
				</Button>
			</form>
		</CardView>
	);
};

export default SignupForm;
