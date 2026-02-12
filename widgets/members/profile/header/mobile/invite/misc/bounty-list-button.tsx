"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { PageEmpty } from "@/components/common/page-empty";
import { isBountyDeliverable } from "@/lib/actions";
import {
	useCreateSlotForBounty,
	useGetBountyById,
	useInviteTalentToBounty,
} from "@/lib/api/bounty";
import { type CollectionProps } from "@/lib/types/collection";
import { filterEmptyStrings } from "@/lib/utils";

interface BountyListProps {
	bounties: CollectionProps[];
	talentId: string;
	bountyId: string;
}

export const BountyListButton = ({
	bounties,
	talentId,
	bountyId,
}: BountyListProps): ReactElement | null => {
	const router = useRouter();
	const bounty = bounties.find((b) => b._id === bountyId) as CollectionProps;

	const bountyQuery = useGetBountyById({ bountyId: bounty?._id });
	const inviteTalent = useInviteTalentToBounty({ talentId, bounty });

	// Get Bounty data to update meta data for Spots
	const deliverables = bounty?.collections
		.filter(isBountyDeliverable)
		.map((collection) => collection.name);

	const updateBountyToAcceptedSlotData = {
		name: bounty?.name ?? "",
		category: bounty?.category ?? "",
		paymentFee: (bounty?.paymentFee ?? 0) / Number(bounty?.meta?.slotCount),
		isPrivate: bounty?.isPrivate ?? false,
		description: bounty?.description ?? "",
		deliveryDate: bounty?.deliveryDate
			? format(new Date(bounty?.deliveryDate), "yyyy-MM-dd")
			: "",
		tags: filterEmptyStrings([
			bounty?.tagsData[0] ?? "",
			bounty?.tagsData[1] ?? "",
			bounty?.tagsData[2] ?? "",
		]),
		meta: {
			...bounty?.meta,
		},
	};

	const createSlot = useCreateSlotForBounty({ deliverables });

	if (bounties.length === 0)
		return <PageEmpty label="Your Created Bounties Will Appear Here" />;

	return (
		<div className="fixed bottom-0 w-full bg-primary px-4 py-4">
			<Button
				fullWidth
				variant="white"
				disabled={!bountyId}
				onClick={() => {
					createSlot.mutate(
						{
							parent: bounty?._id,
							...updateBountyToAcceptedSlotData,
							meta: {
								talentId,
								...updateBountyToAcceptedSlotData.meta,
							},
						},
						{
							onSuccess: ({ _id }) => {
								inviteTalent.mutate(
									{
										applicationId: _id,
										talentId,
									},
									{
										onSuccess: () => {
											bountyQuery.refetch();
											router.push(
												`/bounties/${bountyId}/applicants?tab=invited`
											);
										},
									}
								);
							},
						}
					);
				}}
			>
				{createSlot.isLoading || inviteTalent.isLoading ? (
					<Spinner />
				) : (
					"Send Invite"
				)}
			</Button>
		</div>
	);
};
