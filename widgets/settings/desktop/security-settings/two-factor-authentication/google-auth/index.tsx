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
import { useAuthApp2FAState, useMscState } from "@/lib/store/security";

import { InitiateAuthApp } from "./activate/initiate";
import { ScanAuthApp } from "./activate/scan";
import { ActivateAuthAppSuccess } from "./activate/success";
import { VerifyActivateAuthApp } from "./activate/verify";
import { DeactivateAuthAppSuccess } from "./deactivate/success";
import { VerifyDeactivateAuthApp } from "./deactivate/verify";

interface AuthApp2FAProps {
	isEnabled: boolean;
	disabled?: boolean;
}

export const GoogleAuth2FA = ({
	isEnabled,
	disabled,
}: AuthApp2FAProps): React.JSX.Element => {
	const { isModalOpen, closeModal, openModal } = useAuthApp2FAState();
	const { isInput6DigitCode } = useMscState();

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
					<Checkbox checked={isEnabled} className="checkbox_style" />
				</div>
				<div className="flex h-[100px] items-center">
					<Image
						src="/icons/authenticator-app.svg"
						width={115}
						height={117}
						alt=""
					/>
				</div>
				<Text.p size="lg" className="!text-white">
					Authenticator app
				</Text.p>
			</Button>

			<Modal
				isOpen={isModalOpen}
				onOpenChange={closeModal}
				className={`!overflow-hidden rounded-2xl bg-ink-dark/90 p-6 max-sm:scale-[0.9] ${
					isInput6DigitCode ? "max-h-[266px]" : "max-h-auto"
				} `}
				disableClickOutside
			>
				<div className="absolute inset-0 right-0 bg-cover bg-no-repeat" />
				{isActive ? (
					<Slider
						items={[
							{ SlideItem: VerifyDeactivateAuthApp },
							{ SlideItem: DeactivateAuthAppSuccess },
						]}
					/>
				) : (
					<Slider
						items={[
							{ SlideItem: InitiateAuthApp },
							{ SlideItem: ScanAuthApp },
							{ SlideItem: VerifyActivateAuthApp },
							{ SlideItem: ActivateAuthAppSuccess },
						]}
					/>
				)}
			</Modal>
		</>
	);
};
