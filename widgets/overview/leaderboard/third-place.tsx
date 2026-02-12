"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { SnowProfile } from "@/components/common/snow-profile";
import { truncate } from "@/lib/utils";

import { type LeaderBoardItemProps } from "./types";

export const ThirdPlace = ({
	_id,
	name,
	score,
	nftTokenNumber,
	avatar,
	desktop,
	scoreLabel,
}: LeaderBoardItemProps & {
	desktop?: boolean;
}): JSX.Element => {
	const router = useRouter();

	return desktop ? (
		<div className="relative">
			<svg
				width="247"
				height="62"
				viewBox="0 0 247 62"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0 16.3501C0 7.51355 7.12633 0.3501 15.9629 0.350102C43.0612 0.350109 97.6342 0.350122 123.5 0.350122C149.366 0.350122 203.939 0.350109 231.037 0.350102C239.874 0.3501 247 7.51354 247 16.3501V45.3201C247 54.1566 239.861 61.3201 231.025 61.3201C213.719 61.3201 180.612 61.3201 123.5 61.3201C66.3877 61.3201 33.2809 61.3201 15.9752 61.3201C7.13868 61.3201 0 54.1567 0 45.3201V16.3501Z"
					fill="url(#paint0_linear_15151_31)"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_15151_31"
						x1="9.04763"
						y1="62.3191"
						x2="174"
						y2="-78.9999"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#116D73" />
						<stop offset="1" stopColor="#3E97AA" />
					</linearGradient>
				</defs>
			</svg>

			<div className="absolute inset-0 flex items-center gap-2 p-3 pl-1">
				<SnowProfile
					src={avatar}
					score={Math.round(nftTokenNumber)}
					size="sm"
					url={`members/${_id}`}
				/>
				<div className="grow">
					<span className="text-base text-[#ECFCE5]">
						{truncate(name, 15)}
					</span>
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm text-[#F2F4F5]">
							{scoreLabel}: {Math.round(score)}
						</span>
						<Image
							src="/icons/medal-3.png"
							width={28}
							height={28}
							alt=""
						/>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div
			role="button"
			tabIndex={0}
			onClick={() => {
				router.push(`/members/${_id}`);
			}}
			className="relative flex h-[67px] items-center justify-center rounded-2xl border border-[#1F3439] bg-mobile-l3"
		>
			<div className="flex w-full items-center gap-2 p-3 pl-1">
				<SnowProfile
					src={avatar}
					score={Math.round(score)}
					size="sm"
					url={`members/${_id}`}
				/>
				<div className="grow">
					<span className="text-base text-[#ECFCE5]">
						{truncate(name, 15)}
					</span>
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm text-[#F2F4F5]">
							{scoreLabel}: {Math.round(score)}
						</span>
						<Image
							src="/icons/medal-3.png"
							width={28}
							height={28}
							alt=""
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
