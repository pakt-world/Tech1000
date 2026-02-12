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
import { useAuthApp2FAState } from "@/lib/store/security";

export const DeactivateAuthAppSuccess = (): React.JSX.Element => {
	const { closeModal } = useAuthApp2FAState();
	return (
		<div className="flex w-full shrink-0 flex-col items-center gap-4">
			<div className="flex w-full flex-row justify-between gap-2 text-center">
				<div className="h-6 w-6" />
				<Text.h3 size="xs" className="!text-white">
					Authenticator App
				</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-white"
					onClick={closeModal}
				/>
			</div>
			<Text.p size="sm" className="!text-white">
				You have successfully deactivated Auth 2FA.
			</Text.p>

			<Image
				src="/icons/success.gif"
				className="my-auto"
				width={200}
				height={200}
				alt=""
			/>

			<Button variant="default" onClick={closeModal} fullWidth>
				Done
			</Button>
		</div>
	);
};
