"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Clock4, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyAmountAndSlot } from "@/components/common/bounty-amount-and-slot";
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import { slotInfo } from "@/lib/actions";
import { Roles } from "@/lib/enums";
import type { CoinProps, CollectionProps } from "@/lib/types/collection";
import { determineRole, titleCase } from "@/lib/utils";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

import { BountyFeedWrapper } from "./misc/wrapper";

export interface InviterProps {
	_id: string;
	name: string;
	avatar?: string | undefined;
	score: number;
	type: Roles;
	role: Roles;
}

interface BountyInvitePendingProps {
	feedId: string;
	bountyId: string;
	title: string;
	inviteId: string;
	amount: string;
	inviter: InviterProps;
	imageUrl?: string;
	invitationExpiry?: string;
	bookmarked?: boolean;
	bookmarkId: string;
	type: "bounty-invite-pending";
	close?: (id: string) => void;
	realTimeRate: number;
	coin: CoinProps;
	isDeleted?: boolean;
	bountyData: CollectionProps;
}

interface BountyFilledProps {
	feedId: string;
	title: string;
	inviter: InviterProps;
	bookmarked: boolean;
	bookmarkId: string;
	type: "bounty-invite-filled";
	imageUrl?: string;
	close?: (id: string) => void;
	realTimeRate: number;
	coin: CoinProps;
}

interface BountyResponseProps {
	feedId: string;
	title: string;
	bountyId: string;
	talent: InviterProps;
	bookmarkId: string;
	bookmarked: boolean;
	accepted: boolean;
	cancelled: boolean;
	type: "bounty-invite-response";
	imageUrl?: string;
	close?: (id: string) => void;
	realTimeRate: number;
	coin: CoinProps;
	amount: number;
	bountyData: CollectionProps;
}

type BountyFeedCardProps =
	| BountyInvitePendingProps
	| BountyFilledProps
	| BountyResponseProps;

export const BountyFeedCard = (props: BountyFeedCardProps): ReactElement => {
	const { type } = props;
	const tab = useMediaQuery("(min-width: 640px)");
	const router = useRouter();

	if (type === "bounty-invite-filled") {
		const { feedId, title, bookmarked, bookmarkId, inviter, close } = props;

		return tab ? (
			<BountyFeedWrapper>
				<SnowProfile
					src={inviter?.avatar}
					score={inviter?.score}
					size="lg"
					url={`/members/${inviter?._id}`}
				/>
				<div className="flex w-full flex-col gap-4 py-4">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold text-neutral-400">
							Bounty Filled
						</h3>

						{close && (
							<X
								size={20}
								className="cursor-pointer"
								onClick={() => {
									close(feedId);
								}}
							/>
						)}
					</div>

					<p className="text-white">
						The{" "}
						<span className="text-bold text-white">
							&quot;{title}&quot;
						</span>{" "}
						Bounty you applied to has been filled. You can check out
						more public bounties that fit your profile
					</p>

					<div className="mt-auto flex items-center justify-between">
						<Button
							size="sm"
							variant="white"
							className="w-[120px]"
							asChild
						>
							<Link href="/bounties">See More Bounties</Link>
						</Button>
						<RenderBookMark
							size={20}
							isBookmarked={bookmarked}
							type="feed"
							id={feedId}
							bookmarkId={bookmarkId}
						/>
					</div>
				</div>
			</BountyFeedWrapper>
		) : (
			<div className="flex">
				<SnowProfile
					src={inviter.avatar}
					score={inviter.score}
					size="lg"
					url={`/members/${inviter._id}`}
				/>
				<div className="flex w-full flex-col gap-4 py-4">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold text-title">
							Bounty Filled
						</h3>

						{close && (
							<X
								size={20}
								className="cursor-pointer"
								onClick={() => {
									close(feedId);
								}}
							/>
						)}
					</div>
					<p className="text-body">
						The{" "}
						<span className="text-bold text-title">
							&quot;{title}&quot;
						</span>{" "}
						Bounty you applied to has been filled. You can check out
						more public bounties that fit your profile
					</p>
					<div className="mt-auto flex items-center gap-4">
						<Button
							size="md"
							fullWidth
							variant="outline"
							className="w-[120px]"
							onClick={() => {
								router.push(`/bounties`);
							}}
						>
							See More Bounties
						</Button>

						<RenderBookMark
							size={20}
							isBookmarked={bookmarked}
							type="feed"
							id={feedId}
							bookmarkId={bookmarkId}
						/>
					</div>
				</div>
			</div>
		);
	}

	if (type === "bounty-invite-pending") {
		const {
			title,
			amount,
			inviter,
			invitationExpiry,
			inviteId,
			bountyId,
			realTimeRate,
			coin,
			isDeleted,
			bountyData,
		} = props;
		const isPartner = determineRole(inviter) === Roles.PARTNER;
		const si = slotInfo(bountyData);

		return tab ? (
			<BountyFeedWrapper>
				<SnowProfile
					src={inviter?.avatar}
					score={inviter?.score}
					size="lg"
					url={`/members/${inviter?._id}`}
					isPartner={isPartner}
				/>
				<div className="flex w-full flex-col gap-4 py-4">
					<div className="flex items-center justify-between">
						<span className="text-xl font-bold text-neutral-400">
							{inviter?.name} Invited you to join
						</span>

						<div className="flex items-center gap-2">
							{invitationExpiry && (
								<div className="flex items-center gap-1 text-sm text-white">
									<Clock4 size={20} />
									<span>Time left: 1:48:00</span>
								</div>
							)}
						</div>
					</div>

					<span className="text-2xl font-normal text-white">
						{title}
					</span>

					<div className="mt-auto flex items-center justify-between">
						{isDeleted ? (
							<div className="flex items-center justify-center rounded-2xl bg-red-500 px-4 py-1">
								<span className="text-lg text-white ">
									Deleted
								</span>
							</div>
						) : (
							<div className="mt-auto flex items-center gap-2">
								<BountyAmountAndSlot
									coin={coin}
									acceptedSlot={si.acceptedSlot}
									totalSlot={si.totalSlot}
									realTimeRate={realTimeRate}
									paymentFee={Number(amount)}
									spotVariant="light"
									amountVariant="light"
									spotType={
										si.acceptedSlot === 0
											? "empty"
											: "filled"
									}
									className="h-9 !text-base [&>*]:!text-base"
								/>

								<Button
									size="sm"
									variant="white"
									className="w-[120px]"
									asChild
								>
									<Link
										href={`/bounties/${bountyId}?invite-id=${inviteId}`}
									>
										See Details
									</Link>
								</Button>
							</div>
						)}
					</div>
				</div>
			</BountyFeedWrapper>
		) : (
			<div className="primary_border-y relative z-10 flex w-full flex-col gap-4 overflow-hidden border-b bg-primary px-[21px] py-4 sm:hidden">
				<div className="relative -left-[5px] flex items-center gap-2">
					<SnowProfile
						src={inviter.avatar}
						score={inviter.score}
						size="sm"
						url={`/members/${inviter._id}`}
						isPartner={isPartner}
					/>
					<div className="inline-flex flex-col items-start justify-start">
						<p className="flex text-lg leading-[27px] tracking-wide text-white">
							{inviter.name}
						</p>
						<span className="text-xs leading-[18px] tracking-wide text-gray-300">
							{titleCase(inviter.role)}
						</span>
					</div>
				</div>
				<div className="flex w-full flex-col gap-2">
					<div className="flex items-center justify-between">
						<span className="text-base font-normal text-white">
							{inviter.name} Invited you to &apos; {title} &apos;
							Bounty.
						</span>

						<div className="flex items-center gap-2">
							{invitationExpiry && (
								<div className="flex items-center gap-1 text-sm text-body">
									<Clock4 size={20} />
									<span>Time left: 1:48:00</span>
								</div>
							)}
						</div>
					</div>

					<div className="mt-3 w-full">
						<BountyAmountAndSlot
							coin={coin}
							acceptedSlot={si.acceptedSlot}
							totalSlot={si.totalSlot}
							realTimeRate={realTimeRate}
							paymentFee={Number(amount)}
							spotVariant="light"
							amountVariant="light"
							spotType={
								si.acceptedSlot === 0 ? "empty" : "filled"
							}
						/>
					</div>
				</div>
				<Button
					size="md"
					fullWidth
					variant="outline"
					className="w-[120px]"
					onClick={() => {
						router.push(
							`/bounties/${bountyId}?invite-id=${inviteId}`
						);
					}}
				>
					See Details
				</Button>
			</div>
		);
	}

	if (type === "bounty-invite-response") {
		const {
			feedId,
			title,
			amount,
			bookmarked,
			bookmarkId,
			talent,
			bountyId,
			close,
			accepted,
			cancelled,
			realTimeRate,
			coin,
			bountyData,
		} = props;
		const si = slotInfo(bountyData);

		return tab ? (
			<BountyFeedWrapper>
				<SnowProfile
					src={talent.avatar}
					score={talent.score}
					size="lg"
					url={`/members/${talent._id}`}
				/>

				<div className="flex w-full flex-col gap-4 py-4">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold text-neutral-400">
							Group Invitation
							{cancelled
								? " cancelled"
								: accepted
									? " Accepted"
									: " Declined"}
						</h3>

						{close && (
							<X
								size={20}
								className="cursor-pointer text-white"
								onClick={() => {
									close(feedId);
								}}
							/>
						)}
					</div>

					<p className="text-white">
						{talent.name} has{" "}
						{cancelled
							? "cancelled"
							: accepted
								? "Accepted"
								: "Declined"}{" "}
						<span className="text-bold text-white">
							&quot;{title}&quot;
						</span>{" "}
						Bounty.
					</p>

					<div className="mt-auto flex items-center justify-between gap-2">
						<div className="mt-auto flex items-center gap-2">
							<BountyAmountAndSlot
								coin={coin}
								acceptedSlot={si.acceptedSlot}
								totalSlot={si.totalSlot}
								realTimeRate={realTimeRate}
								paymentFee={Number(amount)}
								spotVariant="light"
								amountVariant="light"
								className="h-9 !text-base [&>*]:!text-base"
							/>
							<Button
								size="sm"
								variant="white"
								className="w-[120px]"
								asChild
							>
								<Link href={`/bounties/${bountyId}`}>
									See Details
								</Link>
							</Button>
						</div>
						<RenderBookMark
							size={20}
							isBookmarked={bookmarked}
							type="feed"
							id={feedId}
							bookmarkId={bookmarkId}
						/>
					</div>
				</div>
			</BountyFeedWrapper>
		) : (
			<div className="container_style relative z-10 flex w-full flex-col gap-4 overflow-hidden !border-l-0 !border-r-0 border-b border-t !border-[#48A7F8] px-[21px] py-4 sm:hidden">
				<div className="relative -left-[5px] flex items-center gap-2">
					<SnowProfile
						score={talent.score}
						src={talent.avatar}
						size="sm"
						url={`/members/${talent._id}`}
					/>
					<h3 className="text-base font-bold text-white">
						Group Invitation{" "}
						{cancelled
							? "cancelled"
							: accepted
								? "Accepted"
								: "Declined"}
					</h3>
				</div>
				<div className="flex w-full flex-col gap-2">
					<div className="flex w-full items-center justify-between gap-2">
						<h3 className="w-[90%] text-lg font-normal text-white">
							{talent.name} has{" "}
							{cancelled
								? "cancelled"
								: accepted
									? "Accepted"
									: "Declined"}{" "}
							&quot;{title}&quot; group.
						</h3>
					</div>
					<div className="mt-3 flex w-full justify-between gap-2">
						<BountyAmountAndSlot
							coin={coin}
							acceptedSlot={si.acceptedSlot}
							totalSlot={si.totalSlot}
							realTimeRate={realTimeRate}
							paymentFee={Number(amount)}
							spotVariant="light"
							amountVariant="light"
						/>
						<RenderBookMark
							size={20}
							isBookmarked={bookmarked}
							type="feed"
							id={feedId}
							bookmarkId={bookmarkId}
						/>
					</div>
				</div>
				<Button
					size="md"
					fullWidth
					variant="outline"
					className="w-[120px]"
					onClick={() => {
						router.push(`/bounties/${bountyId}`);
					}}
				>
					See Details
				</Button>
			</div>
		);
	}

	return <div />;
};
