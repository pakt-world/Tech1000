"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactElement, useState } from "react";

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
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type CollectionProps } from "@/lib/types/collection";
import { filterEmptyStrings } from "@/lib/utils";

import { BountyCard } from "./bounty-card";

interface BountyListProps {
	bounties: CollectionProps[];
	talentId: string;
	setIsOpen: (isOpen: boolean) => void;
	rates: ExchangeRateRecord | undefined;
}

export const BountyList = ({
	bounties,
	talentId,
	setIsOpen,
	rates,
}: BountyListProps): ReactElement | null => {
	const router = useRouter();
	// const firstBounty = bounties[0];
	const [bountyId, setBountyId] = useState<string>("");
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
		<div className="container_style flex flex-col gap-2 sm:h-full">
			<div className="bg-hover-gradient p-4 text-white">
				<div
					className="flex cursor-pointer items-center gap-2"
					onClick={() => {
						setIsOpen(false);
					}}
					onKeyDown={(event) => {
						// 'Enter' key or 'Space' key
						if (event.key === "Enter" || event.key === " ") {
							setIsOpen(false);
						}
					}}
					aria-label="Go Back"
					role="button"
					tabIndex={0}
				>
					<ChevronLeft size={24} strokeWidth={2} />
					<h2 className="text-2xl font-bold">Invite to Bounty</h2>
				</div>
			</div>
			<div className="px-4 pb-4 pt-[28px]">
				<p className="text-xl font-bold text-white">
					Select Bounty to assign talent to
				</p>
			</div>
			<div className="flex grow flex-col gap-4 overflow-y-auto px-4">
				{bounties.map((b) => {
					return (
						<BountyCard
							bounty={b}
							key={b._id}
							isSelected={bountyId === b._id}
							setBountyId={setBountyId}
							rates={rates}
						/>
					);
				})}
			</div>
			<div className="px-4 py-4">
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
		</div>
	);
};
