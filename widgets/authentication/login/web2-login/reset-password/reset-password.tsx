"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { type ReadonlyURLSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { Spinner } from "@/components/common/loader";
import { PasswordCriteria } from "@/components/common/password-criteria";
import { useResetPassword } from "@/lib/api/auth";
import { spChars } from "@/lib/utils";
import { resetPasswordSchema } from "@/lib/validations";
import success from "@/lottiefiles/success.json";
import CardView from "../../../../../components/common/card-view";
import { CustomInput } from "../../../../../components/common/custom-input";
import Lottie from "@/components/common/lottie";

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm({
	otp,
	token,
}: {
	searchParams: ReadonlyURLSearchParams;
	otp: string;
	token: string;
}): React.JSX.Element {
	const changePassword = useResetPassword();
	const isCompleted = false;
	const loading = changePassword.isLoading;
	const router = useRouter();

	const resetForm = useForm<ResetFormValues>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmit: SubmitHandler<ResetFormValues> = (values) => {
		changePassword.mutate(
			{ tempToken: token, token: otp, password: values.password },
			{
				onSuccess: () => {
					router.push("/login");
				},
			}
		);
	};

	const { password } = resetForm.getValues();
	const { confirmPassword } = resetForm.getValues();

	const passwordWatch = resetForm.watch("password");
	const confirmPasswordWatch = resetForm.watch("confirmPassword");

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
		<>
			<Container className="absolute right-4 top-8 flex h-max w-full items-center justify-end sm:right-5 2xl:top-[70px]">
				<Button
					variant="white"
					className={`relative hidden max-w-[77.71px] px-5 py-2 font-bold ${!loading && "block"}`}
					asChild
				>
					<Link href="/login">Login</Link>
				</Button>
			</Container>
			{!isCompleted && (
				<Container className="z-[2] flex size-full max-w-2xl flex-col items-center justify-center gap-6">
					<div className="flex flex-col items-center gap-2 text-center text-white">
						<h3 className="font-sans text-2xl font-bold sm:text-3xl">
							Reset Password
						</h3>
						<p className="font-sans text-base">
							Choose a new password for your account
						</p>
					</div>
					<CardView className="max-w-[600px]">
						<form
							onSubmit={resetForm.handleSubmit(onSubmit)}
							className="relative z-[100] mx-auto flex w-full max-w-[600px] flex-col items-center gap-6"
						>
							<div className="flex w-full flex-col gap-4">
								<div className="relative mb-2 flex flex-col gap-2">
									<CustomInput
										htmlFor={"password"}
										label="Create Password"
										id="password"
										register={resetForm.register(
											"password"
										)}
										className="border-opacity-3 border !border-neutral-200"
										placeholder="create password"
										type="password"
									/>
									{isPasswordTyping && (
										<div className="flex flex-col gap-4 p-4 text-xs text-body">
											<PasswordCriteria
												isValidated={
													validatingErr.isMinLength
												}
												criteria="At least 8 characters"
												isSignUp
											/>
											<PasswordCriteria
												isValidated={
													validatingErr.checkLowerUpper
												}
												criteria="Upper and lower case characters"
												isSignUp
											/>
											<PasswordCriteria
												isValidated={
													validatingErr.checkNumber
												}
												criteria="1 or more numbers"
												isSignUp
											/>
											<PasswordCriteria
												isValidated={
													validatingErr.specialCharacter
												}
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
										htmlFor={"confirmPassword"}
										label="Confirm Password"
										id="confirmPassword"
										register={resetForm.register(
											"confirmPassword"
										)}
										className="border-opacity-3 border !border-neutral-200"
										placeholder="re-type password"
										type="password"
									/>
								</div>
							</div>

							<Button
								className=""
								fullWidth
								disabled={
									!resetForm.formState.isValid ||
									changePassword.isLoading
								}
							>
								{changePassword.isLoading ? (
									<Spinner />
								) : (
									"Reset Password"
								)}
							</Button>
						</form>
					</CardView>
				</Container>
			)}
			{isCompleted && (
				<Container className="mx-auto mt-14 flex w-full max-w-xl flex-col items-center justify-center gap-2 rounded-2xl border  border-white border-opacity-30 bg-white bg-opacity-30 p-8 px-[40px] py-10 text-center text-white backdrop-blur-md 2xl:mt-28">
					<div className="flex w-full max-w-[150px] items-center justify-center">
						<Lottie animationData={success} />
					</div>
					<h6 className="my-4 flex-wrap text-lg font-thin opacity-80">
						Password Reset Successful.
					</h6>
					<Button
						className=""
						fullWidth
						onClick={() => {
							router.push("/login");
						}}
					>
						Login
					</Button>
				</Container>
			)}
		</>
	);
}

export default ResetPasswordForm;
