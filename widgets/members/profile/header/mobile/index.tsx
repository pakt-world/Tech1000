"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, Settings, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState, type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import ImageWithFallback from "@/components/common/image-fallback";
import { replaceIPFSWithGatewayURL } from "@/lib/utils";
import { useWindowSize } from "usehooks-ts";

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

export const MobileProfileHeader: FC<Props> = ({
	_id,
	name,
	position,
	score,
	isOwnProfile,
	profileImage,
	isPartner,
	userIsPartner,
	nftDetails,
}) => {
	const size = useWindowSize();
	const [isFlipped, setIsFlipped] = useState(false);

	const handleFlip = (e) => {
		e.stopPropagation();
		setIsFlipped(!isFlipped);
	};

	return (
		<>
			<div className="relative flex h-full w-full gap-2 border-white/20 bg-ink-darkest/40 from-white via-transparent to-white p-4 py-3 pl-1 pr-6 backdrop-blur-sm">
				<div>
					<div
						className={`flip-container !h-[120px] !w-[120px] ${isFlipped ? "flipped" : "flipped-reverse"}`}
					>
						<div className="flip-inner">
							<div className="flip-front" onClick={handleFlip}>
								{!isOwnProfile ? (
									<SnowProfile
										src={profileImage}
										score={score}
										size="2md"
										isPartner={isPartner}
									/>
								) : (
									<SnowProfile
										src={profileImage}
										score={score}
										size="2md"
										isPartner={userIsPartner}
									/>
								)}
							</div>
							<div
								className="flip-back flex !h-full w-[80px] items-center align-middle"
								onClick={handleFlip}
							>
								{nftDetails?.nftImageUrl ? (
									<ImageWithFallback
										alt="nft"
										imageUrl={replaceIPFSWithGatewayURL(
											nftDetails?.nftImageUrl
										)}
										fallbackImage={profileImage || ""}
										priority={true}
										quality={75}
										className=" cursor-pointer rounded-lg object-contain"
										layout="fill"
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
																: "2md"
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
																: "2md"
													}
													isPartner={userIsPartner}
												/>
											))}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="grid grow grid-cols-1 gap-5">
					<div className="flex w-full flex-row justify-between gap-2">
						<div className="flex w-full flex-row flex-wrap items-center justify-between gap-2">
							<div className="flex flex-col gap-1">
								<h1 className="truncate text-lg font-bold text-white">
									{name}
								</h1>
								<div className="flex items-center gap-2 capitalize text-white">
									<Briefcase size={20} />
									<span className="text-base">
										{position}
									</span>
								</div>
							</div>

							{!isOwnProfile ? (
								<div className="flex w-full items-center gap-3">
									<Button
										asChild
										className="rounded-lg !border-2 !border-lemon-green !bg-transparent px-4 py-2 text-white"
									>
										<Link
											href={`/messages?userId=${_id}`}
											className="!text-white"
										>
											<MessageSquare
												size={20}
												className="text-white"
											/>
										</Link>
									</Button>
									<Button
										fullWidth
										variant="white"
										asChild
										className="bg-lemon-green"
									>
										<Link
											href={`/members/${_id}/invite`}
											className=""
										>
											Invite
										</Link>
									</Button>
								</div>
							) : (
								<div className="flex w-full flex-row items-center">
									<Button asChild variant="white" size="sm">
										<Link
											href="/settings"
											className="flex flex-row gap-2 text-sm"
										>
											<Settings size={20} />
											Account Settings
										</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
