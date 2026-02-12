"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { XCircleIcon } from "lucide-react";
import { Text } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";
import { useInitiate2FAEmail } from "@/lib/api/2fa";
import { useUserState } from "@/lib/store/account";
import { useEmail2FAState } from "@/lib/store/security";

export const InitiateDeactivateOTP = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { email } = useUserState();
	const { closeModal } = useEmail2FAState();
	const { mutateAsync, isLoading } = useInitiate2FAEmail();

	const handleInitiateOtp = async (): Promise<void> => {
		await mutateAsync();
		goToNextSlide?.();
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-8">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<Text.h3 size="xs" className="!text-white">
					Deactivate Email OTP
				</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-white"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="sm" className="my-auto !text-white">
				A code will be sent to{" "}
				<span className="text-success">{email}</span>
			</Text.p>

			<Button onClick={handleInitiateOtp} variant="white" fullWidth>
				{isLoading ? <Spinner /> : "Send OTP"}
			</Button>
		</div>
	);
};
