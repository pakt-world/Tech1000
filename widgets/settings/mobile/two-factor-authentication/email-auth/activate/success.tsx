"use client";

/* eslint-disable react/jsx-pascal-case */
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { XCircleIcon } from "lucide-react";
import Image from "next/image";
import { Text } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { useEmail2FAState } from "@/lib/store/security";

export const OTPActivateSuccess = (): React.JSX.Element => {
	const { closeModal } = useEmail2FAState();

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-4">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<Text.h3 size="xs" className="!text-white">
					Email Authentication
				</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-white"
					onClick={closeModal}
				/>
			</div>
			<Image
				src="/icons/success.gif"
				className="my-auto"
				width={230}
				height={230}
				alt=""
			/>
			<Text.p size="sm" className="!text-white">
				You have successfully secured your account with 2FA.
			</Text.p>

			<Button
				className="w-full"
				onClick={() => {
					closeModal();
				}}
				fullWidth
				variant="white"
			>
				Done
			</Button>
		</div>
	);
};
