"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Info } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/common/headless-modal";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Spinner } from "@/components/common/loader";
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
import { DeleteBountyModal } from "./modal/delete";

interface PartnerBountyDetails4DesktopProps {
	bounty: CollectionProps;
	rates: ExchangeRateRecord | undefined;
	acceptedSlot: {
		acceptedSlot: number;
		totalSlot: number;
	};
}

export function PartnerBountyDetails4Desktop({
	bounty,
	rates,
	acceptedSlot,
}: PartnerBountyDetails4DesktopProps): JSX.Element {
	const cancelInvite = useCancelBountyInvite();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const BOUNTY_TYPE: BountyType = bounty.isPrivate
		? BountyType.PRIVATE
		: BountyType.OPEN;

	const BountyCtas = CTAS[BOUNTY_TYPE];

	return (
		<div className="flex h-full gap-6">
			<div className="scrollbar-hide flex h-full w-[867px] grow flex-col overflow-y-auto pb-20">
				<BountyHeader
					title={bounty.name}
					price={bounty.paymentFee ?? 0}
					dueDate={bounty.deliveryDate ?? "N/A"}
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

				<div className="container_style flex w-full grow flex-col rounded-b-xl border border-t-0 p-6">
					<BountySkills skills={bounty.tags ?? []} />
					<BountyDescription description={bounty.description} />

					<BountyDeliverables
						deliverables={bounty.collections
							.filter(isBountyDeliverable)
							.map((collection) => collection.name)}
					/>

					{bounty.invite == null && (
						<BountyCtas
							bountyId={bounty._id}
							skills={bounty.tagsData}
							openDeleteModal={() => {
								setIsDeleteModalOpen(true);
							}}
							acceptedSlot={acceptedSlot}
							bountyNotFunded={!bounty.escrowPaid}
						/>
					)}

					{bounty.invite != null && (
						<div className="my-3 flex w-full items-center justify-between gap-2 rounded-2xl border border-blue-300 bg-[#0065D01A] p-4 text-blue-500">
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
				</div>
			</div>

			<div className="flex h-full w-fit shrink-0 basis-[270px] flex-col items-center gap-7" />

			<Modal
				isOpen={isDeleteModalOpen}
				closeModal={() => {
					setIsDeleteModalOpen(false);
				}}
			>
				<DeleteBountyModal
					bountyId={bounty._id}
					// title={bounty.name}
					setModalOpen={setIsDeleteModalOpen}
				/>
			</Modal>
		</div>
	);
}
