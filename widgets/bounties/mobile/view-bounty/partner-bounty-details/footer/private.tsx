"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import type React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Pending } from "@/components/kyc";
import { kycIsPending } from "@/lib/actions";
import { useUserState } from "@/lib/store/account";

export interface PartnerPrivateBountyCtasProps {
	bountyId: string;
	deletePage: () => void;
	skills?: string[];
}

export const PartnerPrivateBountyCtas: React.FC<
	PartnerPrivateBountyCtasProps
> = ({ bountyId, skills = [], deletePage }) => {
	const router = useRouter();
	const accountData = useUserState();

	if (kycIsPending(accountData)) {
		return <Pending />;
	}
	return (
		<div className="mb-20 mt-auto flex w-full flex-col items-center justify-between gap-4">
			<Button
				variant="white"
				fullWidth
				onClick={() => {
					router.push(
						`/members${skills != null && skills?.length > 0 ? `?skills=${skills?.join(",")}` : ""}`
					);
				}}
			>
				Find Talent
			</Button>
			<div className="flex w-full max-w-sm items-center gap-2">
				<Button
					fullWidth
					variant="destructive"
					onClick={deletePage}
					className="border border-red-500 bg-transparent"
				>
					Delete Bounty
				</Button>
				<Button
					fullWidth
					variant="outline"
					onClick={() => {
						router.push(`/bounties/${bountyId}/edit`);
					}}
				>
					Edit Bounty
				</Button>
			</div>
		</div>
	);
};
