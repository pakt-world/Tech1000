"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { Calendar, Tag } from "lucide-react";
import Image from "next/image";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { SnowProfile } from "@/components/common/snow-profile";
import { Roles } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import {
	determineRole,
	formatNumber,
	formatNumberWithCommas,
} from "@/lib/utils";

interface BountyAmountProps {
	isPartner: boolean;
	price: number;
	slotCount: number;
	coin: {
		icon: string;
		name: string;
		symbol: string;
	};
	realTimeRate: number;
}

const BountyAmount = ({
	isPartner,
	price,
	slotCount,
	coin,
	realTimeRate,
}: BountyAmountProps): JSX.Element => (
	<div className="flex items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
		<Tag size={20} className="text-[#0065D0]" />
		<span>
			{isPartner ? formatNumber(price) : formatNumber(price / slotCount)}
		</span>
		<div className="flex items-center justify-center gap-1">
			<Image
				className="h-[18px] w-[17.94px] rounded-full"
				src={coin?.icon}
				alt={coin?.name}
				width={18}
				height={18}
			/>
			<div className="text-sm leading-normal tracking-tight text-[#198155]">
				{coin?.symbol.toUpperCase()}
			</div>
		</div>
		<div className="text-sm font-bold leading-[27px] tracking-wide text-[#198155]">
			($
			{isPartner
				? formatNumberWithCommas(
						(realTimeRate * Number(price)).toFixed(2)
					)
				: formatNumberWithCommas(
						((realTimeRate * price) / slotCount).toFixed(2)
					)}
			)
		</div>
	</div>
);

const BountySpots = ({
	acceptedSlot,
	totalSlot,
}: {
	acceptedSlot: number;
	totalSlot: number;
}): JSX.Element => (
	<div className="inline-flex h-[37px] w-fit items-center justify-center gap-2 rounded-[18px] bg-rose-300 px-4 py-0.5">
		<div className="text-sm leading-normal tracking-tight text-gray-800">
			{acceptedSlot}/{totalSlot}{" "}
			{`spot${acceptedSlot > 1 ? "s" : ""} filled`}
		</div>
	</div>
);

const BountyDueDate = ({ dueDate }: { dueDate: string }): JSX.Element => {
	const dueDateError = new Date(dueDate).toString() === "Invalid Date";
	const dueDateValue = dueDateError ? new Date() : new Date(dueDate);

	return (
		<span className="flex items-center gap-2 rounded-full bg-[#C9F0FF] px-3 py-1 text-sm text-[#0065D0]">
			<Calendar size={20} />
			<span>Due: {format(dueDateValue, "MMM dd, yyyy")}</span>
		</span>
	);
};

interface BountyHeaderProps {
	title: string;
	price: number;
	dueDate: string;
	creator?: {
		_id: string;
		name: string;
		score: number;
		avatar?: string;
		// type?: string;
	};
	slotCount: number;
	coin: {
		icon: string;
		name: string;
		symbol: string;
	};
	realTimeRate: number;
	acceptedSlot: {
		acceptedSlot: number;
		totalSlot: number;
	};
}

export const BountyHeader = ({
	title,
	price,
	dueDate,
	creator,
	slotCount,
	coin,
	realTimeRate,
	acceptedSlot,
}: BountyHeaderProps): ReactElement => {
	// Handle due date error
	const dueDateError = new Date(dueDate).toString() === "Invalid Date";
	const dueDateValue = dueDateError ? new Date() : new Date(dueDate);
	const user = useUserState();
	const isPartner = determineRole(user) === Roles.PARTNER;

	return (
		<div className="flex flex-col items-start justify-between gap-4 bg-hover-gradient px-4 py-5">
			<div className="flex h-full w-full flex-col gap-2">
				<h2 className="text-lg font-bold leading-[27px] tracking-wide text-white">
					{title}
				</h2>
				<div className="mt-auto flex flex-wrap items-center gap-2.5">
					<BountyAmount
						isPartner={isPartner}
						price={price}
						slotCount={slotCount}
						coin={coin}
						realTimeRate={realTimeRate}
					/>
					<BountySpots
						acceptedSlot={acceptedSlot.acceptedSlot}
						totalSlot={acceptedSlot.totalSlot}
					/>
					<BountyDueDate dueDate={dueDateValue.toString()} />
				</div>

				{creator?._id && (
					<div className="flex items-center gap-2 text-center">
						<SnowProfile
							src={creator.avatar}
							size="sm"
							score={100}
							url={`/members/${creator._id}`}
							isPartner
						/>
						<span className="whitespace-nowrap text-sm font-bold text-white">
							{creator.name}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};
