"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyAmountAndSlot } from "@/components/common/bounty-amount-and-slot";
import { isBountyApplicant, slotInfo } from "@/lib/actions";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type CollectionProps } from "@/lib/types/collection";

interface UnAssignedBountyCardProps {
	bounty: CollectionProps;
	rates: ExchangeRateRecord | undefined;
}

export const UnAssignedBountyCard: FC<UnAssignedBountyCardProps> = ({
	bounty,
	rates,
}) => {
	const { createdAt, _id, collections, name, invite, isPrivate, meta } =
		bounty;
	const paymentFee = bounty.paymentFee ?? 0;

	const title = name;
	const applicants = collections.filter(isBountyApplicant);
	const hasInvite = invite !== undefined && invite !== null;
	const creationDate = format(new Date(createdAt), "MMM dd, yyyy");
	const realTimeRate = rates ? (rates[meta.coin?.reference] as number) : 0;
	const si = slotInfo(bounty);
	return (
		<Link
			href={`/bounties/${_id}`}
			className="primary_border-y flex w-full grow flex-col gap-4 bg-primary p-4"
		>
			<span className="text-lg text-white">Created: {creationDate}</span>
			<BountyAmountAndSlot
				coin={meta?.coin}
				paymentFee={paymentFee}
				acceptedSlot={si.acceptedSlot}
				totalSlot={si.totalSlot}
				realTimeRate={realTimeRate}
				spotVariant="dark"
				amountVariant="dark"
				isPartner
			/>
			<div className="grow break-words text-lg leading-normal tracking-wide text-white 2xl:text-[22px]">
				{title}
			</div>

			{!isPrivate && !hasInvite && (
				<div className="inline-flex w-fit flex-row-reverse items-center">
					{applicants.length > 5 && (
						<div className="-ml-3 flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#D9D9D9] text-sm last:ml-0">
							<span className="-ml-1.5">
								+{applicants.length - 5}
							</span>
						</div>
					)}

					{applicants.slice(0, 5).map((applicant, index) => {
						return (
							<div
								key={index}
								className="-ml-3 h-[30px] w-[30px] overflow-hidden rounded-full border-2 border-white bg-green-100 last:ml-0"
							>
								{applicant.creator.profileImage && (
									<Image
										src={
											applicant.creator.profileImage
												?.url ?? ""
										}
										alt=""
										width={30}
										height={30}
									/>
								)}
							</div>
						);
					})}
				</div>
			)}
		</Link>
	);
};
