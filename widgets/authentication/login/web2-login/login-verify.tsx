"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import ReactOTPInput from "react-otp-input";
import type * as z from "zod";
import { Timer } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { toast } from "@/components/common/toaster";
import { useLoginOTP, useResendLoginOTP } from "@/lib/api/auth";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { AUTH_TOKEN_KEY, formatCountdown } from "@/lib/utils";
import { otpSchema } from "@/lib/validations";
import CardView from "../../../../components/common/card-view";

type FormValues = z.infer<typeof otpSchema>;

const LoginVerificationForm = (): React.JSX.Element => {
	const [countdown, setCountdown] = useState(0);
	const [isResendDisabled, setIsResendDisabled] = useState(false);

	const router = useRouter();
	const resendOTP = useResendLoginOTP();
	const loginOTP = useLoginOTP();
	const searchParams = useSearchParams();

	const token = searchParams.get("token");
	const verifyType = searchParams.get("type");
	const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	useEffect(() => {
		if (verifyType === TwoFactorAuthEnums.EMAIL) {
			setIsResendDisabled(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isResendDisabled) {
			setCountdown(60);
			const timer = setInterval(() => {
				setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
			}, 1000);
			const timeout = setTimeout(() => {
				setIsResendDisabled(false);
			}, 60000);

			return () => {
				clearInterval(timer);
				clearTimeout(timeout); // Ensure the timeout is also cleared
			};
		}
		// Add a return statement for the case when isResendDisabled is false
		return () => {};
	}, [isResendDisabled]);

	const form = useForm<FormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<FormValues> = ({ otp }) => {
		if (typeof verifyType !== "string" || typeof token !== "string") {
			router.push("/signup");
			return;
		}
		loginOTP.mutate(
			{
				code: otp,
				tempToken: token,
			},
			{
				onSuccess: (data) => {
					// Set Timezone to localStorage
					localStorage.setItem(
						"5n0wf0rt_u53r_71m3z0n3",
						data.timeZone || browserTimeZone
					);
					setCookie(AUTH_TOKEN_KEY, data.token);
					router.push("/overview");
				},
			}
		);
	};

	const handleResendOTP = (): void => {
		const email = searchParams.get("email");

		if (typeof email !== "string") {
			router.push("/signup");
			return;
		}

		resendOTP.mutate(
			{
				email,
			},
			{
				onSuccess: () => {
					setIsResendDisabled(true);
					toast.success("OTP sent successfully");
				},
			}
		);
	};

	return (
		<CardView className="!border-1 !border-lemon-green sm:max-w-[600px]">
			<form
				className="flex w-full flex-col items-center"
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
											className="!h-[46px] !w-full !select-none !rounded-md border !border-neutral-600  border-opacity-30 !bg-[#FCFCFD1A] px-3 py-2 !text-base !text-white placeholder:!text-[#72777A] focus:outline-none sm:!w-[46px]"
										/>
									)}
								/>
							);
						}}
					/>

					<Button
						fullWidth
						disabled={loginOTP.isLoading || !form.formState.isValid}
					>
						{loginOTP.isLoading ? <Spinner /> : "Verify Email"}
					</Button>

					{verifyType === TwoFactorAuthEnums.EMAIL && (
						<div className="flex w-full flex-col items-center gap-4">
							<span className="text-white">
								{formatCountdown(countdown)}
							</span>
							<div className="w-full max-w-[150px] !border-white dark:!border-white">
								<Button
									type="button"
									size="xs"
									fullWidth
									variant="outline"
									onClick={handleResendOTP}
									className="!border-white dark:!border-white"
									disabled={
										resendOTP.isLoading || isResendDisabled
									}
								>
									<span className="flex flex-row items-center gap-2">
										<Timer
											size={16}
											className="text-white"
										/>
										{resendOTP.isLoading ? (
											<Spinner size={16} />
										) : (
											"Resend OTP"
										)}
									</span>
								</Button>
							</div>
						</div>
					)}
				</div>
			</form>
		</CardView>
	);
};

export default LoginVerificationForm;
