"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { EllipsisVertical, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { limitString, titleCase } from "@/lib/utils";
import { SnowProfile } from "@/components/common/snow-profile";
import { Button } from "@/components/common/button";

interface GroupsMemberCardProps {
	member: any;
	id: string;
	name: string;
	title: string;
	imageUrl?: string;
	score?: string;
	skills: Array<{ name: string; color: string }>;
	nftTokenNumber?: string;
	isRemovingLoading?: boolean;
	isAdmin?: boolean;
	memberType?: string;
	isMakeAdminLoading?: boolean;
	handleMakeAdmin?: (userId: string) => void;
	handleRemoval?: (userId: string) => void;
	handleAddSelected?: (member: any) => void;
	isInviting?: boolean;
	isRevoking?: boolean;
	cardType?: "invited" | "joined" | "applicant";
	handleApprove?: (applicationId: string) => void;
	handleRejection?: (applicationId: string) => void;
	isApprovalLoading?: boolean;
	isRejectionLoading?: boolean;
}

export const GroupsMemberCard = ({
	member,
	id,
	name,
	title,
	imageUrl,
	skills,
	nftTokenNumber,
	isRemovingLoading,
	isAdmin,
	memberType,
	isMakeAdminLoading,
	handleMakeAdmin,
	handleRemoval,
	handleAddSelected,
	isInviting,
	isRevoking,
	cardType,
	handleApprove,
	handleRejection,
	isApprovalLoading,
	isRejectionLoading,
}: GroupsMemberCardProps): JSX.Element => {
	const [uniqueId, setUniqueId] = useState("");
	const router = useRouter();
	const goToMemberProfile = () => {
		router.push(`/members/${id}`);
	};
	const gotoMembersMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		router.push(`/messages?userId=${id}`);
	};
	const handleMakeUserAdmin = (
		e: React.MouseEvent<HTMLParagraphElement>,
		userId: string
	) => {
		e.stopPropagation();
		setUniqueId(userId);
		handleMakeAdmin?.(userId);
	};
	const handleRemoveUser = (
		e: React.MouseEvent<HTMLParagraphElement>,
		userId: string
	) => {
		e.stopPropagation();
		setUniqueId(userId);
		handleRemoval?.(userId);
	};
	return (
		<div
			key={id}
			className=" m-0 h-full w-full border-t-2 border-[#ffffff]/50 bg-ink-darkest/40 from-white via-transparent to-white px-3 py-4 backdrop-blur-sm"
			onClick={goToMemberProfile}
		>
			<div className="inline-flex  w-full flex-col items-start gap-3">
				<div className="flex w-full items-start justify-between">
					<div className="inline-flex items-start justify-between gap-2">
						<SnowProfile
							size="sm"
							score={parseInt(nftTokenNumber || "") || 0}
							src={imageUrl}
							url={`/members/${id}`}
							className="relative"
						/>
						<div className="flex flex-col items-start justify-between gap-[2.58px]">
							<h4 className="flex-1 break-words text-base font-bold capitalize leading-[27px] tracking-wide text-white">
								{name}
							</h4>
							<p className="text-sm leading-normal tracking-tight text-[#CDCFD0]">
								{titleCase(title || "Builder")}
							</p>
						</div>
					</div>
					{isAdmin && (
						<Popover.Root>
							<Popover.Trigger asChild>
								<div
									className="flex items-start justify-start gap-1"
									onClick={(e) => e.stopPropagation()}
								>
									<EllipsisVertical size={14} />
								</div>
							</Popover.Trigger>
							{/* Changed Popover positioning to fixed */}
							<Popover.Content className="absolute -right-2 z-[9999]  mt-1 flex min-w-[136px] cursor-pointer flex-col rounded-[16px] border-2 border-[#F2C650] bg-gradient-to-b from-black/80 to-black p-3 font-circular text-sm backdrop-blur-3xl">
								{cardType === "joined" && (
									<div className="flex w-full flex-col gap-3 text-xs">
										<p
											className="w-full"
											onClick={(e) =>
												!isMakeAdminLoading &&
												!isRemovingLoading
													? handleMakeUserAdmin(
															e,
															member?.userId as string
														)
													: null
											}
										>
											{isMakeAdminLoading &&
											member?.userId === uniqueId
												? "Making Admin..."
												: "Make Admin"}
										</p>

										{memberType !== "admin" && isAdmin && (
											<p
												className="w-full text-red-300"
												onClick={(e) =>
													!isMakeAdminLoading &&
													!isRemovingLoading
														? handleRemoveUser(
																e,
																member?.userId
															)
														: null
												}
											>
												{isRemovingLoading &&
												member?.userId === uniqueId
													? "Deleting..."
													: "Delete Member"}
											</p>
										)}
									</div>
								)}
								{cardType === "invited" && (
									<div className="flex w-full flex-col gap-3 text-xs">
										<p
											className="w-full"
											onClick={(e) => {
												e.stopPropagation();
												setUniqueId(member?.inviteId);
												!isInviting && !isRevoking
													? handleAddSelected?.(
															member
														)
													: null;
											}}
										>
											{isInviting &&
											member?.inviteId === uniqueId
												? "Loading..."
												: "Resend Invite"}
										</p>

										<div className="flex cursor-pointer items-center">
											<p
												className="w-full text-red-300"
												onClick={(e) => {
													e.stopPropagation();
													setUniqueId(
														member?.inviteId
													);
													!isRevoking && !isInviting
														? handleRemoval?.(
																member?.inviteId
															)
														: null;
												}}
											>
												{isRevoking &&
												member?.inviteId === uniqueId
													? "Revoking..."
													: "Revoke Invite"}
											</p>
										</div>
									</div>
								)}
								{cardType === "applicant" && (
									<div className="flex w-full flex-col gap-3 text-xs">
										<p
											className="w-full"
											onClick={(e) => {
												e.stopPropagation();
												setUniqueId(
													member?.applicationId
												);
												!isApprovalLoading &&
												!isRejectionLoading
													? handleApprove?.(
															member?.applicationId
														)
													: null;
											}}
										>
											{isApprovalLoading &&
											member?.applicationId === uniqueId
												? "Accepting..."
												: "Accept"}
										</p>
										<p
											className="w-full text-red-300"
											onClick={(e) => {
												e.stopPropagation();
												setUniqueId(
													member?.applicationId
												);
												!isApprovalLoading &&
												!isRejectionLoading
													? handleRejection?.(
															member?.applicationId
														)
													: null;
											}}
										>
											{isRejectionLoading &&
											member?.applicationId === uniqueId
												? "Rejecting..."
												: "Reject"}
										</p>
									</div>
								)}
							</Popover.Content>
						</Popover.Root>
					)}
				</div>
				<div className="flex w-full justify-between">
					<div className="flex items-center justify-start gap-1">
						{skills?.length > 0 && (
							<div className="flex w-full flex-wrap items-center gap-2">
								{skills?.slice(0, 3).map(
									(
										skill: {
											name: string;
											color: string;
										},
										i: number
									) => {
										const { color, name: n } = skill;
										const s = n || skill;
										return (
											<span
												key={i}
												className="w-max shrink-0  items-center gap-2 rounded-3xl px-3 py-0.5 text-center text-xs capitalize text-black"
												style={{
													backgroundColor:
														color || "#B2AAE9",
												}}
											>
												{limitString(s as string)}
											</span>
										);
									}
								)}
							</div>
						)}
					</div>
					<div className="flex items-center">
						<Button
							type="button"
							variant="outline"
							size="xs"
							className=" rounded-full !border py-1 text-lemon-green"
							disabled={isRemovingLoading}
							onClick={gotoMembersMessage}
						>
							<MessageSquare size={14} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
