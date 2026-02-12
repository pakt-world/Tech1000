"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyAmountAndSlot } from "@/components/common/bounty-amount-and-slot";
import { Button } from "@/components/common/button";
import { isBountyApplicant, slotInfo } from "@/lib/actions";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type CollectionProps } from "@/lib/types/collection";

interface UnAssignedBountyCardProps {
	bounty: CollectionProps;
	rates: ExchangeRateRecord | undefined;
}

export const UnAssignedBountyCard = ({
	bounty,
	rates,
}: UnAssignedBountyCardProps) => {
	const router = useRouter();

	const {
		createdAt,
		_id,
		collections,
		tagsData,
		name,
		paymentFee,
		invite,
		isPrivate,
		meta,
	} = bounty;

	const id = _id;
	const title = name;
	const skills = tagsData.join(",");
	const applicants = collections.filter(isBountyApplicant);
	const hasInvite = invite !== undefined && invite !== null;
	const creationDate = format(new Date(createdAt), "MMM dd, yyyy");
	const realTimeRate = (rates ? rates[meta.coin.reference] : 0) as number;
	const si = slotInfo(bounty);
	const pf = paymentFee ?? 0;
	return (
		<div className="container_style flex w-full grow flex-col gap-4 rounded-3xl p-4">
			<div className="flex w-full gap-4">
				<div className="flex grow flex-col gap-2">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<span className="text-lg text-white">
								Created: {creationDate}
							</span>
						</div>
						<BountyAmountAndSlot
							coin={meta?.coin}
							paymentFee={pf}
							acceptedSlot={si.acceptedSlot}
							totalSlot={si.totalSlot}
							realTimeRate={realTimeRate}
							spotVariant="dark"
							amountVariant="dark"
							isPartner
						/>
					</div>
					<div className="min-h-[58px] grow break-words text-lg leading-normal tracking-wide text-white 2xl:text-[22px]">
						{title}
					</div>
				</div>
			</div>
			<div className="mt-auto flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					{!hasInvite && isPrivate && (
						<Button
							size="md"
							variant="white"
							onClick={() => {
								router.push(
									`/members${skills ? `?skills=${skills}` : ""}`
								);
							}}
						>
							Find Talent
						</Button>
					)}

					{!hasInvite && !isPrivate && (
						<Button
							size="md"
							variant="white"
							onClick={() => {
								router.push(`/bounties/${id}/applicants`);
							}}
						>
							View Applicants
						</Button>
					)}

					<Button
						size="md"
						variant="outline"
						onClick={() => {
							router.push(`/bounties/${id}`);
						}}
					>
						Bounty Details
					</Button>
				</div>

				<div>
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
													applicant.creator
														.profileImage?.url ?? ""
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
				</div>
			</div>
		</div>
	);
};
