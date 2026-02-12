"use client";

import React, { ReactElement, useMemo, useState } from "react";
import {
	useApproveApplication,
	useGetGroupApplicationsInfinitely,
	useRejectApplication,
} from "@/lib/api/group";
import { SnowProfile } from "@/components/common/snow-profile";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import { motion } from "framer-motion";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";
import { PageEmpty } from "@/components/common/page-empty";
import { useQueryClient } from "@tanstack/react-query";
import { Group } from "@/lib/types/groups";
import { getRandomReadableBgColor } from "@/lib/utils";

interface GroupsTableProps {
	group: Group;
}

export default function GroupApplicantsView({
	group,
}: GroupsTableProps): ReactElement | null {
	const groupId = group?._id;
	const queryClient = useQueryClient();

	const [uniqueId, setUniqueId] = useState("");
	const [isSortedAsc, setIsSortedAsc] = useState<boolean>(false);

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
		setUniqueId(applicationId);
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
		setUniqueId(applicationId);
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

	const toggleSortOrder = () => {
		setIsSortedAsc(!isSortedAsc);
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
		<div className="flex h-full w-full flex-col gap-2 overflow-x-scroll text-white">
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
							key={member.applicationId}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.1, delay: index * 0.1 }}
						>
							<CardView className="flex w-full gap-2 rounded-full !border !bg-[#FCFCFD1A]/25 !px-6 !py-2">
								<div className="flex w-2/5 justify-start gap-2">
									<SnowProfile
										src={member?.applicant?.imageUrl}
										score={
											parseInt(
												member?.applicant
													?.nftTokenNumber || ""
											) || 0
										}
										size={"sm"}
										url={`/members/${member?.applicant?._id}`}
									/>
									<div className="flex flex-col items-start justify-center gap-1">
										<h2 className="text-left text-lg font-bold leading-none text-white">
											{member?.applicant?.firstName}{" "}
											{member?.applicant?.lastName}
										</h2>
										<p className="font-circular text-sm leading-none">
											{
												member.applicant?.profile?.bio
													?.title
											}
										</p>
									</div>
								</div>
								<div className="m-auto flex w-2/5 max-w-[500px] gap-2 overflow-scroll">
									{member?.applicant?.profile?.talent
										?.tagsIds &&
										member?.applicant?.profile?.talent?.tagsIds
											.slice(0, 3)
											.map((item, index) => (
												<div
													key={index}
													className={`flex w-fit flex-nowrap justify-center whitespace-nowrap rounded-full px-4 py-1 text-base text-black`}
													style={{
														backgroundColor: `${item.color || getRandomReadableBgColor()}`,
													}}
												>
													<p>{item.name}</p>
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
												className="rounded-full !border px-4 py-1 font-circular text-white"
												disabled={
													isApprovalLoading ||
													isRejectionLoading
												}
												onClick={() =>
													handleRejection(
														member?.applicationId
													)
												}
											>
												{isRejectionLoading &&
												member?.applicationId ===
													uniqueId
													? "Loading..."
													: "Reject"}
											</Button>
											<Button
												type="button"
												variant="default"
												size="xs"
												className="rounded-full px-4 py-1 font-circular text-sm text-black"
												disabled={
													isApprovalLoading ||
													isRejectionLoading
												}
												onClick={() =>
													handleApprove(
														member?.applicationId
													)
												}
											>
												{isApprovalLoading &&
												member?.applicationId ===
													uniqueId
													? "Loading..."
													: "Accept"}
											</Button>
										</div>
									)}
								</div>
							</CardView>
						</motion.div>
					))}
				</>
			) : (
				<PageEmpty
					label="No applicants available."
					className="max-h-[470px] rounded-2xl"
				/>
			)}

			{/* Infinite Scroll Target */}
			<div ref={observerTarget} className="!h-2 !w-full" />
		</div>
	);
}
