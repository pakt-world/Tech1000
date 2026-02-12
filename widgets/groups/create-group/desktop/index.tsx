"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import CardView from "@/components/common/card-view";
import GroupsFormStep from "./_components/groups-form-steps";

import { Button } from "@/components/common/button";
import { groupCreationSchema } from "@/lib/validations";
import GroupInfo from "./_components/group-info";
import GroupTags from "./_components/group-tags";
import TalentAddition from "./_components/group-talent-addition";
import InviteType from "./_components/invite-type";

import { useCreateGroup } from "@/lib/api/group";
import { ImageData } from "@/lib/types";

type GroupInviteType = "open" | "close" | "private";

type GroupFormInputs = z.infer<typeof groupCreationSchema>;

export default function CreateGroupsPage4Desktop(): ReactElement | null {
	const router = useRouter();

	const [imageData, setImageData] = useState<ImageData>();
	const { mutate: createGroup, isLoading } = useCreateGroup();

	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
		setValue,
	} = useForm<GroupFormInputs>({
		resolver: zodResolver(groupCreationSchema),
	});

	const inviteType = useWatch({ control, name: "inviteType" });

	const onSubmit = (data: GroupFormInputs) => {
		const invites = data?.invites.map((invite: any) => invite._id);
		const adminInvites = data.admins
			? data?.admins.map((admin: any) => admin._id)
			: [];

		const groupData = {
			name: data.name,
			description: data.description,
			tags: data.tags,
			image: imageData?._id,
			inviteType: data.inviteType,
			memberInvites: invites,
			...(adminInvites.length > 0 ? { adminInvites: adminInvites } : []),
		};

		createGroup(groupData, {
			onSuccess: (data: any) => {
				router.push(`/groups/${data?._id}`);
			},
		});
	};

	const handleUploadComplete = (data: any) => {
		setImageData(data);
		setValue("image", data?.url);
	};

	const inviteTypeOptions: GroupInviteType[] = ["open", "close", "private"];

	return (
		<div className="mt-2 flex h-screen w-full flex-col gap-6 px-2 lg:flex-row">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-4 lg:w-4/5"
			>
				<GroupInfo
					control={control}
					errors={errors}
					onUploadComplete={handleUploadComplete}
				/>
				<CardView className="flex w-full flex-col gap-6 !border-[#9BDCFD] !p-6">
					<GroupTags control={control} errors={errors} />
					<TalentAddition control={control} errors={errors} />
					<div className="flex w-full items-center justify-between">
						<InviteType
							control={control}
							errors={errors}
							inviteTypeOptions={inviteTypeOptions}
							currentInviteType={inviteType}
						/>
						<Button
							type="submit"
							variant={"default"}
							disabled={isLoading}
							className={isLoading ? "text-grey !bg-white" : ""}
						>
							{isLoading ? "Creating..." : "Create Group"}
						</Button>
					</div>
				</CardView>
			</form>

			<div className="w-full lg:w-1/5">
				<GroupsFormStep values={getValues()} />
			</div>
		</div>
	);
}
