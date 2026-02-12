"use client";
import React, { ReactElement, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

import CardView from "@/components/common/card-view";
import { Group } from "@/lib/types/groups";
import JoinedMembersView from "./table/joined-members";
import InvitedMembersView from "./table/invited-members";
import GroupApplicantsView from "./table/group-applicants";
import Image from "next/image";
import { UserPlusIcon } from "lucide-react";
import { InviteModal4Mobile } from "../../invite/invite-modal";

interface GroupMembersView4MobileProps {
	group: Group;
}
export default function GroupMembersView4Mobile({
	group,
}: GroupMembersView4MobileProps): ReactElement | null {
	const [activeTab, setActiveTab] = useState("joined");
	const [open, setOpen] = useState(false);
	const nabArray = ["user", "invited", "applied"];
	const notAMember = nabArray.includes(group.type);
	return (
		<>
			<div className="relative pt-12">
				{notAMember && (
					<div className="absolute inset-0 -top-[120px] z-10 flex h-[90vh] items-center justify-center rounded-lg bg-opacity-60 ">
						<div className="absolute inset-0 z-20 h-full backdrop-blur-2xl"></div>{" "}
						{/* Blur layer */}
						<div className="z-30 flex flex-col items-center justify-center gap-4">
							<Image
								src="/images/group-lock-image.svg"
								alt="Lock Icon"
								width={210}
								height={210}
							/>
							<p className="text-center text-2xl leading-4 text-white ">
								{group.type === "invited"
									? "Accept Invite to view group"
									: "Join group to view members"}
							</p>{" "}
						</div>
					</div>
				)}

				{group.type === "admin" && (
					<div className="fixed top-[135px] z-[100] flex w-full items-center gap-2 bg-[#000000]/60 p-2">
						<CardView className="h-fit w-full rounded-lg !border !bg-[#7676801F]/30 !p-0 shadow-lg sm:ml-1 sm:max-w-xs">
							<Tabs
								value={activeTab}
								onValueChange={(value: string) =>
									setActiveTab(value)
								}
								className="w-full"
							>
								<TabsList className="flex w-full items-center text-sm">
									<TabsTrigger
										value="joined"
										className={`flex w-1/3 justify-center p-2 ${
											activeTab === "joined"
												? "rounded-lg border border-lemon-green bg-[#00000080]/30 text-white"
												: "text-white/60"
										}`}
									>
										Joined
									</TabsTrigger>
									<TabsTrigger
										value="invited"
										className={`flex w-1/3 justify-center p-2 ${
											activeTab === "invited"
												? "rounded-lg border border-lemon-green bg-[#00000080]/30 text-white"
												: "text-white/60"
										}`}
									>
										Invited
									</TabsTrigger>
									<TabsTrigger
										value="applicants"
										className={`flex w-1/3 justify-center p-2 ${
											activeTab === "applicants"
												? "rounded-lg border border-lemon-green bg-[#00000080]/30 text-white"
												: "text-white/60"
										}`}
									>
										Applicants
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</CardView>
						<div
							className="flex h-8 w-8 cursor-pointer  items-center justify-center rounded-full border border-lemon-green bg-transparent text-white"
							onClick={() => setOpen(true)}
						>
							<UserPlusIcon size={15} />
						</div>
					</div>
				)}
				{activeTab === "joined" && <JoinedMembersView group={group} />}
				{activeTab === "invited" && (
					<InvitedMembersView group={group} />
				)}
				{activeTab === "applicants" && (
					<GroupApplicantsView group={group} />
				)}
			</div>
			<InviteModal4Mobile
				title="Invite Members"
				limit={10000}
				setOpen={setOpen}
				open={open}
				groupId={group._id}
				role="members"
			/>
		</>
	);
}
