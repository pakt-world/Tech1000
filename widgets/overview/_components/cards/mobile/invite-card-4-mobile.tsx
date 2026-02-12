"use client";

// import { useRouter } from "next/navigation";
// import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { FeedWrapper } from "../../feed-wrapper";
import { SnowProfile } from "@/components/common/snow-profile";

import { Button } from "@/components/common/button";

// import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";
import { Tag } from "@/lib/types/groups";
import { FeedData } from "@/lib/types/feed";
import { useApproveApplication, useRejectApplication } from "@/lib/api/group";
import { getRandomReadableBgColor } from "@/lib/utils";

interface InviteCard4MobileType {
	feedId: string;
	type:
		| "group_invite"
		| "application_accepted"
		| "application_rejected"
		| "post"
		| "comment"
		| "application"
		| "application_joined"
		| "group_invite";
	title: string;
	description?: string;
	groupId?: string;
	data?: FeedData;
	isBookmarked?: boolean;
	bookmarkId?: string;
	score?: number;
	tags?: Tag[];
	dismissByID: (id: string) => void;
	viewType: "bookmarked" | "others" | "post_comments";
	applicationId?: string;
	callback?: () => void;
	isDismissLoading?: boolean;
}

export const InviteCard4Mobile = ({
	feedId,
	type,
	title,
	description,
	data,
	// isBookmarked,
	// bookmarkId,
	dismissByID,
	// viewType,
	callback,
	applicationId,
	isDismissLoading,
}: InviteCard4MobileType): JSX.Element => {
	//const router = useRouter();
	const queryClient = useQueryClient();
	const router = useRouter();
	const groupId = data?.groupId as string;

	const inviteFeedTypes = ["application_joined", "group_invite"];

	const { mutate: approveApplication, isLoading: isApprovalLoading } =
		useApproveApplication();
	const { mutate: rejectApplication, isLoading: isRejectionLoading } =
		useRejectApplication();

	const getRoute = () => {
		if (inviteFeedTypes.includes(type)) {
			dismissByID(feedId);
			return `/groups/${groupId}`;
		} else {
			return `/groups`;
		}
	};
	const handleApprove = () => {
		approveApplication(
			{ applicationId: applicationId as string, groupId, feedId },
			{
				onSuccess: () => {
					dismissByID(feedId);
					queryClient.invalidateQueries(["get-user-feed", 1, 10]);
					callback?.();
				},
			}
		);
	};

	const handleRejection = () => {
		rejectApplication(
			{ applicationId: applicationId as string, groupId, feedId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(["get-user-feed", 1, 10]);
					callback?.();
				},
			}
		);
	};

	const handleMove = () => {
		if (type === "group_invite") {
			router.push(getRoute());
		} else {
			dismissByID(feedId);
		}
	};

	const image =
		type === "application"
			? data?.applicant?.image
			: type === "group_invite"
				? data?.founder?.image
				: data?.image;
	const score =
		type === "application"
			? data?.applicant?.nftTokenNumber
			: type === "group_invite"
				? data?.founder?.nftTokenNumber
				: data?.image;

	const name =
		type === "application"
			? data?.applicant?.firstName
			: data?.founder?.firstName;

	const feedTitle =
		type === "application"
			? "Applied to join"
			: type === "group_invite"
				? "Invited you to join"
				: type === "application_joined"
					? "Joined"
					: title;

	return (
		<FeedWrapper className="h-full !border-x-0 !border-b-0 !border-t-2">
			<div className="relative flex h-full w-full flex-col justify-between gap-2">
				<div className="mb-2 flex w-full items-center  justify-start gap-2">
					<SnowProfile
						src={image}
						size="xs"
						score={parseInt(score || "0") || 0}
					/>
					<p className="text-base text-[#FFFFFF]/90">{name}</p>
				</div>
				<div className="flex h-full w-full flex-col items-start  gap-1">
					<h3 className="whitespace-break-spaces break-words font-circular text-lg font-normal text-white">
						{feedTitle}
					</h3>
					<h3 className="whitespace-break-spaces break-words text-lg font-bold text-lemon-green md:text-xl">
						{data?.name || description}
					</h3>
				</div>

				<div className="relative mt-auto flex  w-full items-end justify-between">
					<div className="flex w-full  flex-col items-start justify-start gap-4">
						{inviteFeedTypes.includes(type) && (
							<div className="flex h-fit max-w-[350px] gap-2 overflow-scroll">
								{inviteFeedTypes.includes(type) &&
									data?.tags &&
									data?.tags?.length > 0 &&
									data?.tags.slice(0, 3).map((skill, i) => (
										<span
											key={i}
											className="rounded-full bg-white px-6 py-1.5 text-sm font-medium capitalize text-[#090A0A]"
											style={{
												backgroundColor:
													skill.color ||
													getRandomReadableBgColor(),
											}}
										>
											{skill.name}
										</span>
									))}
							</div>
						)}

						{type === "application" ? (
							<div className="flex gap-6">
								<Button
									size="lg"
									variant="outline"
									className="rounded-full !border py-1.5 font-bold"
									onClick={handleApprove}
									disabled={
										isApprovalLoading || isRejectionLoading
									}
								>
									{isApprovalLoading
										? "Accepting..."
										: "Accept"}
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="rounded-full !border-none !p-1.5 font-bold"
									onClick={handleRejection}
									disabled={
										isApprovalLoading || isRejectionLoading
									}
								>
									{isRejectionLoading
										? "Rejecting..."
										: "Reject"}
								</Button>
							</div>
						) : (
							<Button
								size="lg"
								variant="outline"
								className="w-full rounded-full !border py-1.5 font-bold"
								onClick={() => handleMove()}
								disabled={isDismissLoading}
							>
								{/* View Group */}
								{isDismissLoading
									? "Loading..."
									: type === "group_invite"
										? "View Group"
										: "Mark as read"}
							</Button>
						)}
					</div>

					{/* <RenderBookMark
						size={24}
						isBookmarked={isBookmarked || viewType === "bookmarked"}
						type={"feed"}
						id={feedId as string}
						bookmarkId={bookmarkId as string}
						callback={callback}
					/> */}
				</div>
			</div>
		</FeedWrapper>
	);
};
