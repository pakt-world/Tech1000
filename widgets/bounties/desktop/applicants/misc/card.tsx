"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

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
} from "@/lib/api/bounty";
import { type CollectionProps } from "@/lib/types/collection";
import { type MemberProps } from "@/lib/types/member";
import { filterEmptyStrings, truncateText } from "@/lib/utils";

interface ApplicantCardProps {
	talent: MemberProps | undefined;
	bounty: CollectionProps;
	disableAcceptButton?: boolean;
	message?: string;
	// applicationId: string;
}

export const ApplicantCard: FC<ApplicantCardProps> = ({
	talent,
	bounty,
	disableAcceptButton,
	message,
	// applicationId,
}) => {
	const [seeMore, setSeeMore] = useState(false);
	const TwoXl = useMediaQuery("(min-width: 1536px)");

	const router = useRouter();

	const talentId = talent?._id ?? "";
	const firstName = talent?.firstName ?? "";
	const lastName = talent?.lastName ?? "";
	const score = talent?.score ?? 0;
	const profileImage = talent?.profileImage;
	const profile = talent?.profile;

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

	const limit = TwoXl ? 150 : 120;

	return (
		<div className="container_style flex w-full flex-col gap-3 rounded-2xl p-4">
			<div className="flex w-full gap-4">
				<div className="relative scale-[1.1]">
					<SnowProfile
						score={score}
						size="lg"
						src={profileImage?.url}
						isPartner={false}
						url={`/members/${talentId}`}
					/>
				</div>
				<div className="flex w-full grow flex-col justify-between gap-2">
					<div className="flex w-full items-center justify-between gap-2">
						<span className="text-xl font-bold text-white">{`${firstName} ${lastName}`}</span>
						<div className="flex items-center gap-2">
							<Button
								size="lg"
								variant="outline"
								onClick={() => {
									router.push(`/members/${talentId}`);
								}}
								className="rounded-[10px]"
							>
								View Profile
							</Button>
							{!disableAcceptButton && (
								<Button
									disabled={
										isSlotFull ||
										createSlot.isLoading ||
										acceptTalent.isLoading
									}
									size="lg"
									variant="white"
									onClick={() => {
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
																applicationId:
																	_id,
																talentId,
															},
															{
																onSuccess:
																	() => {
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
									className="!w-[143px] rounded-[10px]"
								>
									{createSlot.isLoading ||
									acceptTalent.isLoading ? (
										<Spinner />
									) : (
										"Invite"
									)}
								</Button>
							)}
						</div>
					</div>
					<div className="relative w-[95%]">
						<p
							className={`inline text-lg text-white ${!seeMore && "line-clamp-2"}`}
						>
							{truncateText(message as string, limit, seeMore)}
							&nbsp;
							{(message as string).length > limit && (
								<button
									type="button"
									className="inline cursor-pointer text-white text-opacity-50 hover:text-opacity-100"
									onClick={() => {
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
								profile?.talent?.tagsIds
									.slice(0, 3)
									.map((s) => (
										<span
											key={s.color + s.name}
											style={{ background: s.color }}
											className="whitespace-nowrap rounded-full bg-green-100 px-4 py-0.5 capitalize text-[#090A0A]"
										>
											{s.name}
										</span>
									))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
