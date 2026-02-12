"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Info } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import {
	isBountyDeliverable,
	isSlotFilled,
	loggedInTalentAcceptedSlot,
	talentAlreadyApplied,
	talentInvitedToBountySlot,
	talentInvitePending,
} from "@/lib/actions";
import { useGetBountyById } from "@/lib/api/bounty";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { BountyType, Roles } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";

import { BountyDeliverables } from "../misc/deliverables";
import { BountyDescription } from "../misc/description";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyHeader } from "../misc/header";
import { BountySkills } from "../misc/skills";
import { CTAS } from "./bounty-details-footer";

interface AmbassadorBountyDetailsProps {
	bounty: CollectionProps;
	userId: string;
	rates: ExchangeRateRecord | undefined;
	acceptedSlot: {
		acceptedSlot: number;
		totalSlot: number;
	};
	type?: Roles | undefined;
}

export const AmbassadorBountyDetails4Mobile = ({
	bounty: b,
	userId,
	rates,
	acceptedSlot,
	type,
}: AmbassadorBountyDetailsProps): JSX.Element => {
	const searchParams = useSearchParams();

	const inviteId = b?.invite?._id ?? searchParams.get("invite-id");

	const BOUNTY_TYPE: BountyType = b.isPrivate
		? BountyType.PRIVATE
		: BountyType.OPEN;
	const BountyCtas = CTAS[BOUNTY_TYPE];

	const isOtherPartner = b.creator._id !== userId && type === Roles.PARTNER;

	// Retrieve bountyId from bounty object because existing bounty object does not have necessary data e.g tags, tagsData, etc
	const bountyId = b?._id;
	const bountyQuery = useGetBountyById({ bountyId });
	if (bountyQuery.isError) return <PageError className="absolute inset-0" />;
	if (bountyQuery.isLoading)
		return <PageLoading className="absolute inset-0" color="#ffffff" />;
	const { data: bounty } = bountyQuery;
	// Retrieve bountyId from bounty object because existing bounty object does not have necessary data e.g tags, tagsData, etc

	const hasAlreadyApplied = talentAlreadyApplied(bounty, userId);
	const isInvitePending = talentInvitePending(bounty, userId);
	const hasBeenInvited = talentInvitedToBountySlot(bounty, userId);
	const isAccepted = loggedInTalentAcceptedSlot(bounty, userId);
	const noSlot = isSlotFilled(bounty);

	return (
		<div className="scrollbar-hide primary_border-y flex h-full w-full grow flex-col overflow-y-auto bg-primary pb-8">
			<MobileBreadcrumb
				items={[
					{
						label: "Bounties",
						link: "/bounties?bounties-type=open",
					},
					{ label: "Bounties Details", active: true },
				]}
			/>
			<BountyHeader
				title={bounty?.name ?? ""}
				price={bounty?.paymentFee ?? 0}
				dueDate={bounty?.deliveryDate ?? ""}
				creator={{
					_id: bounty?.creator?._id ?? "",
					score: bounty?.creator?.score ?? 0,
					avatar: bounty?.creator?.profileImage?.url,
					name: `${bounty?.creator?.firstName}`,
					// type: bounty?.creator?.type,
				}}
				slotCount={bounty?.meta?.slotCount}
				coin={bounty?.meta?.coin}
				realTimeRate={rates?.[bounty?.meta?.coin?.reference] ?? 0}
				acceptedSlot={acceptedSlot}
			/>

			<div className="flex w-full grow flex-col">
				<BountySkills skills={bounty?.tags ?? []} />
				<BountyDescription description={bounty?.description ?? ""} />
				<BountyDeliverables
					deliverables={bounty?.collections
						.filter(isBountyDeliverable)
						.map((collection) => collection.name)}
				/>

				<div className="mt-auto flex w-full px-4">
					{hasAlreadyApplied && !isInvitePending && !isAccepted && (
						<div className="mt-8 flex w-full items-center gap-2 rounded-lg border border-blue-300 bg-[#0065D01A] p-4 text-blue-500">
							<Info size={20} />
							<span className="text-center text-sm">
								You have applied to this bounty
							</span>
						</div>
					)}
					{isAccepted && (
						<div className="mt-8 flex w-full items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-green-500">
							<Info size={20} />
							<span className="text-center text-sm text-green-500">
								You have already accepted this Bounty invite.
							</span>
						</div>
					)}
				</div>
				{!isAccepted && (
					<BountyCtas
						bountyId={bounty._id}
						inviteId={inviteId}
						hasBeenInvited={hasBeenInvited}
						hasAlreadyApplied={hasAlreadyApplied}
						acceptedSlot={acceptedSlot}
						noSlot={noSlot}
						isOtherPartner={isOtherPartner}
					/>
				)}
			</div>
		</div>
	);
};
