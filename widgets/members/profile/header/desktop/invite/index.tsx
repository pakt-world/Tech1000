"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import { isBountySlot, sortLatestFirst } from "@/lib/actions";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetBounties } from "@/lib/api/bounty";
import {
	CollectionCategory,
	CollectionInviteStatus,
	CollectionStatus,
} from "@/lib/enums";
import { useExchangeRateStore } from "@/lib/store/misc";
import { DesktopSheetWrapper } from "@/widgets/bounties/desktop/sheets/wrapper";

import { BountyList } from "./misc/bounty-list";

interface Props {
	isOpen: boolean;
	talentId: string;
	setIsOpen: (isOpen: boolean) => void;
}

const InviteTalent = ({
	talentId,
	setIsOpen,
}: {
	talentId: string;
	setIsOpen: (isOpen: boolean) => void;
}): ReactElement | null => {
	const bountiesData = useGetBounties({
		category: CollectionCategory.CREATED,
		status: CollectionStatus.ONGOING,
	});
	const { data: rates } = useExchangeRateStore();

	if (bountiesData.isError) return <PageError />;

	if (bountiesData.isLoading)
		return <PageLoading color="#ffffff" className="container_style" />;

	const bounties = bountiesData.data.data;
	const sortedBounties = sortLatestFirst(bounties);

	const filteredBounties = sortedBounties.filter((bounty) => {
		const spots = bounty.collections.filter(isBountySlot);

		// Check if the bounty has accepted or ongoing slots
		const acceptedSlots = spots.filter(
			(slot) =>
				slot.invite?.status === CollectionInviteStatus.ACCEPTED ||
				slot.invite?.status === CollectionInviteStatus.ONGOING
		);
		// Remove the bounty if the talent has a slot from the acceptedSlot
		// or the slot count is not equal to the acceptedSlots
		// or the talent is already invited
		const isSameLength = acceptedSlots.length === bounty.meta.slotCount;
		const isLessThanLength = acceptedSlots.length < bounty.meta.slotCount;
		return isLessThanLength || !isSameLength;
	});

	const removeAlreadyInvited = filteredBounties.filter((bounty) => {
		const slots = bounty.collections.filter(isBountySlot);
		// If this talent has been invited to this bounty, remove it
		const isAlreadyInvited = slots.some(
			(slot) => slot.invite?.receiver?._id === talentId
		);
		return !isAlreadyInvited;
	});

	return removeAlreadyInvited.length > 0 ? (
		<BountyList
			bounties={removeAlreadyInvited}
			talentId={talentId}
			setIsOpen={setIsOpen}
			rates={rates}
		/>
	) : (
		<PageEmpty label="No Bounties Available for this Ambassador" />
	);
};

export const InviteAmbassador4Desktop = ({
	isOpen,
	setIsOpen,
	talentId,
}: Props): ReactElement | null => {
	return (
		<DesktopSheetWrapper
			isOpen={isOpen}
			onOpenChange={() => {
				setIsOpen(false);
			}}
		>
			<InviteTalent talentId={talentId} setIsOpen={setIsOpen} />
		</DesktopSheetWrapper>
	);
};
