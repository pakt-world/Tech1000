"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { ReactElement } from "react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import CardView from "@/components/common/card-view";
import { Member } from "@/lib/types/groups";
import { SnowProfile } from "@/components/common/snow-profile";

interface GroupsAdminPageProps {
	groupAdmins: Member[];
}

export default function GroupsAdminPage({
	groupAdmins,
}: GroupsAdminPageProps): ReactElement | null {
	return (
		<div className="sticky top-[250px] mt-2 flex h-fit w-full flex-col gap-6 overflow-y-auto overflow-x-hidden">
			{(groupAdmins.length ?? 0) > 0 ? (
				<CardView className="flex max-h-[300px] w-full flex-col gap-4 overflow-x-scroll !border !border-lemon-green !px-6 !py-4">
					<h2 className="w-full text-left text-xl font-bold text-white">
						Group Admins
					</h2>
					{groupAdmins.map((admin, index) => (
						<div
							key={index}
							className="flex w-full items-center gap-2"
						>
							<SnowProfile
								src={admin?.profileImage}
								score={
									parseInt(admin?.nftTokenNumber || "") || 0
								}
								size="sm"
								url={`/members/${admin?._id}`}
							/>
							<div className="flex flex-col items-start justify-center">
								<h2 className=" text-left text-base font-bold capitalize text-white">
									{admin.firstName} {admin.lastName}
								</h2>
								<p className="text-sm text-[#E8E8E866]">
									{admin?.memberProfile?.bio?.title ||
										admin.type}
								</p>
							</div>
						</div>
					))}
				</CardView>
			) : (
				<PageEmpty
					label="No admins available."
					className="max-h-[300px] w-full rounded-2xl"
				/>
			)}
		</div>
	);
}
