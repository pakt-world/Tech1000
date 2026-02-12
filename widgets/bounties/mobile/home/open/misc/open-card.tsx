"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as Tooltip from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";
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
			className={`${isLongText ? "max-2xl:!truncate" : ""} relative overflow-hidden whitespace-nowrap rounded-full bg-slate-100 px-4 py-1 text-[10px] capitalize max-2xl:max-w-[120px] max-sm:text-sm min-[1440px]:text-[14px]`}
			style={{
				background: skill.color,
			}}
		>
			{skill.name}
		</div>
	);
};

interface OpenBountyCard4MobileProps {
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

export const OpenBountyCard4Mobile = ({
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
}: OpenBountyCard4MobileProps): JSX.Element | null => {
	const router = useRouter();
	// Remove ones with no creator
	if (!bounty?.creator) return null;

	const { creator, tags, name, _id, isBookmarked, bookmarkId, meta } = bounty;
	const paymentFee = bounty?.paymentFee ?? 0;

	const realTimeRate = rates ? (rates[meta?.coin?.reference] as number) : 0;

	const c = {
		_id: creator?._id,
		paktScore: creator?.score,
		avatar: creator?.profileImage?.url,
		name: creator?.firstName || "Deleted User",
	};
	const si = slotInfo(bounty);
	return (
		<div
			onClick={() =>
				router.push(
					`${creator === null || creator === undefined ? "/bounties" : `/bounties/${_id}`}`
				)
			}
			className={`primary_border-y flex w-full flex-col items-start gap-4 bg-primary p-4 ${className}`}
			style={style}
			onKeyDown={() => {}}
			role="button"
			tabIndex={0}
		>
			<div className="relative flex w-full items-center gap-2">
				<SnowProfile
					src={c.avatar}
					score={c.paktScore}
					size="sm"
					url={`/members/${c?._id}`}
					disabled={creator === null || creator === undefined}
					className="relative -left-2"
					isPartner
				/>
				<div className="flex w-full flex-col items-start justify-between gap-2">
					<Tooltip.Provider delayDuration={0}>
						<Tooltip.Root>
							<Tooltip.Trigger asChild>
								<span className="truncate text-base font-medium text-white min-[1440px]:w-[110px] 2xl:w-[150px] 2xl-5:w-auto">
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
				</div>
				{index && (
					<p className="absolute right-2 text-xs leading-[18px] tracking-wide text-body">
						{index}
					</p>
				)}
			</div>
			<BountyAmountAndSlot
				coin={meta?.coin}
				paymentFee={paymentFee}
				acceptedSlot={si.acceptedSlot}
				totalSlot={si.totalSlot}
				realTimeRate={realTimeRate}
				spotVariant="light"
				amountVariant="dark"
				isPartner={loggedInUser === Roles.PARTNER}
				spotType={spotType ?? "filled"}
			/>

			<p className="break-word flex grow items-center text-lg leading-normal tracking-wide text-white">
				{name}
			</p>
			<div className="mt-auto flex w-full items-center justify-between">
				<div className="flex w-[90%] flex-nowrap items-center gap-2">
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
