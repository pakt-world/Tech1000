"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import { type CoinProps } from "@/lib/types/collection";
import { type MemberProps } from "@/lib/types/member";
import { formatNumber, formatNumberWithCommas } from "@/lib/utils";

interface Props {
	status?: "ongoing" | "cancel_requested";
	createdAt: string;
	deliveryDate: string;
	paymentFee: number;
	profile: MemberProps;
	tags: Array<{
		color: string;
		name: string;
	}>;
	meta: {
		coin: CoinProps;
	};
	realTimeRate: number;
}

export const BountyUpdateHeader: FC<Props> = ({
	createdAt,
	profile,
	deliveryDate,
	paymentFee,
	tags,
	status = "ongoing",
	meta,
	realTimeRate,
}) => {
	return (
		<div className="flex flex-col gap-4">
			<div
				className="flex items-start divide-x divide-[#FF98984D] rounded-2xl border p-4"
				style={{
					borderColor:
						status === "cancel_requested" ? "#FFBDBD" : "#FF98984D",
					backgroundColor: "#262020",
				}}
			>
				<div className="flex flex-col gap-2 pr-3">
					<span className="text-base text-sky">Created</span>
					<span className="text-base text-white">
						{format(new Date(createdAt), "dd/MM/yyyy")}
					</span>
				</div>
				<div className="flex flex-col gap-2 px-3">
					<span className="text-base text-sky">Due</span>
					<span className="text-base text-white">
						{format(new Date(deliveryDate), "dd/MM/yyyy")}
					</span>
				</div>

				<div className="flex flex-col gap-2 px-4">
					<span className="text-base text-sky">Price</span>

					<div className="inline-flex items-center gap-1 text-lg text-white">
						<p className="text-base leading-normal tracking-tight text-white">
							{formatNumber(paymentFee)}{" "}
						</p>
						<Image
							src={meta.coin?.icon}
							alt={meta.coin?.name}
							width={20}
							height={20}
							className="h-[20px] w-[20px] overflow-hidden rounded-full bg-cover"
						/>
						<p className="text-base leading-normal tracking-tight text-white">
							{meta.coin?.symbol.toUpperCase()} ($
							{formatNumberWithCommas(
								(realTimeRate * Number(paymentFee)).toFixed(2)
							)}
							)
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-2 pl-2">
					<span className="text-base text-sky">Status</span>
					<span
						className="inline-flex w-fit rounded-full px-3 py-1 text-center text-sm text-black"
						style={{
							borderColor:
								status === "cancel_requested"
									? "#FFBDBD"
									: "#FF98984D",
							backgroundColor:
								status === "cancel_requested"
									? "#EE4B2B"
									: "#7DDE86",
						}}
					>
						{status === "cancel_requested"
							? "Cancelling"
							: "Ongoing"}
					</span>
				</div>
			</div>

			<div
				className="flex flex-col divide-y divide-[#FF98984D] rounded-2xl border p-4"
				style={{
					borderColor:
						status === "cancel_requested" ? "#FFBDBD" : "#FF98984D",
					backgroundColor: "#262020",
				}}
			>
				<div className="flex items-center justify-between gap-2 pb-1">
					<div className="flex items-center gap-2">
						<SnowProfile
							score={profile?.score || 0}
							size="sm"
							src={profile.profileImage?.url}
							url={`/members/${profile?._id}`}
						/>
						<div className="flex flex-col">
							<span className="text-base font-bold text-white">{`
                  ${profile?.firstName} ${profile?.lastName}
                  `}</span>
							<span className="text-sm capitalize text-sky">
								{profile?.profile?.bio?.title !== undefined &&
								profile?.profile?.bio?.title !== null
									? profile?.profile?.bio?.title
									: ""}
							</span>
						</div>
					</div>
					<Button variant="outline" size="sm" asChild>
						<Link href={`/messages?userId=${profile?._id}`}>
							Message
						</Link>
					</Button>
				</div>
				<div className="flex items-center gap-2 pt-4">
					<span className="text-white">Skills:</span>
					<div className="flex items-center gap-2 text-sm">
						{(tags || [])?.map((t) => {
							return (
								<span
									key={t?.name}
									className="rounded-full px-4 py-0.5 capitalize"
									style={{
										backgroundColor: t?.color ?? "#ffffff",
									}}
								>
									{t?.name}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
