"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/headless-modal";
import { Pending } from "@/components/kyc";
import { ENVS } from "@/config";
import { KycVerificationStatus } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { useKyc } from "@/lib/store/kyc";

import { TalentBountyApplyModal } from "../modal/apply";
import { TalentPrivateBountyCtas } from "./private";

export interface TalentOpenBountyCtasProps {
	bountyId: string;
	bountyCreator: string;
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

export const TalentOpenBountyCtas: FC<TalentOpenBountyCtasProps> = ({
	bountyId,
	bountyCreator,
	hasBeenInvited,
	inviteId,
	hasAlreadyApplied,
	acceptedSlot,
	noSlot,
	isOtherPartner,
}) => {
	const user = useUserState();
	const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
	const { setOpenKycModal } = useKyc();

	const { kyc, kycStatus } = useUserState();

	if (
		!kyc &&
		(kycStatus === KycVerificationStatus.REVIEW ||
			kycStatus === KycVerificationStatus.SUBMITTED)
	) {
		return <Pending />;
	}

	if (isOtherPartner) return null;

	if (hasBeenInvited)
		return (
			<TalentPrivateBountyCtas
				inviteId={inviteId}
				hasBeenInvited={hasBeenInvited}
				acceptedSlot={acceptedSlot}
				bountyId={bountyId}
			/>
		);

	return (
		<div className="ml-auto w-full max-w-[200px]">
			{!hasAlreadyApplied && (
				<Button
					variant="white"
					fullWidth
					onClick={() => {
						if (!ENVS.isProduction || user.kyc) {
							setIsApplyModalOpen(true);
						} else {
							setOpenKycModal(true);
						}
					}}
					disabled={noSlot}
				>
					{noSlot ? "No Available Spot" : "Apply"}
				</Button>
			)}

			<Modal
				isOpen={isApplyModalOpen}
				closeModal={() => {
					setIsApplyModalOpen(false);
				}}
			>
				<TalentBountyApplyModal
					bountyId={bountyId}
					bountyCreator={bountyCreator}
				/>
			</Modal>
		</div>
	);
};
