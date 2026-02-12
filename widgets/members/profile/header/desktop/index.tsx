"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, Edit } from "lucide-react";
import Link from "next/link";
import { type FC, useState } from "react";
import { useWindowSize } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";

// import { getAvatarColor } from "@/lib/utils";
// import { InviteAmbassador4Desktop } from "./invite";
import { InviteMemberToGroup4Desktop } from "./invite/groups-invite";
import ImageWithFallback from "@/components/common/image-fallback";
import { replaceIPFSWithGatewayURL, truncateName } from "@/lib/utils";

interface Props {
	_id: string;
	name: string;
	position: string;
	score?: number;
	skills: Array<{
		name: string;
		backgroundColor: string;
	}>;
	profileImage?: string;
	isOwnProfile?: boolean;
	userIsPartner?: boolean;
	isPartner?: boolean;
	nftDetails?: {
		nftImageUrl: string;
		nftTokenNumber: string;
	};
}

export const ProfileHeader: FC<Props> = ({
	_id,
	name,
	position,
	score,
	skills,
	isOwnProfile,
	profileImage,
	isPartner,
	userIsPartner,
	nftDetails,
}) => {
	// const borderColor = getAvatarColor(score);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const size = useWindowSize();

	return (
		<>
			<InviteMemberToGroup4Desktop
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				talentId={_id}
			/>

			<div className="relative flex max-h-[242px] min-h-[200px] w-full gap-6 overflow-hidden rounded-2xl border-2 border-[#F2C650] bg-ink-darkest/40 from-white via-transparent to-white p-4 px-4 py-3 backdrop-blur-sm">
				<div
					className="absolute -left-[0.05rem] top-1/2 h-1/2 w-full opacity-30"
					style={{
						backgroundColor: "#F4FCFF26",
						borderTop: "1px solid #F4FCFF50",
					}}
				/>
				<div className="flip-container !h-[170px]">
					<div className="flip-inner">
						<div className="flip-front">
							{size.width &&
								(!isOwnProfile ? (
									<SnowProfile
										src={profileImage}
										score={score}
										size={
											size.width > 1530
												? "xl"
												: size.width > 768
													? "lg"
													: "sm"
										}
										isPartner={isPartner}
									/>
								) : (
									<SnowProfile
										src={profileImage}
										score={score}
										size={
											size.width > 1530
												? "xl"
												: size.width > 768
													? "lg"
													: "sm"
										}
										isPartner={userIsPartner}
									/>
								))}
						</div>
						<div className="flip-back">
							{nftDetails?.nftImageUrl ? (
								<ImageWithFallback
									alt="nft"
									imageUrl={replaceIPFSWithGatewayURL(
										nftDetails?.nftImageUrl
									)}
									fallbackImage={profileImage || ""}
									priority={true}
									quality={75}
									className="cursor-pointer rounded-lg object-contain"
									width={120}
									height={140}
								/>
							) : (
								<>
									{size.width &&
										(!isOwnProfile ? (
											<SnowProfile
												src={profileImage}
												score={score}
												size={
													size.width > 1530
														? "xl"
														: size.width > 768
															? "lg"
															: "sm"
												}
												isPartner={isPartner}
											/>
										) : (
											<SnowProfile
												src={profileImage}
												score={score}
												size={
													size.width > 1530
														? "xl"
														: size.width > 768
															? "lg"
															: "sm"
												}
												isPartner={userIsPartner}
											/>
										))}
								</>
							)}
						</div>
					</div>
				</div>
				<div className="grid grow grid-cols-1 gap-5">
					<div className="flex w-full flex-row justify-between gap-2">
						<div className="flex w-full flex-row flex-wrap items-center justify-between gap-2">
							<div className="flex flex-col gap-1">
								<h1 className="truncate text-3xl font-bold text-white">
									{profileImage ? name : truncateName(name)}
								</h1>
								{position !== "" && (
									<div className="flex items-center gap-2 capitalize text-white">
										<Briefcase size={24} />
										<span className="text-lg">
											{position}
										</span>
									</div>
								)}
							</div>

							{!isOwnProfile ? (
								isPartner ? (
									userIsPartner && (
										<Button
											fullWidth
											variant="outline"
											asChild
											className="max-w-[150px] rounded-full py-2 text-lg"
										>
											<Link
												href={`/messages?userId=${_id}`}
											>
												Message
											</Link>
										</Button>
									)
								) : (
									<div
										className={`flex w-fit items-center gap-3`}
									>
										<Button
											fullWidth
											variant="outline"
											asChild
											className="rounded-full py-2 text-lg"
										>
											<Link
												href={`/messages?userId=${_id}`}
											>
												Message
											</Link>
										</Button>

										<Button
											fullWidth
											variant="default"
											onClick={() => setIsModalOpen(true)}
											className="rounded-full py-2"
										>
											Invite
										</Button>
									</div>
								)
							) : (
								<div className="ml-auto flex w-full max-w-[300px] flex-row items-center justify-end">
									<Button
										fullWidth
										variant="white"
										className="w-max"
										asChild
									>
										<Link
											href="/settings"
											className="flex flex-row gap-2"
										>
											<Edit size={24} />
											Edit Profile
										</Link>
									</Button>
								</div>
							)}
						</div>
					</div>

					<div className="flex h-fit flex-wrap gap-2 pt-4">
						{skills.slice(0, 12).map((skill, i) => (
							<span
								key={i}
								className="rounded-full bg-white px-6 py-1.5 text-sm font-medium capitalize text-[#090A0A]"
								style={{
									backgroundColor: skill.backgroundColor,
								}}
							>
								{skill.name}
							</span>
						))}
					</div>
				</div>
			</div>
		</>
	);
};
