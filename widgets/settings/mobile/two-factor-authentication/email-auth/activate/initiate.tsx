"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { XCircleIcon } from "lucide-react";
import Image from "next/image";
import { Text } from "pakt-ui";

// import { useActivateEmailOTP, useDeactivateEmailOTP, useIssueEmailOTP, useSendEmailOTP } from "@/lib/api";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";
import { useInitialize2FA } from "@/lib/api/2fa";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { useEmail2FAState } from "@/lib/store/security";

export const InitiateActivateOTP = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { email } = useUserState();
	const { closeModal } = useEmail2FAState();
	const { mutateAsync, isLoading } = useInitialize2FA();

	const handleInitiateOtp = async (): Promise<void> => {
		await mutateAsync({ type: TwoFactorAuthEnums.EMAIL });
		goToNextSlide?.();
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center justify-center gap-8 p-6">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<Text.h3 size="xs" className="!text-white">
					Email Authentication
				</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-white"
					onClick={closeModal}
				/>
			</div>

			<Text.p size="base" className="!text-white max-sm:text-center">
				A code will be sent to{" "}
				<span className="text-success">{email}</span>
			</Text.p>
			<div className="m-auto flex items-center">
				<Image
					src="/icons/email-auth.svg"
					width={150}
					height={210}
					alt=""
				/>
			</div>

			<Button onClick={handleInitiateOtp} variant="default" fullWidth>
				{isLoading ? <Spinner /> : "Send Code"}
			</Button>
		</div>
	);
};
