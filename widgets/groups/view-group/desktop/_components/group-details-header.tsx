"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { ReactElement, useState } from "react";
import { ChevronDown, Pencil, UserPlus, UserX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import * as Popover from "@radix-ui/react-popover";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import CardView from "@/components/common/card-view";
import { SnowProfile } from "@/components/common/snow-profile";
import AvatarStack from "@/components/common/avatar-stack";
import { Button } from "@/components/common/button";
import {
	useAcceptInvite,
	useDeclineInvite,
	useJoinGroup,
	useLeaveGroup,
	useUpdateGroup,
} from "@/lib/api/group";
import { Group } from "@/lib/types/groups";
import { InviteModal } from "./invite/invite-modal";
import { UploadAvatar } from "@/components/common/upload-avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupEditSchema } from "@/lib/validations";
import { ImageData } from "@/lib/types";
import { CustomInput } from "@/components/common/custom-input";
import { toast } from "@/components/common/toaster";

interface GroupDetailsHeaderProps {
	group: Group;
}

type GroupFormInputs = z.infer<typeof groupEditSchema>;

export default function GroupDetailsHeader({
	group,
}: GroupDetailsHeaderProps): ReactElement | null {
	const queryClient = useQueryClient();

	const [openInviteModal, setOpenInviteModal] = useState(false);
	const [editingGroupDetails, setEditingGroupDetails] = useState(false);
	const [imageData, setImageData] = useState<ImageData | null>(null);
	const [charCount, setCharCount] = useState<number>(0);
	const [roleSelected, setRoleSelected] = useState<"members" | "admin">(
		"members"
	);
	const [isApiLoading, setIsApiLoading] = useState(false);

	const { mutate: joinGroup, isLoading } = useJoinGroup();
	const { mutate: leaveGroup, isLoading: isLeavingLoading } = useLeaveGroup();
	const { mutate: editGroup, isLoading: isEditLoading } = useUpdateGroup();
	const { mutate: acceptInvite, isLoading: isAcceptLoading } =
		useAcceptInvite();
	const { mutate: declineInvite, isLoading: isDeclineLoading } =
		useDeclineInvite();

	const {
		control,
		formState: { errors },
		setValue,
		getValues,
	} = useForm<GroupFormInputs>({
		resolver: zodResolver(groupEditSchema),
		defaultValues: {
			name: group?.name || "",
			description: group?.description || "",
			image: group?.image || "",
		},
	});

	const handleJoinGroup = () => {
		setIsApiLoading(true);
		joinGroup(
			{ groupId: group?._id },
			{
				onSuccess: async (data) => {
					try {
						await new Promise((resolve) =>
							setTimeout(resolve, 10000)
						);

						await queryClient.invalidateQueries([
							"get-group",
							group?._id,
						]);
						toast.success(
							data.type === "application"
								? `Request to join ${data.groupName} has been sent successfully`
								: `You have successfully joined ${data.groupName} `
						);
					} catch (error) {
						setIsApiLoading(false);
					} finally {
						setIsApiLoading(false);
					}
				},
				onError: () => {
					setIsApiLoading(false);
				},
			}
		);
	};

	const handleLeaveGroup = () => {
		setIsApiLoading(true);
		leaveGroup(
			{ groupId: group?._id },
			{
				onSuccess: async () => {
					try {
						await new Promise((resolve) =>
							setTimeout(resolve, 10000)
						);

						await queryClient.invalidateQueries([
							"get-group",
							group?._id,
						]);
						toast.success("You have left the group successfully");
					} catch (error) {
						setIsApiLoading(false);
					} finally {
						setIsApiLoading(false);
					}
				},
				onError: () => {
					setIsApiLoading(false);
				},
			}
		);
	};

	const handleAcceptInvite = () => {
		setIsApiLoading(true);
		acceptInvite(
			{ groupId: group?._id },
			{
				onSuccess: async () => {
					try {
						await new Promise((resolve) =>
							setTimeout(resolve, 10000)
						);

						await queryClient.invalidateQueries([
							"get-group",
							group?._id,
						]);
						toast.success(`Invite accepted successfully`);
					} catch (error) {
						setIsApiLoading(false);
					} finally {
						setIsApiLoading(false);
					}
				},
				onError: () => {
					setIsApiLoading(false);
				},
			}
		);
	};

	const handleDeclineInvite = () => {
		setIsApiLoading(true);
		declineInvite(
			{ groupId: group?._id },
			{
				onSuccess: async () => {
					try {
						await new Promise((resolve) =>
							setTimeout(resolve, 10000)
						);

						await queryClient.invalidateQueries([
							"get-group",
							group?._id,
						]);
						toast.success(`Invite declined successfully`);
					} catch (error) {
						setIsApiLoading(false);
					} finally {
						setIsApiLoading(false);
					}
				},
				onError: () => {
					setIsApiLoading(false);
				},
			}
		);
	};

	const handleUploadComplete = (data: any) => {
		setImageData(data);
		setValue("image", data?.url);
	};

	const handleEditGroup = () => {
		const data = getValues();
		const groupData = {
			groupId: group?._id,
			values: {
				name: data?.name,
				description: data.description,
				...(imageData ? { image: imageData?._id } : {}),
			},
		};

		editGroup(groupData, {
			onSuccess: () => {
				setEditingGroupDetails(false);
				queryClient.invalidateQueries(["get-group", group?._id]);
			},
		});
	};

	const handleEditToggle = () => {
		setEditingGroupDetails((prev) => !prev);
	};

	const handleRoleSelect = (role: "members" | "admin") => {
		setRoleSelected(role);
		setOpenInviteModal(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		const inputValue = e.target.value;
		if (inputValue.length) {
			setCharCount(inputValue.length);
		}
	};

	return (
		<>
			<CardView className="z-[100] w-full !border-[#F2C650] !p-6">
				<div className="flex w-full flex-col items-center gap-6 md:flex-row">
					{/* Profile Image Section */}
					{editingGroupDetails ? (
						<div className="flex max-w-[60%] flex-col items-center gap-1">
							<Controller
								name="image"
								control={control}
								render={({
									field: { onChange, value = "" },
								}) => (
									<UploadAvatar
										image={value}
										type="uploader"
										size={134}
										onUploadComplete={(data) => {
											handleUploadComplete(data);
											onChange(data?.url);
										}}
									/>
								)}
							/>
							{errors.image && (
								<span className="text-xs text-red-500">
									{errors.image.message}
								</span>
							)}
						</div>
					) : (
						<div className="flex flex-col items-center gap-1">
							<SnowProfile src={group?.image} size="lg" />
						</div>
					)}

					{/* Group Details Section */}
					<div className="flex w-full flex-col gap-6 text-white">
						{/* Name and Description Editing */}
						{editingGroupDetails ? (
							<div className="flex w-full max-w-[80%] flex-col gap-1">
								<div className="flex flex-col gap-1">
									<Controller
										name="name"
										control={control}
										defaultValue=""
										render={({
											field: { value, onChange, ...rest },
										}) => (
											<CustomInput
												{...rest}
												value={value || ""}
												onChange={(e) =>
													onChange(e.target.value)
												}
												type="text"
												className="w-full !border-none !bg-inherit !p-0 !text-3xl !font-bold placeholder:!text-3xl placeholder:!font-bold"
												placeholder="Enter Group Name"
											/>
										)}
									/>
									{errors.name && (
										<span className="mb-2 text-xs text-red-500">
											{errors.name.message}
										</span>
									)}
								</div>

								<div className="flex flex-col gap-1">
									<Controller
										name="description"
										control={control}
										defaultValue=""
										render={({
											field: { value, onChange, ...rest },
										}) => (
											<div className="w-full">
												<textarea
													{...rest}
													value={value || ""}
													onChange={(e) => {
														onChange(
															e.target.value
														);
														handleChange(e);
													}}
													className="w-full rounded-lg border !border-neutral-600 border-opacity-30 !bg-[#FCFCFD1A] p-2 !text-white placeholder:!text-[#72777A] focus:border-white focus:outline-none"
													placeholder="Enter group description"
													maxLength={200}
												/>
												<div className="mt-2 text-right text-sm text-white">
													{charCount}/200
												</div>
											</div>
										)}
									/>
									{errors.description && (
										<span className="text-xs text-red-500">
											{errors.description.message}
										</span>
									)}
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-3">
								<h2 className="leading-1 !text-3xl font-bold">
									{group?.name}
								</h2>
								<p className="text-base font-medium leading-5">
									{group?.description}
								</p>
							</div>
						)}

						{/* Group Metadata */}
						<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
							<div className="relative flex items-center gap-4">
								<div className="">
									<AvatarStack
										memberCount={group?.memberCount}
									/>
								</div>

								<div className="flex gap-3">
									<p className="text-lg text-[#FFFFFFCC]">
										Created:
									</p>
									<span className="text-lg text-[#FFFFFF]">
										{new Date(
											group?.createdAt
										).toLocaleDateString("en-GB", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</span>
								</div>
							</div>

							{/* Join/Leave/Invite Buttons */}
							{group.type === "user" && (
								<div className="flex justify-start md:justify-end">
									<Button
										variant="default"
										type="button"
										size="xs"
										className="w-fit items-center gap-2 rounded-3xl px-4 text-sm text-ink-darkest"
										onClick={handleJoinGroup}
										disabled={isLoading || isApiLoading}
									>
										{isLoading || isApiLoading ? (
											"Loading..."
										) : (
											<span className="flex items-center gap-2">
												<UserPlus size={"14"} />
												<span className="text-sm font-bold">
													{group.groupType === "close"
														? "Apply to join"
														: "Join Group"}
												</span>
											</span>
										)}
									</Button>
								</div>
							)}

							{group.type === "member" && (
								<div className="flex justify-start md:justify-end">
									<Button
										variant="outline"
										type="button"
										size="xs"
										className="w-fit gap-2 rounded-3xl px-4 text-white"
										onClick={handleLeaveGroup}
										disabled={isLoading || isApiLoading}
									>
										{isLeavingLoading || isApiLoading ? (
											"Loading..."
										) : (
											<span className="flex items-center gap-2">
												<UserX size={"14"} />
												<span className="text-sm font-bold">
													Leave Group
												</span>
											</span>
										)}
									</Button>
								</div>
							)}
							{group.type === "applied" && (
								<div className="flex justify-start md:justify-end">
									<Button
										variant="default"
										type="button"
										size="xs"
										className="w-fit items-center gap-2 rounded-3xl px-4 text-sm text-ink-darkest"
										disabled={true}
									>
										<UserPlus size={"14"} />
										Applied
									</Button>
								</div>
							)}

							{group.type === "invited" && (
								<div className="flex justify-start gap-4 md:justify-end">
									<Button
										variant="outline"
										type="button"
										size="xs"
										className="w-fit gap-2 rounded-3xl px-4 text-white"
										onClick={handleDeclineInvite}
										disabled={
											isAcceptLoading ||
											isDeclineLoading ||
											isApiLoading
										}
									>
										{isDeclineLoading ? (
											<span className="flex text-center text-sm font-bold">
												Loading...
											</span>
										) : (
											<span className="flex items-center gap-2">
												<UserX size={"14"} />
												<span className="text-sm font-bold">
													Decline Invite
												</span>
											</span>
										)}
									</Button>
									<Button
										variant="default"
										type="button"
										size="xs"
										className="w-fit gap-2 rounded-3xl px-4 text-black"
										onClick={handleAcceptInvite}
										disabled={
											isAcceptLoading ||
											isDeclineLoading ||
											isApiLoading
										}
									>
										{isAcceptLoading ? (
											<span className="flex text-center text-sm font-bold">
												Loading...
											</span>
										) : (
											<span className="flex items-center gap-2">
												<UserX size={"14"} />
												<span className="text-sm font-bold">
													Accept Invite
												</span>
											</span>
										)}
									</Button>
								</div>
							)}

							{group.type === "admin" && (
								<div className="flex justify-start gap-4 md:justify-end">
									{editingGroupDetails ? (
										<Button
											variant="outline"
											type="button"
											size="xs"
											className="w-fit gap-2 rounded-3xl px-4 text-white"
											onClick={handleEditGroup}
											disabled={isEditLoading}
										>
											<Pencil size={"14"} />
											<span className="text-sm font-bold">
												{isEditLoading
													? "Saving..."
													: "Save Details"}
											</span>
										</Button>
									) : (
										<Button
											variant="outline"
											type="button"
											size="xs"
											className="w-fit gap-2 rounded-3xl px-4 text-white"
											onClick={handleEditToggle}
										>
											<Pencil size={"14"} />
											<span className="text-sm font-bold">
												Edit Group
											</span>
										</Button>
									)}

									{/* Popover for Invite role selection */}
									<Popover.Root>
										<div className="relative flex">
											<Popover.Trigger asChild>
												<Button
													variant="default"
													type="button"
													size="xs"
													className="flex w-fit justify-between gap-3 rounded-3xl px-6 text-ink-darkest"
												>
													<UserPlus size={"14"} />
													<span className="text-sm font-bold">
														Invite
													</span>
													<ChevronDown size={16} />
												</Button>
											</Popover.Trigger>

											<Popover.Content className="absolute -right-20 top-2 mt-2 flex min-w-[146px] cursor-pointer flex-col rounded-[16px] border-2 border-lemon-green bg-gradient-to-b from-black/80 to-black p-6 font-circular text-sm backdrop-blur-3xl">
												<div className=" flex w-full flex-col gap-4">
													<p
														className="w-full"
														onClick={() =>
															handleRoleSelect(
																"members"
															)
														}
													>
														Members
													</p>
													{/* <p
														className="w-full"
														onClick={() =>
															handleRoleSelect(
																"admin"
															)
														}
													>
														Admin
													</p> */}
												</div>
											</Popover.Content>
										</div>
									</Popover.Root>
								</div>
							)}
						</div>
					</div>
				</div>
			</CardView>

			{/* Invite Modal (now open conditionally) */}
			<InviteModal
				title={`Invite ${roleSelected} to Group`}
				setOpen={setOpenInviteModal}
				limit={10}
				open={openInviteModal}
				groupId={group._id}
				role={roleSelected}
			/>
		</>
	);
}
