"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { XCircleIcon } from "lucide-react";
import { Text } from "pakt-ui";
import { useEffect } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

// import { useActivateAuthApp2FA, useDeactivateAuthApp2FA, useInitializeAuthApp2FA } from "@/lib/api";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { Spinner } from "@/components/common/loader";
import { OtpInput } from "@/components/common/otp-input";
import { type SlideItemProps } from "@/components/common/slider";
import { useDeActivate2FA } from "@/lib/api/2fa";
import { useAuthApp2FAState, useMscState } from "@/lib/store/security";

const otpSchema = z.object({
	otp: z.string().min(6).max(6),
});

type AuthAppOtpFormValues = z.infer<typeof otpSchema>;

export const VerifyDeactivateAuthApp = ({
	goToNextSlide,
	isActive,
}: SlideItemProps): React.JSX.Element => {
	const { closeModal } = useAuthApp2FAState();
	const { setIsInput6DigitCode } = useMscState();
	const { mutate, isLoading } = useDeActivate2FA();

	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<AuthAppOtpFormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<AuthAppOtpFormValues> = async ({ otp }) => {
		mutate(
			{ code: otp },
			{
				onSuccess: () => {
					goToNextSlide?.();
				},
			}
		);
	};
	useEffect(() => {
		if (isActive) {
			setIsInput6DigitCode?.(true);
		} else {
			setIsInput6DigitCode?.(false);
		}
	}, [isActive, setIsInput6DigitCode]);

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-4 text-center">
			<div className="flex w-full flex-col gap-4">
				<div className="flex w-full flex-row justify-between">
					<Text.h3 size="xs" className="!text-white">
						Authenticator App
					</Text.h3>
					<XCircleIcon
						className="my-auto cursor-pointer text-white"
						onClick={closeModal}
					/>
				</div>
				<Text.p size="base" className="!text-white">
					Enter the 6 digit code{" "}
				</Text.p>
			</div>
			<form
				className="flex w-full flex-col gap-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="relative mx-auto">
					<Controller
						name="otp"
						control={control}
						render={({ field: { onChange, value } }) => (
							<OtpInput
								value={value}
								onChange={onChange}
								numInputs={6}
							/>
						)}
					/>
					<div className="child:!relative child:!bottom-0 my-2 flex justify-center text-center">
						<InputErrorMessage message={errors.otp?.message} />
					</div>
				</div>

				<Button variant="default" fullWidth>
					{isLoading ? <Spinner /> : "Deactivate"}
				</Button>
			</form>
		</div>
	);
};
