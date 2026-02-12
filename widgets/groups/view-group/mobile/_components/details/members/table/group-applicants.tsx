"use client";

import React, { ReactElement, useMemo } from "react";
import {
	useApproveApplication,
	useGetGroupApplicationsInfinitely,
	useRejectApplication,
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

export default function GroupApplicantsView({
	group,
}: GroupsTableProps): ReactElement | null {
	const groupId = group?._id;
	const queryClient = useQueryClient();

	const isSortedAsc = false as boolean;

	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
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
	} = useGetGroupApplicationsInfinitely(groupId);

	const { mutate: approveApplication, isLoading: isApprovalLoading } =
		useApproveApplication();
	const { mutate: rejectApplication, isLoading: isRejectionLoading } =
		useRejectApplication();

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

	const handleApprove = (applicationId: string) => {
		approveApplication(
			{ applicationId, groupId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries([
						"group-applications",
						groupId,
					]);
					queryClient.invalidateQueries(["group-members", groupId]);
				},
			}
		);
	};

	const handleRejection = (applicationId: string) => {
		rejectApplication(
			{ applicationId, groupId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries([
						"group-applications",
						groupId,
					]);
					queryClient.invalidateQueries(["group-members", groupId]);
				},
			}
		);
	};

	const sortedMembers = useMemo(() => {
		const membersList = membersData?.pages?.flat() || [];
		if (isSortedAsc === true) {
			return membersList.sort((a, b) =>
				a.applicant.firstName.localeCompare(b.applicant.firstName)
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
		<div className="flex h-full w-full flex-col gap-2  py-20 text-white">
			{sortedMembers.length > 0 ? (
				<>
					{sortedMembers.map((member, index) => (
						<motion.div
							key={member.applicationId}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.1, delay: index * 0.1 }}
						>
							<GroupsMemberCard
								member={member}
								id={member?.applicant?._id}
								name={member?.applicant?.firstName}
								title={
									member?.applicant?.profile?.bio?.title ||
									"Builder"
								}
								imageUrl={member?.applicant?.imageUrl}
								skills={
									member?.applicant?.profile?.talent
										?.tagsIds as []
								}
								nftTokenNumber={
									member?.applicant?.nftTokenNumber
								}
								cardType="applicant"
								isAdmin={group.type === "admin"}
								handleApprove={handleApprove}
								handleRejection={handleRejection}
								isApprovalLoading={isApprovalLoading}
								isRejectionLoading={isRejectionLoading}
							/>
						</motion.div>
					))}
				</>
			) : (
				<PageEmpty
					label="No applicants available."
					className="!h-[70vh] rounded-none"
				/>
			)}

			{/* Infinite Scroll Target */}
			<div ref={observerTarget} className="!h-2 !w-full" />
		</div>
	);
}
