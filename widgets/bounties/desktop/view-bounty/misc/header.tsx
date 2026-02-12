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

	const spotText =
		acceptedSlot.acceptedSlot !== 0
			? "filled"
			: `spot${acceptedSlot.totalSlot > 1 ? "s" : ""}`;

	return (
		<div className="flex items-center justify-between gap-4 rounded-t-xl bg-hover-gradient p-4">
			<div className="flex h-full w-full max-w-2xl flex-col gap-6">
				<div className="grow pt-3">
					<h2 className="text-3xl font-medium text-white">{title}</h2>
				</div>
				<div className="mt-auto flex items-center gap-4">
					<div className="flex items-center gap-2 rounded-full bg-[#ECFCE5] px-3 py-1 text-[#198155]">
						<Tag size={20} />
						<span>
							{isPartner
								? formatNumber(price)
								: formatNumber(price / slotCount)}
						</span>
						<div className="flex items-center justify-center gap-1">
							<Image
								className="h-[18px] w-[17.94px] rounded-full"
								src={coin?.icon}
								alt={coin?.name}
								width={18}
								height={18}
							/>
							<div className="text-base leading-normal tracking-tight text-[#198155]">
								{coin?.symbol.toUpperCase()}
							</div>
						</div>
						<div className="text-lg font-bold leading-[27px] tracking-wide text-[#198155]">
							($
							{isPartner
								? formatNumberWithCommas(
										(realTimeRate * Number(price)).toFixed(
											2
										)
									)
								: formatNumberWithCommas(
										(
											(realTimeRate * price) /
											slotCount
										).toFixed(2)
									)}
							)
						</div>
					</div>
					<div className="inline-flex h-[37px] w-fit items-center justify-center gap-2 rounded-[18px] bg-rose-300 px-4 py-0.5">
						<div className="text-base leading-normal tracking-tight text-gray-800">
							{acceptedSlot.acceptedSlot !== 0 &&
								`${acceptedSlot.acceptedSlot}/`}
							{acceptedSlot?.totalSlot} {spotText}
						</div>
					</div>
					<span className="flex items-center gap-2 rounded-full bg-[#C9F0FF] px-3 py-1 text-[#0065D0]">
						<Calendar size={20} />
						<span>Due: {format(dueDateValue, "MMM dd, yyyy")}</span>
					</span>
				</div>
			</div>
			{creator?._id && (
				<div className="flex flex-col items-center gap-0 text-center">
					<SnowProfile
						src={creator.avatar}
						size="2md"
						score={100}
						url={`/members/${creator._id}`}
						isPartner
					/>
					<span className="whitespace-nowrap text-xl font-bold text-white">
						{creator.name}
					</span>
				</div>
			)}
		</div>
	);
};
