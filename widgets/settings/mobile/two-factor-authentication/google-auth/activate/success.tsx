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
import { useGetAccount } from "@/lib/api/account";
import { useAuthApp2FAState } from "@/lib/store/security";

export const ActivateAuthAppSuccess = (): React.JSX.Element => {
	const { closeModal } = useAuthApp2FAState();
	const { refetch: fetchAccount, isFetching } = useGetAccount();
	const Close = async (): Promise<void> => {
		if (!isFetching) fetchAccount();
		closeModal();
	};
	return (
		<div className="flex w-full shrink-0 flex-col items-center">
			<div className="flex w-full flex-row justify-between">
				<Text.h3 size="xs" className="!text-white">
					Authenticator App
				</Text.h3>
				<XCircleIcon
					className="my-auto cursor-pointer text-white"
					onClick={Close}
				/>
			</div>

			<Image
				src="/icons/success.gif"
				className="my-auto"
				width={230}
				height={230}
				alt=""
			/>
			<Text.p size="base" className="text-center !text-white">
				You have successfully secured your account with 2FA. You will
				input your Authentication App’s generated code each time you
				want to login or make a withdrawal.
			</Text.p>
			<Button
				className="mt-auto w-full"
				variant="default"
				onClick={Close}
				fullWidth
			>
				Done
			</Button>
		</div>
	);
};
