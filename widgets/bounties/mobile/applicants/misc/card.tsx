"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { SnowProfile } from "@/components/common/snow-profile";
import { isBountyDeliverable, isSlotFilled } from "@/lib/actions";
import {
	useCreateSlotForBounty,
	useGetBountyById,
	useInviteTalentToBounty,
	// useUpdateBounty,
} from "@/lib/api/bounty";
import { type CollectionProps } from "@/lib/types/collection";
import { type MemberProps } from "@/lib/types/member";
import {
	filterEmptyStrings,
	getRandomReadableBgColor,
	truncateText,
} from "@/lib/utils";

interface ApplicantCardProps {
	message?: string;
	talent: MemberProps;
	bounty: CollectionProps;
	disableAcceptButton?: boolean;
	// applicationId: string;
}

export const ApplicantCard: FC<ApplicantCardProps> = ({
	talent,
	message,
	bounty,
	disableAcceptButton,
	// applicationId,
}) => {
	const [seeMore, setSeeMore] = useState(false);
	const router = useRouter();

	const { firstName, lastName, score, profileImage, profile } = talent;
	const talentId = talent._id;

	const acceptTalent = useInviteTalentToBounty({ talentId, bounty });
	const bountyQuery = useGetBountyById({ bountyId: bounty._id });
	// const updateApplicationStatus = useUpdateBounty();
	const pf = bounty.paymentFee ?? 0;

	// Get Bounty data to update meta data for Spots
	const deliverables = bounty.collections
		.filter(isBountyDeliverable)
		.map((collection) => collection.name);
	const updateBountyToAcceptedSlotData = {
		name: bounty?.name,
		category: bounty?.category,
		paymentFee: pf / Number(bounty?.meta?.slotCount),
		isPrivate: bounty?.isPrivate,
		description: bounty?.description,
		deliveryDate: bounty?.deliveryDate
			? format(new Date(bounty?.deliveryDate), "yyyy-MM-dd")
			: "N/A",
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

	// Check if Accepted spots is equals to slotCount
	const isSlotFull = isSlotFilled(bounty);

	return (
		<div
			role="button"
			tabIndex={0}
			onKeyDown={() => {}}
			onClick={(e) => {
				e.stopPropagation();
				router.push(`/members/${talent._id}`);
			}}
			className="primary_border-y flex w-full flex-col bg-primary p-4"
		>
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between gap-2">
					<div className="relative flex items-center gap-2">
						<SnowProfile
							score={score}
							size="sm"
							src={profileImage?.url}
							isPartner={false}
							url={`/members/${talent._id}`}
						/>
						<span className="text-base font-bold text-white">{`${firstName} ${lastName}`}</span>
					</div>
					{!disableAcceptButton && (
						<Button
							disabled={
								isSlotFull ||
								createSlot.isLoading ||
								acceptTalent.isLoading
							}
							size="sm"
							variant="white"
							onClick={(e) => {
								e.stopPropagation();
								if (talentId !== "") {
									createSlot.mutate(
										{
											parent: bounty._id,
											...updateBountyToAcceptedSlotData,
											meta: {
												talentId,
												...updateBountyToAcceptedSlotData.meta,
											},
										},
										{
											onSuccess: ({ _id }) => {
												acceptTalent.mutate(
													{
														applicationId: _id,
														talentId,
													},
													{
														onSuccess: () => {
															// updateApplicationStatus.mutate(
															//     {
															//         id: applicationId,
															//         type: CollectionTypes.APPLICATION,
															//         status: CollectionStatus.ONGOING,
															//     },
															//     {
															//         onSuccess:
															//             () => {
															bountyQuery.refetch();
															//             },
															//     }
															// );
														},
													}
												);
											},
										}
									);
								}
							}}
							className=""
						>
							{createSlot.isLoading || acceptTalent.isLoading ? (
								<Spinner />
							) : (
								"Invite"
							)}
						</Button>
					)}
				</div>

				<div className="relative w-[95%]">
					<p
						className={`inline text-lg text-white ${!seeMore && "line-clamp-2"}`}
					>
						{truncateText(message as string, 100, seeMore)}
						&nbsp;
						{(message as string).length > 100 && (
							<button
								type="button"
								className="inline cursor-pointer text-white text-opacity-50"
								onClick={(e) => {
									e.stopPropagation();
									setSeeMore(!seeMore);
								}}
							>
								{seeMore ? "less" : "more"}
							</button>
						)}
					</p>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex flex-wrap gap-2">
						{profile?.talent?.tagsIds &&
							profile?.talent?.tagsIds.length > 0 &&
							profile?.talent?.tagsIds.slice(0, 3).map((s) => (
								<span
									key={s.color + s.name}
									style={{
										background:
											s.color ||
											getRandomReadableBgColor(),
									}}
									className="whitespace-nowrap rounded-full bg-green-100 px-4 py-0.5 capitalize text-[#090A0A]"
								>
									{s.name}
								</span>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};
