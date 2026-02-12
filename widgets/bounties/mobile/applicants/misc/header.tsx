"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { Calendar, Tag } from "lucide-react";
import Image from "next/image";

import { isBountySlot } from "@/lib/actions";
import { CollectionInviteStatus } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { formatNumberWithCommas } from "@/lib/utils";

interface ApplicantHeaderProps {
	bounty: CollectionProps;
	realTimeRate: number;
}
export const ApplicantHeader = ({
	bounty,
	realTimeRate,
}: ApplicantHeaderProps): JSX.Element => {
	// Check if Accepted spots is equals to slotCount
	const invitedSlots = bounty.collections.filter(isBountySlot);
	const acceptedSlotCount = invitedSlots.filter(
		(slot) => slot.invite?.status === CollectionInviteStatus.ACCEPTED
	).length;
	return (
		<div className="flex justify-between gap-4 bg-hover-gradient p-4">
			<div className="flex grow flex-col gap-3">
				<h2 className="text-lg font-bold text-white">{bounty?.name}</h2>
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-sm text-[#198155]">
						<Tag size={20} />
						<span>{bounty.paymentFee}</span>
						<div className="flex items-center justify-center gap-1">
							<Image
								className="h-[18px] w-[17.94px] rounded-full"
								src={bounty?.meta?.coin?.icon}
								alt={bounty?.meta?.coin?.name}
								width={18}
								height={18}
							/>
							<div className="text-base leading-normal tracking-tight text-[#198155]">
								{bounty?.meta?.coin?.symbol.toUpperCase()}
							</div>
						</div>
						<div className="text-sm font-bold leading-[27px] tracking-wide text-[#198155]">
							($
							{formatNumberWithCommas(
								(
									realTimeRate * Number(bounty?.paymentFee)
								).toFixed(2)
							)}
							)
						</div>
					</div>
					<div className="inline-flex h-max w-fit items-center justify-center gap-2 rounded-[18px] bg-rose-300 px-3 py-1 text-sm">
						<span className=" text-gray-800">
							{acceptedSlotCount}/{bounty.meta.slotCount}{" "}
							{`spot${acceptedSlotCount > 1 ? "s" : ""} filled`}
						</span>
					</div>
					<span className="flex items-center gap-2 rounded-full bg-[#C9F0FF] px-3 py-1 text-sm text-[#0065D0]">
						<Calendar size={20} />
						<span>
							Due:{" "}
							{bounty?.deliveryDate
								? format(
										new Date(bounty.deliveryDate),
										"MMM dd, yyyy"
									)
								: "N/A"}
						</span>
					</span>
				</div>
			</div>
		</div>
	);
};
