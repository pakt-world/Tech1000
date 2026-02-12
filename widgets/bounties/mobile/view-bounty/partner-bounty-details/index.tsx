"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Spinner } from "@/components/common/loader";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { isBountyDeliverable } from "@/lib/actions";
import { useCancelBountyInvite } from "@/lib/api/bounty";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { BountyType } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";

import { BountyDeliverables } from "../misc/deliverables";
import { BountyDescription } from "../misc/description";
import { BountyHeader } from "../misc/header";
import { BountySkills } from "../misc/skills";
import { CTAS } from "./footer";

interface PartnerBountyDetails4MobileProps {
	bounty: CollectionProps;
	rates: ExchangeRateRecord | undefined;
	acceptedSlot: {
		acceptedSlot: number;
		totalSlot: number;
	};
}

export function PartnerBountyDetails4Mobile({
	bounty,
	rates,
	acceptedSlot,
}: PartnerBountyDetails4MobileProps): JSX.Element {
	const router = useRouter();
	const cancelInvite = useCancelBountyInvite();

	const BOUNTY_TYPE: BountyType = bounty.isPrivate
		? BountyType.PRIVATE
		: BountyType.OPEN;

	const BountyCtas = CTAS[BOUNTY_TYPE];

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
				title={bounty.name}
				price={bounty.paymentFee ?? 0}
				dueDate={bounty.deliveryDate ?? ""}
				creator={{
					_id: bounty?.owner?._id ?? "",
					score: bounty?.owner?.score ?? 0,
					avatar: bounty?.owner?.profileImage?.url,
					name: `${bounty?.owner?.firstName} ${bounty?.owner?.lastName.slice(0, 1)}.`,
					// type: bounty?.creator?.type,
				}}
				acceptedSlot={acceptedSlot}
				slotCount={bounty?.meta?.slotCount}
				coin={bounty?.meta?.coin}
				realTimeRate={rates?.[bounty?.meta?.coin?.reference] ?? 0}
			/>
			<BountySkills skills={bounty.tags ?? []} />
			<BountyDescription description={bounty.description} />
			<BountyDeliverables
				deliverables={bounty.collections
					.filter(isBountyDeliverable)
					.map((collection) => collection.name)}
			/>

			<div className="mt-auto w-full px-4">
				<div className="mt-8 flex w-full flex-col gap-4">
					{bounty.invite != null && (
						<div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-blue-300 bg-[#0065D01A] p-4 text-blue-500">
							<div className="flex items-center gap-2">
								<Info size={20} />
								<span>Awaiting Talent Response</span>
							</div>

							<button
								className="flex h-[35px] w-[130px] items-center justify-center rounded-lg border border-red-500 bg-red-50 text-sm text-red-500"
								onClick={() => {
									cancelInvite.mutate(
										{ inviteId: bounty.invite?._id ?? "" },
										{}
									);
								}}
								type="button"
							>
								{cancelInvite.isLoading ? (
									<Spinner size={16} />
								) : (
									"Cancel Invite"
								)}
							</button>
						</div>
					)}

					{bounty.invite == null && (
						<BountyCtas
							bountyId={bounty._id}
							skills={bounty.tagsData}
							deletePage={() => {
								router.push(`/bounties/${bounty._id}/delete`);
							}}
							acceptedSlot={acceptedSlot}
							bountyNotFunded={!bounty.escrowPaid}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
