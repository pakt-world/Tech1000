"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { XCircleIcon } from "lucide-react";
import { Text } from "pakt-ui";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { Spinner } from "@/components/common/loader";
import { OtpInput } from "@/components/common/otp-input";
import { type SlideItemProps } from "@/components/common/slider";
import { useDeActivate2FA } from "@/lib/api/2fa";
import { useUserState } from "@/lib/store/account";
import { useEmail2FAState } from "@/lib/store/security";

const otpSchema = z.object({
	otp: z.string().min(6).max(6),
});

type EmailOtpFormValues = z.infer<typeof otpSchema>;

export const VerifyDeactivateOTP = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { closeModal } = useEmail2FAState();
	const { mutateAsync, isLoading } = useDeActivate2FA();
	const { email } = useUserState();

	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<EmailOtpFormValues>({
		resolver: zodResolver(otpSchema),
	});

	const onSubmit: SubmitHandler<EmailOtpFormValues> = async ({ otp }) => {
		await mutateAsync({ code: otp });
		goToNextSlide?.();
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-8">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<Text.h3 size="xs" className="!text-white">
					Email
				</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-white"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="sm" className="!text-body">
				Enter the 6 digit code sent to{" "}
				<span className="text-success">{email}</span>
			</Text.p>

			<form
				className="flex flex-col items-center gap-8"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="relative">
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
					<InputErrorMessage message={errors.otp?.message} />
				</div>

				<Button className="w-full" fullWidth variant="white">
					{isLoading ? <Spinner /> : "Deactivate"}
				</Button>
			</form>
		</div>
	);
};
