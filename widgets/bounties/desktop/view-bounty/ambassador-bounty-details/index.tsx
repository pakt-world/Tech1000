"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Info } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
import {
	acceptedSlots,
	isBountyDeliverable,
	isSlotFilled,
	loggedInTalentAcceptedSlot,
	slotInfo,
	talentAlreadyApplied,
	talentInvitedToBountySlot,
	talentInvitePending,
} from "@/lib/actions";
import { useGetBountyById } from "@/lib/api/bounty";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { BountyType, Roles } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";
import { titleCase } from "@/lib/utils";
import { RunnerUp } from "@/widgets/overview/leaderboard/runner-up";

import { BountyDeliverables } from "../misc/deliverables";
import { BountyDescription } from "../misc/description";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyHeader } from "../misc/header";
import { BountySkills } from "../misc/skills";
import { CTAS } from "./footer";

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

export const AmbassadorBountyDetails4Desktop = ({
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
	const as = acceptedSlots(bounty);
	const si = slotInfo(bounty);

	return (
		<div className="flex h-full gap-6">
			<div className="scrollbar-hide flex h-full w-[867px] grow flex-col overflow-y-auto pb-20">
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

				<div className="container_style flex w-full grow flex-col rounded-b-xl p-6">
					<BountySkills skills={bounty?.tags ?? []} />
					<BountyDescription
						description={bounty?.description ?? ""}
					/>
					<BountyDeliverables
						deliverables={bounty?.collections
							.filter(isBountyDeliverable)
							.map((collection) => collection.name)}
					/>

					{hasAlreadyApplied && !isInvitePending && !isAccepted && (
						<div className="my-3 flex w-full items-center gap-2 rounded-lg border border-blue-300 bg-[#0065D01A] p-4 text-blue-500">
							<Info size={20} />
							<span className="text-center">
								You have applied to this bounty
							</span>
						</div>
					)}
					{isAccepted && (
						<div className="my-3 flex w-full items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-green-500">
							<Info size={20} />
							<span className="text-center text-green-500">
								You have already accepted this Bounty invite.
							</span>
						</div>
					)}
					{!isAccepted && (
						<BountyCtas
							bountyId={bounty._id}
							inviteId={inviteId}
							hasBeenInvited={hasBeenInvited}
							hasAlreadyApplied={hasAlreadyApplied}
							bountyCreator={bounty.creator._id}
							acceptedSlot={acceptedSlot}
							noSlot={noSlot}
							isOtherPartner={isOtherPartner}
						/>
					)}
				</div>
			</div>

			<div className="flex h-fit w-fit shrink-0 basis-[270px] flex-col gap-2 rounded-2xl border border-[#FFE5E5] border-opacity-30 bg-[#000000] bg-opacity-50 py-2">
				<div className="text-center text-[22px] font-bold text-white">
					Participants ({si.acceptedSlot}/{si.totalSlot})
				</div>
				<div className=" scrollbar-hide relative flex flex-col  gap-2 px-3 text-white">
					{as.map((l: CollectionProps, i: number) => {
						return (
							<RunnerUp
								key={i}
								_id={l.owner?._id ?? ""}
								name={`${l.owner?.firstName ?? ""} ${l.owner?.lastName.slice(0, 1)}.`}
								score={l.owner?.score ?? 0}
								nftTokenNumber={
									parseInt(l.owner?.nftTokenNumber || "0") ||
									0
								}
								avatar={l.owner?.profileImage?.url ?? ""}
								title={titleCase(
									l.owner?.profile.bio.title ?? ""
								)}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};
