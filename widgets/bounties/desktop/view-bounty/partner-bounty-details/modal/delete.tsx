"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { useDeleteBounty } from "@/lib/api/bounty";
import success from "@/lottiefiles/success2.json";
import Lottie from "@/components/common/lottie";

interface ClientDeleteBountyModalProps {
	bountyId: string;
	setModalOpen: (state: boolean) => void;
}

export const DeleteBountyModal: React.FC<ClientDeleteBountyModalProps> = ({
	bountyId,
	setModalOpen,
}) => {
	const deleteBountyMutation = useDeleteBounty();
	const router = useRouter();
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	if (showSuccessMessage) {
		return (
			<div className="container_style relative flex w-full max-w-xl flex-col gap-4 rounded-2xl p-6">
				<div className="absolute inset-0 right-0 !z-0 bg-gradient-piece bg-cover bg-no-repeat" />
				<div className="flex flex-col items-center gap-1">
					<div className="-mt-[4] max-w-[200px]">
						<Lottie animationData={success} loop={false} />
					</div>

					<h2 className="text-2xl font-medium text-white">
						Bounty Deleted
					</h2>
					<span className="text-white">
						This Bounty has been deleted.
					</span>
				</div>
			</div>
		);
	}
	return (
		<div className="container_style relative flex w-full max-w-xl flex-col gap-4 rounded-2xl p-6">
			<div className="absolute inset-0 right-0 z-0 bg-gradient-piece bg-cover bg-no-repeat" />
			<div className="z-10 flex flex-col items-center gap-4">
				<h2 className="text-2xl font-medium text-white">
					Delete Bounty
				</h2>
				<span className="text-center text-[#979C9E]">
					This action is irreversible. Once you delete the Bounty, all
					of its content and data will be permanently erased. The
					funds will be returned to your wallet.
				</span>
				<span className="font-bold text-white">
					Are you sure you want to proceed with the deletion?
				</span>
			</div>
			<div className="z-10 mt-auto flex w-full flex-row items-center justify-between gap-2">
				<Button
					fullWidth
					variant="white"
					onClick={() => {
						setModalOpen(false);
					}}
				>
					No, Cancel
				</Button>

				<Button
					fullWidth
					variant="outline"
					onClick={() => {
						deleteBountyMutation.mutate(
							{ id: bountyId },

							{
								onSuccess: () => {
									setShowSuccessMessage(true);
									setTimeout(() => {
										router.push("/bounties");
									}, 1000);
								},
							}
						);
					}}
					disabled={deleteBountyMutation.isLoading}
				>
					{deleteBountyMutation.isLoading ? (
						<Spinner />
					) : (
						"Yes, Proceed"
					)}
				</Button>
			</div>
		</div>
	);
};
