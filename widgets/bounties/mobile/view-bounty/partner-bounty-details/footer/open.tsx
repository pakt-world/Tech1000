"use partner";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import Link from "next/link";
import { type FC } from "react";

import { Button } from "@/components/common/button";
import { Pending } from "@/components/kyc";
import { kycIsPending } from "@/lib/actions";
import { useUserState } from "@/lib/store/account";

export interface PartnerOpenBountyCtasProps {
	bountyId: string;
	deletePage: () => void;
	acceptedSlot: {
		acceptedSlot: number;
		totalSlot: number;
	};
	bountyNotFunded: boolean;
}

export const PartnerOpenBountyCtas: FC<PartnerOpenBountyCtasProps> = ({
	bountyId,
	deletePage,
	acceptedSlot,
	bountyNotFunded,
}) => {
	const accountData = useUserState();

	if (kycIsPending(accountData)) {
		return <Pending />;
	}
	return (
		<div className="mb-20 flex w-full flex-col items-center gap-4">
			{!bountyNotFunded && (
				<Button variant="white" fullWidth asChild>
					<Link href={`/bounties/${bountyId}/applicants`}>
						View Applicants
					</Link>
				</Button>
			)}

			<div className="flex w-full flex-wrap items-center gap-2">
				{bountyNotFunded && (
					<Button variant="white" fullWidth asChild>
						<Link href={`/bounties/${bountyId}/make-deposit`}>
							Fund Bounty
						</Link>
					</Button>
				)}
				{acceptedSlot.acceptedSlot === 0 && bountyNotFunded && (
					<Button fullWidth variant="outline" asChild>
						<Link href={`/bounties/${bountyId}/edit`}>
							Edit Bounty
						</Link>
					</Button>
				)}
				{acceptedSlot.acceptedSlot === 0 && (
					<Button
						fullWidth
						variant="destructive"
						onClick={deletePage}
						className="border border-red-500 bg-transparent"
					>
						Delete Bounty
					</Button>
				)}
			</div>
		</div>
	);
};
