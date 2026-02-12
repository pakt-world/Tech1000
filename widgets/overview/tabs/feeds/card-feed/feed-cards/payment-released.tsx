"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, X } from "lucide-react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import { type CoinProps } from "@/lib/types/collection";
import { formatNumber } from "@/lib/utils";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

interface PaymentReleasedProps {
	id: string;
	amount: string;
	title: string;
	talent: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	bookmarked: boolean;
	bookmarkId: string;
	creator: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
	};
	isCreator: boolean;
	close?: (id: string) => void;
	coin: CoinProps;
}
export const PaymentReleased = ({
	id,
	talent,
	creator,
	title,
	amount,
	bookmarked,
	bookmarkId,
	isCreator,
	close,
	coin,
}: PaymentReleasedProps): JSX.Element => {
	const tab = useMediaQuery("(min-width: 640px)");
	return tab ? (
		<div className="container_style relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl !border-[#7DDE86] px-4 pl-2">
			<SnowProfile
				src={creator?.avatar}
				score={creator?.score}
				size="lg"
				url={`/members/${isCreator ? talent?._id : creator?._id}`}
				isPartner
			/>
			<div className="flex w-full flex-col gap-4 py-4">
				<div className="flex w-full items-center justify-between">
					<h3 className="text-xl font-bold text-white">
						{isCreator ? "Bounty Completed" : "Payment Released"}
					</h3>
					{close && (
						<X
							size={20}
							className="cursor-pointer text-white"
							onClick={() => {
								close(id);
							}}
						/>
					)}
				</div>
				{isCreator ? (
					<p className="text-3xl text-white">{title}</p>
				) : (
					<div className="flex items-center gap-2">
						{coin && (
							<div className="flex flex-wrap items-center gap-1">
								<span className="text-2xl leading-normal tracking-tight text-white 2xl:text-3xl">
									{`${formatNumber(Number(amount))} `}
								</span>
								<Image
									src={coin?.icon}
									alt={coin?.name}
									className="h-[40px] w-[40px] rounded-full"
									width={40}
									height={40}
								/>
								<span className="text-2xl leading-normal tracking-tight text-white 2xl:text-3xl">
									{coin?.symbol.toUpperCase()}
								</span>
								<span className="text-2xl leading-normal tracking-tight text-white 2xl:text-3xl">
									has been released to your wallet! 💰
								</span>
							</div>
						)}
					</div>
				)}
				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Link href="/wallet">
							<Button
								size="sm"
								variant="white"
								className="w-[120px]"
							>
								View Wallet
							</Button>
						</Link>
					</div>
					<RenderBookMark
						size={20}
						isBookmarked={bookmarked}
						type="feed"
						id={id}
						bookmarkId={bookmarkId}
					/>
				</div>
			</div>

			<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
				<Briefcase size={200} color="#ECFCE5" className="opacity-20" />
			</div>
		</div>
	) : (
		<Link
			href="/wallet"
			className="container_style relative z-10 flex w-full gap-4 overflow-hidden !border-l-0 !border-r-0 border-b !border-[#7DDE86] bg-[#FBFFFA] px-[21px] py-4 sm:hidden"
		>
			<div className="flex w-full flex-col gap-4">
				<div className="flex w-full items-center justify-between">
					<h3 className="text-base font-medium leading-normal tracking-tight text-gray-300">
						{isCreator ? "Bounty Completed" : "💰 Payment Released"}
					</h3>
				</div>

				<div className="flex items-end justify-between gap-2">
					<p className="text-lg text-white">
						{isCreator
							? `${title}`
							: `$${formatNumber(Number(amount))} has been added to Your Wallet! 💰`}
					</p>
					<RenderBookMark
						size={20}
						isBookmarked={bookmarked}
						type="feed"
						id={id}
						bookmarkId={bookmarkId}
					/>
				</div>
			</div>
		</Link>
	);
};
