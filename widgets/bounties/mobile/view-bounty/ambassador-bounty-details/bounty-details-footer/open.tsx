"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Pending } from "@/components/kyc";
import { ENVS } from "@/config";
import { kycIsPending } from "@/lib/actions";
import { useUserState } from "@/lib/store/account";
import { useKyc } from "@/lib/store/kyc";

import { AmbassadorPrivateBountyCtas } from "./private";

export interface AmbassadorOpenBountyCtasProps {
	bountyId: string;
	inviteId: string | null;
	hasAlreadyApplied: boolean;
	hasBeenInvited: boolean;
	acceptedSlot: {
		acceptedSlot: number;
		totalSlot: number;
	};
	noSlot: boolean;
	isOtherPartner?: boolean;
}

export const AmbassadorOpenBountyCtas: FC<AmbassadorOpenBountyCtasProps> = ({
	bountyId,
	hasBeenInvited,
	inviteId,
	hasAlreadyApplied,
	acceptedSlot,
	noSlot,
	isOtherPartner,
}) => {
	const user = useUserState();
	const router = useRouter();
	const { setOpenKycModal } = useKyc();

	const accountData = useUserState();

	if (kycIsPending(accountData)) {
		return <Pending />;
	}

	if (isOtherPartner) return null;

	if (hasBeenInvited)
		return (
			<AmbassadorPrivateBountyCtas
				inviteId={inviteId}
				hasBeenInvited={hasBeenInvited}
				acceptedSlot={acceptedSlot}
				bountyId={bountyId}
			/>
		);

	return (
		<div className="mx-auto mb-20 mt-8 w-full max-w-[348px]">
			{!hasAlreadyApplied && (
				<Button
					variant="white"
					fullWidth
					onClick={() => {
						if (!ENVS.isProduction || user.kyc) {
							router.push(`/bounties/${bountyId}/apply`);
						} else {
							setOpenKycModal(true);
						}
					}}
					disabled={noSlot}
				>
					{noSlot ? "No Available Spot" : "Apply"}
				</Button>
			)}
		</div>
	);
};
