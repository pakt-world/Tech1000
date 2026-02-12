"use client";

import React, { ReactElement, useMemo } from "react";
import {
	useGetGroupInvitesInfinitely,
	useResendInvite,
	useRevokeInvite,
} from "@/lib/api/group";
import { motion } from "framer-motion";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";
import { PageEmpty } from "@/components/common/page-empty";
import { useQueryClient } from "@tanstack/react-query";
import { Group } from "@/lib/types/groups";
import { GroupsMemberCard } from "../_components/groups-member-card";

interface GroupsTableProps {
	group: Group;
}

export default function InvitedMembersView({
	group,
}: GroupsTableProps): ReactElement | null {
	const groupId = group?._id;
	const queryClient = useQueryClient();

	const isSortedAsc = false as boolean;

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

	const handleResendInvite = (member: any) => {
		const { inviteId, memberId, groupId } = member;
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
		<div className="flex h-full w-full flex-col  py-20 text-white">
			{sortedMembers.length > 0 ? (
				<>
					{sortedMembers.map((member, index) => (
						<motion.div
							key={member.inviteId}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.1, delay: index * 0.1 }}
						>
							<GroupsMemberCard
								member={member}
								id={member?.userInvitedInfo?._id}
								name={member?.userInvitedInfo?.firstName}
								title={
									member?.userInvitedInfo?.profile?.bio
										?.title || "Builder"
								}
								imageUrl={member?.userInvitedInfo?.image}
								skills={member?.userInvitedInfo?.tags as []}
								nftTokenNumber={
									member?.userInvitedInfo?.nftTokenNumber
								}
								handleAddSelected={handleResendInvite}
								isInviting={isInviting}
								isRevoking={isRevoking}
								cardType="invited"
								isAdmin={group.type === "admin"}
								handleRemoval={handleRemoval}
							/>
						</motion.div>
					))}
				</>
			) : (
				<PageEmpty
					label="No invites available."
					className="!h-[70vh] rounded-none"
				/>
			)}

			{/* Infinite Scroll Target */}
			<div ref={observerTarget} className="!h-2 !w-full" />
		</div>
	);
}
