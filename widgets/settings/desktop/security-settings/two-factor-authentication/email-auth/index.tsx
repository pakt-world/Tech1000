"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { Text } from "pakt-ui";
import { useEffect, useState } from "react";

import { Button } from "@/components/common/button";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Checkbox } from "@/components/common/checkbox";
import { Modal } from "@/components/common/modal";
import { Slider } from "@/components/common/slider";
import { useEmail2FAState } from "@/lib/store/security";

import { InitiateActivateOTP } from "./activate/initiate";
import { OTPActivateSuccess } from "./activate/success";
import { VerifyActivateOTP } from "./activate/verify";
import { InitiateDeactivateOTP } from "./deactivate/initiate";
import { OTPDeactivateSuccess } from "./deactivate/success";
import { VerifyDeactivateOTP } from "./deactivate/verify";

interface Email2FAProps {
	isEnabled: boolean;
	disabled?: boolean;
}

export const EmailAuth2FA = ({
	isEnabled,
	disabled,
}: Email2FAProps): React.JSX.Element => {
	const { isModalOpen, closeModal, openModal } = useEmail2FAState();

	const [isActive, _setIsActive] = useState(isEnabled);
	useEffect(() => {
		if (!isModalOpen) _setIsActive(isEnabled);
	}, [isEnabled, isModalOpen]);

	return (
		<>
			<Button
				onClick={openModal}
				className="relative flex h-full shrink grow basis-0 cursor-pointer flex-col items-center gap-6 !bg-[#E8E8E833]/20 from-white via-transparent to-white p-4 px-7 py-9 backdrop-blur-lg disabled:cursor-not-allowed disabled:opacity-[0.5]"
				disabled={disabled}
				type="button"
			>
				<div className="absolute right-4 top-4">
					<Checkbox
						checked={isEnabled}
						className="h-6 w-6 !rounded-full border-rose-300 bg-white data-[state=checked]:bg-primary"
					/>
				</div>
				<div className="flex h-[100px] items-center">
					<Image
						src="/icons/email-auth.svg"
						width={115}
						height={117}
						alt=""
					/>
				</div>
				<Text.p size="lg" className="!text-white">
					Email Auth
				</Text.p>
			</Button>

			<Modal
				isOpen={isModalOpen}
				onOpenChange={closeModal}
				className=" rounded-2xl bg-ink-dark/90 p-6 max-sm:scale-[0.9]"
			>
				<div className="absolute inset-0 right-0 w-full bg-cover bg-no-repeat" />
				{isActive ? (
					<Slider
						items={[
							{ SlideItem: InitiateDeactivateOTP },
							{ SlideItem: VerifyDeactivateOTP },
							{ SlideItem: OTPDeactivateSuccess },
						]}
					/>
				) : (
					<Slider
						items={[
							{ SlideItem: InitiateActivateOTP },
							{ SlideItem: VerifyActivateOTP },
							{ SlideItem: OTPActivateSuccess },
						]}
					/>
				)}
			</Modal>
		</>
	);
};
