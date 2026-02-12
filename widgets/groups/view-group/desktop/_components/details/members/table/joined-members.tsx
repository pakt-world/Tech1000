"use client";

import React, { ReactElement, useMemo, useState } from "react";
import {
	useGetGroupMembersInfinitely,
	useMakeAdmin,
	useRemoveUser,
} from "@/lib/api/group";
import { SnowProfile } from "@/components/common/snow-profile";
import { ArrowUpDown, EllipsisVertical, MessageSquare } from "lucide-react";
import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import { motion } from "framer-motion";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { PageLoading } from "@/components/common/page-loading";
import { PageError } from "@/components/common/page-error";
import { PageEmpty } from "@/components/common/page-empty";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/common/loader";
import { useQueryClient } from "@tanstack/react-query";
import { Group } from "@/lib/types/groups";
import * as Popover from "@radix-ui/react-popover";
import { getRandomReadableBgColor } from "@/lib/utils";

interface GroupsTableProps {
	group: Group;
}

export default function JoinedMembersView({
	group,
}: GroupsTableProps): ReactElement | null {
	const groupId = group?._id;
	const queryClient = useQueryClient();
	const router = useRouter();

	const [uniqueId, setUniqueId] = useState("");
	const [isSortedAsc, setIsSortedAsc] = useState<"asc" | "desc" | "default">(
		"default"
	);

	const nabArray = ["user", "invited", "applied"];
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

	const gotoMembersProfile = (id: string) => {
		router.push(`/members/${id}`);
	};
	const gotoMembersMessage = (id: string) => {
		router.push(`/messages?userId=${id}`);
	};

	const handleRemoval = (userId: string) => {
		setUniqueId(userId);
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
		setUniqueId(userId);
		makeAdmin(
			{ groupId, userId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries(["group-members", groupId]);
				},
			}
		);
	};

	const toggleSortOrder = () => {
		const sortPattern =
			isSortedAsc === "default"
				? "asc"
				: isSortedAsc === "asc"
					? "desc"
					: "default";
		setIsSortedAsc(sortPattern);
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
		<div className="relative flex w-full flex-col gap-2 overflow-hidden text-white">
			{sortedMembers.length > 0 ? (
				<>
					<div className="flex w-full">
						<div
							className="flex w-2/5 cursor-pointer items-center justify-start gap-1"
							onClick={toggleSortOrder}
						>
							<ArrowUpDown
								size={16}
								color={`${isSortedAsc !== "default" ? "#CCF975" : "#ffffff"}`}
							/>

							<span>Name</span>
						</div>
						<div className="m-auto flex w-2/5 max-w-[500px] justify-start">
							Interests
						</div>
						<div className="w-1/5"></div>
					</div>
					{sortedMembers.map((member, index) => (
						<motion.div
							key={member._id}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.1, delay: index * 0.1 }}
							className={` rounded-full`}
						>
							<CardView
								className={`relative flex w-full gap-2 rounded-full !border !bg-[#FCFCFD1A]/25 !px-6 !py-2`}
								style={{ zIndex: 100 - index }}
							>
								<div className="flex w-2/5 justify-start gap-2 ">
									<SnowProfile
										src={
											member?.memberProfile?.profileImage
										}
										score={
											parseInt(
												member?.achievements
													?.nftTokenNumber || ""
											) || 0
										}
										size={"sm"}
										url={`/members/${member?.userId}`}
									/>
									<div className="flex flex-col items-start justify-center gap-1">
										<h2 className="text-left text-lg font-bold leading-none text-white">
											{member.firstName} {member.lastName}
										</h2>
										<p className="font-circular text-sm leading-none">
											{member.memberProfile?.bio?.title}
										</p>
									</div>
								</div>
								<div className="m-auto flex w-2/5 max-w-[500px] gap-2 overflow-scroll">
									{member?.memberProfile?.talent?.tagsIds &&
										member?.memberProfile?.talent?.tagsIds
											.slice(0, 3)
											.map((item, index) => (
												<div
													key={index}
													className="flex w-fit flex-nowrap justify-center whitespace-nowrap rounded-full px-4 py-1 text-base text-black"
													style={{
														backgroundColor:
															item.color ||
															getRandomReadableBgColor(),
													}}
												>
													<p>{item.name}</p>
												</div>
											))}
								</div>
								<div className="flex w-1/5 items-end justify-end">
									<div className="flex w-full justify-end gap-2">
										<Button
											type="button"
											variant="outline"
											size="xs"
											className=" rounded-full !border py-1 text-lemon-green"
											disabled={isRemovingLoading}
											onClick={() =>
												gotoMembersMessage(
													member?.userId
												)
											}
										>
											<MessageSquare size={18} />
										</Button>
										<Button
											type="button"
											variant="default"
											size="xs"
											className=" rounded-full px-4 py-1 font-circular text-sm text-black"
											disabled={isRemovingLoading}
											onClick={() =>
												gotoMembersProfile(
													member?.userId
												)
											}
										>
											View Profile
										</Button>

										{member.type !== "admin" &&
										group.type === "admin" ? (
											<Popover.Root>
												<div className="relative flex justify-center">
													<Popover.Trigger asChild>
														<div className="flex cursor-pointer items-center">
															<EllipsisVertical
																size={16}
															/>
														</div>
													</Popover.Trigger>

													{/* Changed Popover positioning to fixed */}
													<Popover.Content className="absolute -right-6  mt-2 flex min-w-[146px] cursor-pointer flex-col rounded-[16px] border-2 border-[#F2C650] bg-gradient-to-b from-black/80 to-black p-4 font-circular text-sm backdrop-blur-3xl">
														<div className="flex w-full flex-col gap-4">
															<p
																className="w-full"
																onClick={() =>
																	!isMakeAdminLoading &&
																	!isRemovingLoading
																		? handleMakeAdmin(
																				member?.userId
																			)
																		: null
																}
															>
																{isMakeAdminLoading &&
																member?.userId ===
																	uniqueId
																	? "Making Admin..."
																	: "Make Admin"}
															</p>

															{group.type ===
																"admin" &&
															member.type !==
																"admin" ? (
																<p
																	className="w-full text-red-300"
																	onClick={() =>
																		!isMakeAdminLoading &&
																		!isRemovingLoading
																			? handleRemoval(
																					member?.userId
																				)
																			: null
																	}
																>
																	{isRemovingLoading &&
																	member?.userId ===
																		uniqueId
																		? "Deleting..."
																		: "Delete Member"}
																</p>
															) : (
																<div className="w-[18px]"></div>
															)}
														</div>
													</Popover.Content>
												</div>
											</Popover.Root>
										) : (
											group.type === "admin" && (
												<div className="w-[18px]"></div>
											)
										)}
										{/* {group.type === "admin" &&
										member.type !== "admin" ? (
											<div className="flex cursor-pointer items-center">
												{isRemovingLoading &&
												member?.userId === uniqueId ? (
													<Spinner size={18} />
												) : (
													<Trash2
														size={18}
														color={"#FFA3AC"}
														onClick={() =>
															handleRemoval(
																member?.userId
															)
														}
													/>
												)}
											</div>
										) : (
											<div className="w-[18px]"></div>
										)} */}
									</div>
								</div>
							</CardView>
						</motion.div>
					))}
				</>
			) : (
				<PageEmpty
					label="No members available."
					className="max-h-[470px] rounded-2xl"
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
