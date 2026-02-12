"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { ReactElement, useState } from "react";
import { Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import CardView from "@/components/common/card-view";
import { SnowProfile } from "@/components/common/snow-profile";
import AvatarStack from "@/components/common/avatar-stack";
import { Button } from "@/components/common/button";
import { useUpdateGroup } from "@/lib/api/group";
import { Group } from "@/lib/types/groups";
import { UploadAvatar } from "@/components/common/upload-avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupEditSchema } from "@/lib/validations";
import { ImageData } from "@/lib/types";
import { CustomInput } from "@/components/common/custom-input";

interface GroupDetailsHeader4MobileProps {
	group: Group;
}

type GroupFormInputs = z.infer<typeof groupEditSchema>;

export default function GroupDetailsHeader4Mobile({
	group,
}: GroupDetailsHeader4MobileProps): ReactElement | null {
	const queryClient = useQueryClient();
	const [editingGroupDetails, setEditingGroupDetails] = useState(false);
	const [imageData, setImageData] = useState<ImageData | null>(null);
	const [charCount, setCharCount] = useState<number>(0);

	const { mutate: editGroup, isLoading: isEditLoading } = useUpdateGroup();

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

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		const inputValue = e.target.value;
		if (inputValue.length) {
			setCharCount(inputValue.length);
		}
	};

	return (
		<>
			<CardView className="z-[100] w-full rounded-none !bg-transparent !p-3 !backdrop-blur-none">
				<div className="flex w-full flex-col items-center gap-2 md:flex-row">
					{/* Profile Image Section */}
					{editingGroupDetails ? (
						<div className="mr-auto flex  w-full items-start gap-1">
							<div className="flex  flex-col items-center gap-1">
								<Controller
									name="image"
									control={control}
									render={({
										field: { onChange, value = "" },
									}) => (
										<UploadAvatar
											image={value}
											type="uploader"
											size={46}
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
							<div className="flex w-full flex-col gap-1">
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
											className="!h-[20px] w-full !border-none !bg-inherit !p-0 !text-base !font-bold placeholder:!text-base placeholder:!font-bold"
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
						</div>
					) : (
						<div className="flex w-full items-start gap-2">
							<SnowProfile src={group?.image} size="sm" />
							<h2 className="leading-1 !text-base font-bold text-white">
								{group?.name}
							</h2>
						</div>
					)}

					{/* Group Details Section */}
					<div className="flex w-full flex-col gap-6 text-white">
						{/* Name and Description Editing */}
						{editingGroupDetails ? (
							<div className="flex w-full flex-col gap-1">
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
													onChange(e.target.value);
													handleChange(e);
												}}
												className="w-full rounded-lg border !border-neutral-600 border-opacity-30 !bg-[#FCFCFD1A] p-1 text-xs !text-white placeholder:!text-[#72777A] focus:border-white focus:outline-none"
												placeholder="Enter group description"
												maxLength={200}
											/>
											<div className="mt-1 text-right text-xs text-white">
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
						) : (
							<p className="text-sm font-medium leading-5 text-white">
								{group?.description}
							</p>
						)}

						{/* Group Metadata */}
						<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
							<div className="relative flex w-full items-center justify-between gap-4">
								<div className="">
									<AvatarStack
										memberCount={group?.memberCount}
									/>
								</div>

								<div className="flex gap-3">
									<p className="text-sm text-[#FFFFFFCC]">
										Created:
									</p>
									<span className="text-sm text-[#FFFFFF]">
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

							{group.type === "admin" && (
								<div className="flex w-full justify-start gap-4 md:justify-end">
									{editingGroupDetails ? (
										<Button
											variant="outline"
											type="button"
											size="md"
											className="w-full gap-2 rounded-3xl px-4 text-white"
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
											size="md"
											className="w-full gap-2 rounded-3xl px-4 text-white"
											onClick={handleEditToggle}
										>
											<Pencil size={"14"} />
											<span className="text-sm font-bold">
												Edit Group
											</span>
										</Button>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</CardView>
		</>
	);
}
