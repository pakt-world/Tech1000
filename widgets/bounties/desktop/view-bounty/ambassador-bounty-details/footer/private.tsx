"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { Pending } from "@/components/kyc";
import { kycIsPending } from "@/lib/actions";
import { useAcceptInvite, useDeclineInvite } from "@/lib/api/invites";
import { CollectionCategory } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";

export interface TalentPrivateBountyCtasProps {
	inviteId: string | null;
	hasBeenInvited: boolean;
	acceptedSlot: {
		acceptedSlot: number;
		totalSlot: number;
	};
	bountyId: string;
}

export const TalentPrivateBountyCtas = ({
	inviteId,
	hasBeenInvited,
	acceptedSlot,
	bountyId,
}: TalentPrivateBountyCtasProps) => {
	const router = useRouter();
	const acceptInvite = useAcceptInvite({ bountyId });
	const declineInvite = useDeclineInvite();

	const accountData = useUserState();

	if (kycIsPending(accountData)) {
		return <Pending />;
	}

	if (inviteId == null || !hasBeenInvited) return null;

	return (
		<div className="mt-auto flex w-full items-center justify-end">
			<div className="flex w-full max-w-sm items-center justify-end gap-4">
				{acceptedSlot.acceptedSlot >= acceptedSlot.totalSlot ? (
					<div />
				) : (
					<Button
						fullWidth
						size="lg"
						variant="outline"
						onClick={() => {
							declineInvite.mutate(
								{ id: inviteId },
								{
									onSuccess: () => {
										router.push("/overview");
									},
								}
							);
						}}
						className="w-full max-w-[150px]"
					>
						{declineInvite.isLoading ? <Spinner /> : "Decline"}
					</Button>
				)}

				<Button
					fullWidth
					size="lg"
					onClick={() => {
						acceptInvite.mutate(
							{ id: inviteId },
							{
								onSuccess: () => {
									router.push(
										`/bounties?bounties-type=${CollectionCategory.ASSIGNED}`
									);
								},
							}
						);
					}}
					variant="white"
					className="w-full max-w-[150px]"
					disabled={
						acceptedSlot.acceptedSlot >= acceptedSlot.totalSlot
					}
				>
					{acceptInvite.isLoading ? (
						<Spinner />
					) : acceptedSlot.acceptedSlot >= acceptedSlot.totalSlot ? (
						"Spot Filled"
					) : (
						"Accept Invite"
					)}
				</Button>
			</div>
		</div>
	);
};
