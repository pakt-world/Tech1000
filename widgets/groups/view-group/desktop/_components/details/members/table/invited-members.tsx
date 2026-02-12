"use client";

import React, { ReactElement, useMemo, useState } from "react";
import {
	useGetGroupInvitesInfinitely,
	useResendInvite,
	useRevokeInvite,
} from "@/lib/api/group";
import { SnowProfile } from "@/components/common/snow-profile";
import { ArrowUpDown, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import { motion } from "framer-motion";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";
import { PageEmpty } from "@/components/common/page-empty";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/common/loader";
import { Group } from "@/lib/types/groups";
import { getRandomReadableBgColor } from "@/lib/utils";

interface GroupsTableProps {
	group: Group;
}

export default function InvitedMembersView({
	group,
}: GroupsTableProps): ReactElement | null {
	const groupId = group?._id;
	const queryClient = useQueryClient();
	const router = useRouter();

	const [uniqueId, setUniqueId] = useState("");
	const [isSortedAsc, setIsSortedAsc] = useState<boolean>(false);
	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;

	const { mutate: resendInvite, isLoading: isInviting } = useResendInvite();
	const { mutate: revokeInvite, isLoading: isRevoking } = useRevokeInvite();
	const {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetGroupInvitesInfinitely(groupId);

	const membersData = useMemo(
		() => ({
			...data,
			pages: data?.pages?.map((page) => page.data) ?? [],
		}),
		[data]
	);

	const gotoMembersMessage = (id: string) => {
		router.push(`/messages?userId=${id}`);
	};

	const handleAddSelected = (member: any) => {
		const { inviteId, memberId, groupId } = member;
		setUniqueId(inviteId);

		resendInvite(
			{ inviteId, memberId, groupId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries([
						"group-member-invite-list",
						groupId,
					]);
				},
			}
		);
	};

	const handleRemoval = (inviteId: string) => {
		setUniqueId(inviteId);
		revokeInvite(
			{ inviteId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries([
						"group-member-invite-list",
						groupId,
					]);
				},
			}
		);
	};
	const { observerTarget } = useInfiniteScroll({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: membersData,
		refetch,
		error: error?.response?.data.message ?? "",
	});

	const toggleSortOrder = () => {
		setIsSortedAsc(!isSortedAsc);
	};

	const sortedMembers = useMemo(() => {
		const membersList = membersData?.pages?.flat() || [];
		if (isSortedAsc === true) {
			return membersList.sort((a, b) =>
				a.userInvitedInfo.firstName.localeCompare(
					b.userInvitedInfo.firstName
				)
			);
		}
		if (isSortedAsc === false) {
			return membersList;
		}
		return membersList;
	}, [isSortedAsc, membersData]);

	if (isLoading) {
		return (
			<PageLoading
				className="max-h-[500px] rounded-2xl"
				color="#ffffff"
			/>
		);
	}

	if (isError) return <PageError className="max-h-[500px] rounded-2xl" />;

	return (
		<div className="flex h-full w-full flex-col  gap-2 overflow-x-scroll text-white">
			{sortedMembers.length > 0 ? (
				<>
					<div className="flex w-full">
						<div className="flex w-2/5 items-center justify-start gap-1 ">
							<ArrowUpDown
								size={16}
								onClick={toggleSortOrder}
								color={`${isSortedAsc ? "#CCF975" : "#ffffff"}`}
							/>{" "}
							Name
						</div>
						<div className="m-auto flex w-2/5 max-w-[500px] justify-start">
							Interests
						</div>
						<div className="w-1/5"></div>
					</div>
					{sortedMembers.map((member, index) => (
						<motion.div
							key={member.inviteId}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.1, delay: index * 0.1 }}
						>
							<CardView className="relative flex w-full gap-2 rounded-full !border !bg-[#FCFCFD1A]/25 !px-6 !py-2">
								<div className="flex w-2/5 justify-start gap-2">
									<SnowProfile
										src={member?.userInvitedInfo?.image}
										score={
											parseInt(
												member?.userInvitedInfo
													?.nftTokenNumber || ""
											) || 0
										}
										size={"sm"}
										url={`/members/${member?.userInvitedInfo?._id}`}
									/>
									<div className="flex flex-col items-start justify-center gap-1">
										<h2 className="text-left text-lg font-bold leading-none text-white">
											{member.userInvitedInfo?.firstName}{" "}
											{member.userInvitedInfo?.lastName}
										</h2>
										<p className="font-circular text-sm leading-none">
											{
												member.userInvitedInfo?.profile
													?.bio?.title
											}
										</p>
									</div>
								</div>
								<div className="m-auto flex w-2/5 max-w-[500px] gap-2 overflow-scroll">
									{member?.userInvitedInfo?.profile?.talent
										?.tagsIds &&
										member?.userInvitedInfo?.profile?.talent?.tagsIds
											.slice(0, 3)
											.map((item, index) => (
												<div
													key={index}
													className={`flex w-fit flex-nowrap justify-center whitespace-nowrap rounded-full px-4 py-1 text-base text-black`}
													style={{
														backgroundColor: `${item.color || getRandomReadableBgColor()}`,
													}}
												>
													<p>{item.name} </p>
												</div>
											))}
								</div>
								<div className="flex w-1/5 items-end justify-end">
									{group.type === "admin" && (
										<div className="flex w-full justify-end gap-4">
											<Button
												type="button"
												variant="outline"
												size="xs"
												className="rounded-full !border px-4 py-1 text-lemon-green"
												onClick={() =>
													gotoMembersMessage(
														member?.userInvitedInfo
															?._id
													)
												}
												disabled={
													isInviting || isRevoking
												}
											>
												<MessageSquare size={18} />
											</Button>
											<Button
												type="button"
												variant="default"
												size="xs"
												className="rounded-full px-4 py-1 font-circular text-sm text-black"
												onClick={() =>
													handleAddSelected(member)
												}
												disabled={
													isInviting || isRevoking
												}
											>
												{isInviting &&
												member?.inviteId === uniqueId
													? "Loading..."
													: "Resend Invite"}
											</Button>
											<div className="flex cursor-pointer items-center">
												{isRevoking &&
												member?.inviteId ===
													uniqueId ? (
													<Spinner size={18} />
												) : (
													<Trash2
														size={18}
														color={"#FFA3AC"}
														onClick={() =>
															handleRemoval(
																member?.inviteId
															)
														}
													/>
												)}
											</div>
										</div>
									)}
								</div>
							</CardView>
						</motion.div>
					))}
				</>
			) : (
				<PageEmpty
					label="No invites available."
					className="max-h-[470px] rounded-2xl"
				/>
			)}

			{/* Infinite Scroll Target */}
			<div ref={observerTarget} className="!h-2 !w-full" />
		</div>
	);
}
