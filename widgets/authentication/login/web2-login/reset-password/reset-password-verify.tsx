"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { Timer } from "lucide-react";
import { type ReadonlyURLSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import ReactOTPInput from "react-otp-input";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { Spinner } from "@/components/common/loader";
import {
	useRequestPasswordReset,
	useVerifyResetPassword,
} from "@/lib/api/auth";
import { formatCountdown } from "@/lib/utils";
import { otpSchema } from "@/lib/validations";
import CardView from "../../../../../components/common/card-view";

type FormValues = z.infer<typeof otpSchema>;

function ResetPasswordVerificationForm({
	setShowResetForm,
	setOtp,
	searchParams,
	email,
	token,
}: {
	setShowResetForm: () => void;
	setOtp: (otp: string) => void;
	searchParams: ReadonlyURLSearchParams;
	email: string;
	token: string;
}): React.JSX.Element {
	const [countdown, setCountdown] = useState(0);
	const [isResendDisabled, setIsResendDisabled] = useState(true);
	const requestPasswordReset = useRequestPasswordReset();

	const router = useRouter();
	const verifyResetPassword = useVerifyResetPassword();

	useEffect(() => {
		if (isResendDisabled) {
			setCountdown(60);
			const timer = setInterval(() => {
				setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
			}, 1000);
			setTimeout(() => {
				setIsResendDisabled(false);
			}, 60000);

			return () => {
				clearInterval(timer);
			};
		}
		return () => {};
	}, [isResendDisabled]);

	const form = useForm<FormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<FormValues> = ({ otp }) => {
		// const email = searchParams.get('email');
		// const token = searchParams.get('token');

		if (typeof email !== "string" || typeof token !== "string") {
			router.push("/login");
			return;
		}

		// verifyResetPassword.mutate(
		//   {
		//     token: otp,
		//     tempToken: token,
		//   },
		//   {
		//     onSuccess: () => {
		setOtp(otp);
		setShowResetForm();
		//       return;
		//     },
		//   },
		// );
	};

	const handleResendOTP = (): void => {
		const email = searchParams.get("email");

		if (typeof email !== "string") {
			router.push("/login");
			return;
		}

		requestPasswordReset.mutate(
			{
				email,
			},
			{
				onSuccess: () => {
					setIsResendDisabled(true);
				},
			}
		);
	};

	return (
		<Container className="z-[2] flex size-full max-w-2xl flex-col items-center justify-center gap-6">
			<div className="flex flex-col items-center gap-2 text-center text-white">
				<h3 className="font-sans text-2xl font-bold sm:text-3xl">
					Reset Password Code
				</h3>
				<p className="font-sans text-base">
					A code has been sent to your email address. Enter it to
					verify your reset password.
				</p>
			</div>
			<CardView className="max-w-[600px]">
				<form
					className="relative z-[100] mx-auto flex w-full flex-col items-center"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="flex w-fit flex-col gap-4">
						<Controller
							name="otp"
							control={form.control}
							render={({ field: { onChange, value } }) => {
								return (
									<ReactOTPInput
										value={value}
										onChange={onChange}
										shouldAutoFocus
										numInputs={6}
										containerStyle="gap-3 flex"
										renderInput={(props) => (
											<input
												{...props}
												className="focus:ring-ink-darker !h-[46px] !w-full !select-none !rounded-md border !border-neutral-600 border-opacity-30 !bg-[#FCFCFD1A] px-3 py-2 !text-base !text-white placeholder:!text-[#72777A] focus:outline-none sm:!w-[46px]"
											/>
										)}
									/>
								);
							}}
						/>

						<Button
							fullWidth
							disabled={
								verifyResetPassword.isLoading ||
								!form.formState.isValid
							}
						>
							{verifyResetPassword.isLoading ? (
								<Spinner />
							) : (
								"Reset Password"
							)}
						</Button>

						<div className="flex w-full flex-col items-center gap-4">
							<span className="text-white">
								{formatCountdown(countdown)}
							</span>
							<div className="w-full max-w-[150px]">
								<Button
									size="xs"
									fullWidth
									variant="outline"
									onClick={
										!(
											requestPasswordReset.isLoading ||
											isResendDisabled
										)
											? handleResendOTP
											: () => {}
									}
									disabled={
										requestPasswordReset.isLoading ||
										isResendDisabled
									}
									className="!border-white !bg-none !text-white"
									style={{
										opacity:
											requestPasswordReset.isLoading ||
											isResendDisabled
												? 0.2
												: 1,
									}}
								>
									<span className="flex flex-row gap-2">
										<Timer
											size={16}
											className="text-white"
										/>
										{requestPasswordReset.isLoading ? (
											<Spinner size={16} />
										) : (
											"Resend Code"
										)}
									</span>
								</Button>
							</div>
						</div>
					</div>
				</form>
			</CardView>
		</Container>
	);
}

export default ResetPasswordVerificationForm;
