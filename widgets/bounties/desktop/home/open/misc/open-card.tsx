"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as Tooltip from "@radix-ui/react-tooltip";
import { useWindowSize } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { BountyAmountAndSlot } from "@/components/common/bounty-amount-and-slot";
import { SnowProfile } from "@/components/common/snow-profile";
import { slotInfo } from "@/lib/actions";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { Roles, type TagType } from "@/lib/enums";
import { type CollectionProps } from "@/lib/types/collection";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";
import Link from "next/link";

export const SkillBadge = ({
	skill,
}: {
	skill: {
		type: TagType;
		name: string;
		color: string;
	};
}): JSX.Element => {
	const size = useWindowSize();
	const threshold = size.width > 1024 ? 16 : 12;
	const isLongText = skill.name.length >= threshold;
	return (
		<div
			className={`${isLongText ? "max-2xl:!truncate" : ""} relative overflow-hidden whitespace-nowrap rounded-full bg-slate-100 px-4 py-1 text-[10px] capitalize max-lg:max-w-[120px] min-[1440px]:text-[14px]`}
			style={{
				background: skill.color,
			}}
		>
			{skill.name}
		</div>
	);
};

interface OpenBountyCardProps {
	bounty: CollectionProps;
	rates: ExchangeRateRecord | undefined;
	onRefresh?: () => void;
	savedId?: string;
	loggedInUser?: string;
	isSaved?: boolean;
	style?: React.CSSProperties;
	index?: string;
	className?: string;
	spotType?: "filled" | "empty";
}

export const OpenBountyCard = ({
	bounty,
	rates,
	onRefresh,
	savedId,
	isSaved,
	style,
	loggedInUser,
	index,
	className,
	spotType,
}: OpenBountyCardProps): JSX.Element | null => {
	// Remove ones with no creator
	if (!bounty?.creator) return null;
	const {
		creator,
		paymentFee,
		tags,
		name,
		_id,
		isBookmarked,
		bookmarkId,
		meta,
	} = bounty;
	const realTimeRate = rates ? (rates[meta?.coin?.reference] as number) : 0;

	const c = {
		_id: creator?._id || "",
		paktScore: creator?.score || 0,
		avatar: creator?.profileImage?.url || "",
		name: creator?.firstName || "Deleted User",
	};
	const si = slotInfo(bounty);

	return (
		<div
			className={`container_style flex !w-full flex-col gap-4 rounded-3xl p-4 sm:min-w-[452px] sm:grow ${className}`}
			style={style}
		>
			<Link
				href={`${creator === null || creator === undefined ? "/bounties" : `/bounties/${_id}`}`}
				className="flex w-full"
			>
				<SnowProfile
					src={c.avatar}
					score={c.paktScore}
					size="md"
					url={`/members/${c?._id}`}
					disabled={creator === null || creator === undefined}
					isPartner
					className="relative -left-2"
				/>

				<div className="flex flex-col justify-between gap-2 sm:grow">
					<div className="flex w-full items-center justify-between gap-2">
						<div className="relative flex w-full flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
							<Tooltip.Provider delayDuration={0}>
								<Tooltip.Root>
									<Tooltip.Trigger asChild>
										<span className="truncate text-sm font-medium text-white min-[1440px]:w-[110px] min-[1440px]:text-lg 2xl:w-[150px] 2xl-5:w-auto">
											{c?.name}
										</span>
									</Tooltip.Trigger>
									<Tooltip.Portal>
										<Tooltip.Content
											className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 z-[100] select-none rounded-xl border border-[#ff98984d] bg-[#262020] px-[15px] py-[10px] text-[15px] leading-none text-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
											sideOffset={5}
											side="bottom"
											align="center"
										>
											{c?.name}
											<Tooltip.Arrow className="fill-[#262020]" />
										</Tooltip.Content>
									</Tooltip.Portal>
								</Tooltip.Root>
							</Tooltip.Provider>
							<BountyAmountAndSlot
								coin={meta?.coin}
								paymentFee={paymentFee}
								realTimeRate={realTimeRate}
								amountVariant="dark"
								spotVariant="light"
								isPartner={loggedInUser === Roles.PARTNER}
								acceptedSlot={si.acceptedSlot}
								totalSlot={si.totalSlot}
								spotType={spotType}
							/>
							{index && (
								<p className="absolute right-4 text-xs leading-[18px] tracking-wide text-body">
									{index}
								</p>
							)}
						</div>
					</div>

					<p className="break-word flex grow items-center text-base leading-normal tracking-wide text-white sm:text-lg min-[1440px]:text-[22px]">
						{name}
					</p>
				</div>
			</Link>
			<div className="mt-auto flex items-center justify-between max-sm:w-full">
				<div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
					{tags.slice(0, 3).map((skill) => {
						return <SkillBadge key={skill.name} skill={skill} />;
					})}
				</div>

				<RenderBookMark
					id={_id}
					size={20}
					type="collection"
					isBookmarked={isBookmarked ?? isSaved}
					bookmarkId={savedId ?? _id ?? bookmarkId}
					callback={onRefresh}
				/>
			</div>
		</div>
	);
};
