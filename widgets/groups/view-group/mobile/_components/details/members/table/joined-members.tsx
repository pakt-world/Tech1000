"use client";

import React, { ReactElement, useMemo } from "react";
import {
	useGetGroupMembersInfinitely,
	useMakeAdmin,
	useRemoveUser,
} from "@/lib/api/group";
import { motion } from "framer-motion";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";
import { PageEmpty } from "@/components/common/page-empty";

import { Spinner } from "@/components/common/loader";
import { useQueryClient } from "@tanstack/react-query";
import { Group } from "@/lib/types/groups";
import { GroupsMemberCard } from "../_components/groups-member-card";

interface GroupsTableProps {
	group: Group;
}

export default function JoinedMembersView({
	group,
}: GroupsTableProps): ReactElement | null {
	const groupId = group?._id;
	const queryClient = useQueryClient();

	const isSortedAsc = "default" as "asc" | "desc" | "default";

	const nabArray = ["user", "invited", "applied"];
	const isAdmin = group?.type === "admin";
	const shouldFetch = !nabArray.includes(group.type);
	let prevPage = 0;
	let currentPage = 1;

	const {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetGroupMembersInfinitely(groupId, shouldFetch);

	const { mutate: removeGroupMember, isLoading: isRemovingLoading } =
		useRemoveUser();
	const { mutate: makeAdmin, isLoading: isMakeAdminLoading } = useMakeAdmin();

	const membersData = useMemo(
		() => ({
			...data,
			pages: data?.pages?.map((page) => page.data) ?? [],
		}),
		[data]
	);

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

	const handleRemoval = (userId: string) => {
		removeGroupMember(
			{ groupId, userId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(["group-members", groupId]);
				},
			}
		);
	};

	const handleMakeAdmin = (userId: string) => {
		makeAdmin(
			{ groupId, userId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(["group-members", groupId]);
				},
			}
		);
	};

	const sortedMembers = useMemo(() => {
		const membersList = membersData?.pages?.flat() || [];
		if (isSortedAsc === "asc") {
			return [...membersList].sort((a, b) =>
				a.firstName.localeCompare(b.firstName)
			);
		}
		if (isSortedAsc === "desc") {
			return [...membersList].sort((a, b) =>
				b.firstName.localeCompare(a.firstName)
			);
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
		<div
			className={`relative flex h-full w-full flex-col text-white ${isAdmin ? "py-20" : "pb-14 pt-4"}`}
		>
			{sortedMembers.length > 0 ? (
				<>
					{sortedMembers.map((member, index) => (
						<motion.div
							key={member.memberId}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.1, delay: index * 0.1 }}
							className={` h-full rounded-full`}
						>
							<GroupsMemberCard
								member={member}
								id={member?.memberId}
								name={member?.firstName}
								title={
									member?.memberProfile?.bio?.title ||
									"Builder"
								}
								imageUrl={member?.memberProfile?.profileImage}
								skills={
									member?.memberProfile?.talent?.tagsIds as []
								}
								nftTokenNumber={
									member?.achievements?.nftTokenNumber
								}
								isAdmin={isAdmin}
								memberType={member?.type}
								handleMakeAdmin={handleMakeAdmin}
								handleRemoval={handleRemoval}
								isMakeAdminLoading={isMakeAdminLoading}
								isRemovingLoading={isRemovingLoading}
								cardType="joined"
							/>
						</motion.div>
					))}
				</>
			) : (
				<PageEmpty
					label="No members available."
					className="!h-[70vh] rounded-none"
				/>
			)}
			{isFetchingNextPage && (
				<div className="absolute bottom-0 mx-auto flex w-full flex-row items-center justify-center text-center">
					<Spinner
						size={15}
						className="animate-spin text-center text-white"
					/>
				</div>
			)}

			{/* Infinite Scroll Target */}
			<div ref={observerTarget} className="!h-2 !w-full" />
		</div>
	);
}
