"use client";

import { useIsClient, useWindowSize } from "usehooks-ts";
import { Skeleton } from "@/components/common/skeletons/skeleton";
import { SnowProfile } from "@/components/common/snow-profile";
import { Roles } from "@/lib/enums";
import { type AccountProps } from "@/lib/types/account";
import React from "react";
import { useRouter } from "next/navigation";
import ImageWithFallback from "@/components/common/image-fallback";
import { replaceIPFSWithGatewayURL } from "@/lib/utils";

export const UserProfile = ({
	account,
}: {
	account: AccountProps;
}): JSX.Element | boolean => {
	const router = useRouter();
	const size = useWindowSize();
	const isPartner = account.role === Roles.PARTNER;
	const isClient = useIsClient();
	const s =
		size.width > 1440 && size.height > 800
			? "xl"
			: size.width > 650
				? "lg"
				: "md";
	const size4Skeleton =
		size.width > 1440 && size.height > 800 ? "h-40 w-40" : "h-20 w-20";
	const accountIsLoading = account._id === "";

	return (
		isClient &&
		size.width && (
			<>
				<div className="flip-container">
					<div className="flip-inner flex justify-center">
						{/* Profile Side */}
						<div className="flip-front flex w-full flex-col items-start gap-1 sm:items-center">
							{accountIsLoading ? (
								<Skeleton
									className={`mb-1 rounded-full ${size4Skeleton}`}
								/>
							) : (
								<SnowProfile
									score={
										parseInt(
											account?.meta?.tokenId || ""
										) || 0
									}
									src={account?.profileImage?.url}
									url="/profile"
									size={s}
									isPartner={isPartner}
								/>
							)}

							<div className="flex w-full flex-col items-center gap-0">
								{accountIsLoading ? (
									<Skeleton className="mb-1 h-5 w-24" />
								) : (
									<span className="text-center text-lg leading-[27px] tracking-wide text-white">
										{account?.firstName}{" "}
										{!isPartner && account?.lastName}
									</span>
								)}
								{accountIsLoading ? (
									<Skeleton className="mb-1 h-4 w-36" />
								) : (
									<span className="text-sm capitalize leading-[21px] tracking-wide text-sky/70">
										{account?.profile?.bio?.title}
									</span>
								)}
							</div>
						</div>

						{/* NFT Card Side */}
						<div className="flip-back">
							{account?.meta?.imageUrl ? (
								<ImageWithFallback
									alt="nft"
									imageUrl={replaceIPFSWithGatewayURL(
										account?.meta?.imageUrl || ""
									)}
									fallbackImage={
										account?.profileImage?.url || ""
									}
									priority={true}
									quality={75}
									className="cursor-pointer rounded-lg object-contain"
									width={154}
									height={
										size.height > 800
											? 240
											: size.height > 500 &&
												  size.height < 800
												? 200
												: 150
									}
									onClick={() => router.push("/profile")}
								/>
							) : (
								<div className="flex w-full flex-col items-start gap-1 sm:items-center">
									<SnowProfile
										score={
											parseInt(
												account?.meta?.tokenId || ""
											) || 0
										}
										src={account?.profileImage?.url}
										url="/profile"
										size={s}
										isPartner={isPartner}
									/>
									<div className="flex w-full flex-col items-center gap-0">
										{accountIsLoading ? (
											<Skeleton className="mb-1 h-5 w-24" />
										) : (
											<span className="text-center text-lg leading-[27px] tracking-wide text-white">
												{account?.firstName}{" "}
												{!isPartner &&
													account?.lastName}
											</span>
										)}
										{accountIsLoading ? (
											<Skeleton className="mb-1 h-4 w-36" />
										) : (
											<span className="text-sm capitalize leading-[21px] tracking-wide text-sky/70">
												{account?.profile?.bio?.title}
											</span>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</>
		)
	);
};
