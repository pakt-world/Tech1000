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

export const OTPDeactivateSuccess = (): React.JSX.Element => {
	const { closeModal } = useEmail2FAState();

	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-4">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<Text.h3 size="xs" className="!text-white">
					Email
				</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-white"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="sm" className="my-auto !text-white">
				You have successfully deactivated Email OTP.
			</Text.p>

			<Image
				src="/icons/success.gif"
				className="my-auto"
				width={200}
				height={200}
				alt=""
			/>

			<Button variant="white" onClick={closeModal} fullWidth>
				Done
			</Button>
		</div>
	);
};
