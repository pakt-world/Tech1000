"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";
import { ChevronLeft } from "lucide-react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { useCreateKycSession } from "@/lib/api/kyc";
import { useKyc } from "@/lib/store/kyc";
import { useProductVariables } from "@/hooks/use-product-variables";

import { Spinner } from "../common/loader";

export const KycModal = (): JSX.Element => {
	const createSession = useCreateKycSession();
	const {
		openKycModal,
		setOpenKycModal,
		disableClickOutside,
		setDisableClickOutside,
	} = useKyc();

	const { variables } = useProductVariables();

	const handleCreateSession = (): void => {
		setOpenKycModal(false);
		createSession.mutate("", {
			onSuccess: (data) => {
				const url = data?.verification?.url;
				createVeriffFrame({
					url,
					onEvent: (msg) => {
						switch (msg) {
							case MESSAGES.CANCELED:
								break;
							default:
								break;
						}
					},
				});
			},
		});
	};
	return (
		<Modal
			isOpen={openKycModal}
			onOpenChange={() => {
				setOpenKycModal(!openKycModal);
			}}
			className="container_style h-fit max-w-[587px] !overflow-hidden rounded-2xl p-6"
			disableClickOutside={disableClickOutside}
		>
			<div className="relative flex w-full flex-col items-center justify-center gap-6">
				{disableClickOutside && (
					<Link
						href="/overview"
						className="absolute left-0 top-0 flex items-center gap-1 text-xs leading-[27px] tracking-wide text-cyan-600"
						onClick={() => {
							setOpenKycModal(false);
							setDisableClickOutside(false);
						}}
					>
						<ChevronLeft className="size-3" /> Go back to Overview
					</Link>
				)}
				<Image
					src="/images/user-identifier-card.png"
					width={133}
					height={104}
					className=""
					alt="user-identifier-card"
				/>
				<h3 className="text-2xl font-bold leading-[31.20px] tracking-wide text-white">
					Verify Your Identity
				</h3>
				<p className="text-center text-lg leading-[27px] tracking-wide text-white opacity-70">
					Global regulations require KYC to prevent money laundering
					and terrorist financing. {variables?.NAME} does not store
					your personal information, only the status of your KYC
					submission performed by industry-leader{" "}
					<Link
						href={process.env.NEXT_PUBLIC_VERIFF as string}
						target="_blank"
						className="text-lg leading-[27px] tracking-wide text-cyan-600 underline"
					>
						Veriff.
					</Link>
				</p>

				<Button
					variant="white"
					type="button"
					onClick={() => {
						handleCreateSession();
					}}
					className="w-full"
				>
					{createSession.isLoading ? (
						<Spinner size={18} />
					) : (
						"Setup KYC"
					)}
				</Button>
			</div>
		</Modal>
	);
};
