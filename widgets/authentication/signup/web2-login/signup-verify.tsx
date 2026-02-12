"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie, setCookie } from "cookies-next";
import { Timer } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import ReactOTPInput from "react-otp-input";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { useResendOTP, useVerifyEmail } from "@/lib/api/auth";
import { axios } from "@/lib/axios";
import { useUserState } from "@/lib/store/account";
import {
	AUTH_TOKEN_KEY,
	createQueryStrings,
	formatCountdown,
} from "@/lib/utils";
import { otpSchema } from "@/lib/validations";
import CardView from "../../../../components/common/card-view";

type FormValues = z.infer<typeof otpSchema>;

const SignupVerificationForm = (): React.JSX.Element => {
	const { setUser } = useUserState();
	const [countdown, setCountdown] = useState(0);
	const [isResendDisabled, setIsResendDisabled] = useState(true);

	const router = useRouter();
	const resendOTP = useResendOTP();
	const verifyEmail = useVerifyEmail();
	const searchParams = useSearchParams();

	const userToken = getCookie(AUTH_TOKEN_KEY);

	const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

	useEffect(() => {
		if (userToken !== undefined && userToken !== null && userToken !== "") {
			axios.defaults.headers.common.Authorization = `Bearer ${userToken}`;
		}
		return () => {
			axios.defaults.headers.common.Authorization = "";
		};
	}, [userToken]);

	const form = useForm<FormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<FormValues> = ({ otp }) => {
		const email = searchParams.get("email");
		const token = searchParams.get("token");

		if (typeof email !== "string" || typeof token !== "string") {
			router.push("/signup");
			return;
		}

		verifyEmail.mutate(
			{
				otp,
				token,
			},
			{
				onSuccess: (data) => {
					// Set Timezone to localStorage
					localStorage.setItem(
						"5n0wf0rt_u53r_71m3z0n3",
						data.timeZone || browserTimeZone
					);

					setCookie(AUTH_TOKEN_KEY, data.token);

					setUser(data);
					router.push("/onboarding");
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
				onSuccess: (data) => {
					setIsResendDisabled(true);
					router.push(
						`/signup/verify?${createQueryStrings([
							{
								name: "email",
								value: email,
							},
							{
								name: "token",
								value: data.tempToken.token,
							},
						])}`
					);
				},
			}
		);
	};

	return (
		<CardView className=" !border-lemon-green sm:max-w-[600px]">
			<form
				className="mx-auto flex w-full flex-col items-center gap-6 "
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="flex w-full flex-col items-center justify-center gap-4 sm:min-w-[320px]">
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
											inputMode="numeric"
											className="focus:ring-ink-darker !h-[46px] !w-full !select-none !rounded-md !border-neutral-600 border-opacity-30 !bg-[#FCFCFD1A] px-3 py-2 !text-base !text-white placeholder:!text-[#72777A] focus:outline-none sm:!w-[46px]"
										/>
									)}
								/>
							);
						}}
					/>

					<Button
						fullWidth
						disabled={
							verifyEmail.isLoading || !form.formState.isValid
						}
						className="w-full max-w-[320px] touch-manipulation"
					>
						{verifyEmail.isLoading ? <Spinner /> : "Verify Email"}
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
									!(resendOTP.isLoading || isResendDisabled)
										? handleResendOTP
										: () => {}
								}
								disabled={
									resendOTP.isLoading || isResendDisabled
								}
								className="!border-white !bg-none !text-white"
								style={{
									opacity:
										resendOTP.isLoading || isResendDisabled
											? 0.2
											: 1,
								}}
							>
								<span className="flex flex-row items-center gap-2">
									<Timer size={16} className="text-white" />
									{resendOTP.isLoading ? (
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
	);
};

export default SignupVerificationForm;
