"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import Link from "next/link";
import type React from "react";

import { Button } from "@/components/common/button";
import { Pending } from "@/components/kyc";
import { kycIsPending } from "@/lib/actions";
import { useUserState } from "@/lib/store/account";

export interface ClientOpenBountyCtasProps {
	bountyId: string;
	openDeleteModal: () => void;
	acceptedSlot: {
		acceptedSlot: number;
		totalSlot: number;
	};
	bountyNotFunded: boolean;
}

export const ClientOpenBountyCtas: React.FC<ClientOpenBountyCtasProps> = ({
	bountyId,
	openDeleteModal,
	acceptedSlot,
	bountyNotFunded,
}) => {
	const accountData = useUserState();

	if (kycIsPending(accountData)) {
		return <Pending />;
	}
	return (
		<div className="mt-auto flex w-full items-center justify-between gap-4">
			{acceptedSlot.acceptedSlot > 0 ? (
				<div />
			) : (
				<Button
					fullWidth
					variant="destructive"
					onClick={openDeleteModal}
					className="max-w-[160px] border border-red-500 bg-transparent"
				>
					Delete Bounty
				</Button>
			)}

			<div className="flex w-full max-w-sm items-center justify-end gap-2">
				{acceptedSlot.acceptedSlot > 0 ? (
					<div />
				) : (
					bountyNotFunded && (
						<Button
							fullWidth
							variant="outline"
							className="max-w-[160px]"
							asChild
						>
							<Link href={`/bounties/${bountyId}/edit`}>
								Edit Bounty
							</Link>
						</Button>
					)
				)}
				{bountyNotFunded && (
					<Button
						variant="white"
						fullWidth
						className="max-w-[160px]"
						asChild
					>
						<Link href={`/bounties/${bountyId}/make-deposit`}>
							Fund Bounty
						</Link>
					</Button>
				)}
				{!bountyNotFunded && (
					<Button
						variant="white"
						fullWidth
						className="max-w-[160px]"
						asChild
					>
						<Link href={`/bounties/${bountyId}/applicants`}>
							View Applicants
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
};
