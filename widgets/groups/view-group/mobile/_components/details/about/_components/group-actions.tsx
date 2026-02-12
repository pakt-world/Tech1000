"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { ReactElement, useState } from "react";
import { UserPlus, UserX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import CardView from "@/components/common/card-view";
import { Button } from "@/components/common/button";
import { toast } from "@/components/common/toaster";
import {
	useAcceptInvite,
	useDeclineInvite,
	useJoinGroup,
	useLeaveGroup,
} from "@/lib/api/group";
import { Group } from "@/lib/types/groups";
import { useRouter } from "next/navigation";

interface GroupActionsProps {
	group: Group;
}

export default function GroupActions({
	group,
}: GroupActionsProps): ReactElement | null {
	const queryClient = useQueryClient();
	const router = useRouter();

	const [isApiLoading, setIsApiLoading] = useState(false);
	const { mutate: joinGroup, isLoading } = useJoinGroup();
	const { mutate: leaveGroup, isLoading: isLeavingLoading } = useLeaveGroup();
	const { mutate: acceptInvite, isLoading: isAcceptLoading } =
		useAcceptInvite();
	const { mutate: declineInvite, isLoading: isDeclineLoading } =
		useDeclineInvite();

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
						router.push(`/groups/${group?._id}?tab=forum`);
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

	return (
		<>
			<CardView className=" z-[100] w-full rounded-none !bg-transparent !p-3 !backdrop-blur-none">
				{/* Join/Leave/Invite Buttons */}
				<div className="w-full">
					{group.type === "user" && (
						<div className="flex w-full justify-start md:justify-end">
							<Button
								variant="default"
								type="button"
								size="md"
								className="w-full items-center gap-2 rounded-3xl px-4 text-sm text-ink-darkest"
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
						<div className="flex w-full justify-start md:justify-end">
							<Button
								variant="outline"
								type="button"
								size="md"
								className="w-full gap-2 rounded-3xl px-4 text-white"
								onClick={handleLeaveGroup}
								disabled={isLeavingLoading || isApiLoading}
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
						<div className="flex w-full justify-start md:justify-end">
							<Button
								variant="default"
								type="button"
								size="md"
								className="w-full items-center gap-2 rounded-3xl px-4 text-sm text-ink-darkest"
								disabled={true}
							>
								<UserPlus size={"14"} />
								Applied
							</Button>
						</div>
					)}

					{group.type === "invited" && (
						<div className="flex w-full justify-start gap-2 md:justify-end">
							<Button
								variant="outline"
								type="button"
								size="md"
								className="w-1/2 gap-2 rounded-3xl px-4 text-white"
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
								size="md"
								className="w-1/2 gap-2 rounded-3xl px-4 text-black"
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
				</div>
			</CardView>
		</>
	);
}
