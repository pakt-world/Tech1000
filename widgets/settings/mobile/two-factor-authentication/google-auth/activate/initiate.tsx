"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { XCircleIcon } from "lucide-react";
import Image from "next/image";
import { Text } from "pakt-ui";

// import { useActivateAuthApp2FA, useDeactivateAuthApp2FA, useInitializeAuthApp2FA } from "@/lib/api";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { type SlideItemProps } from "@/components/common/slider";
import { toast } from "@/components/common/toaster";
import { useInitialize2FA } from "@/lib/api/2fa";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { useAuthApp2FAState } from "@/lib/store/security";

export const InitiateAuthApp = ({
	goToNextSlide,
}: SlideItemProps): React.JSX.Element => {
	const { mutateAsync, isLoading } = useInitialize2FA();
	const { setSecret, setQrCode, closeModal } = useAuthApp2FAState();

	const handleInitiateAuthApp = async (): Promise<void> => {
		try {
			const data = await mutateAsync({
				type: TwoFactorAuthEnums.AUTHENTICATOR,
			});
			if (data.qrCodeUrl) {
				setSecret(data?.secret as string);
				setQrCode(data.qrCodeUrl);
				goToNextSlide?.();
			} else toast.error("An Error Occurred, Try Again!!!");
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-14 text-center">
			<div className="flex w-full flex-row justify-between">
				<Text.h3 size="xs" className="!text-white">
					Authenticator App
				</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-white"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="base" className="max-w-xs !text-white">
				To begin, you will need to install an Authenticator app on your
				phone.
			</Text.p>
			<div className="my-auto flex -translate-x-7 items-center">
				<Image
					src="/icons/authenticator-app.svg"
					width={150}
					height={210}
					alt=""
				/>
			</div>
			<Button
				onClick={handleInitiateAuthApp}
				className="mt-auto w-full"
				fullWidth
				variant="default"
			>
				{isLoading ? <Spinner /> : "Next"}
			</Button>
		</div>
	);
};
