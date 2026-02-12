"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import type { CoinProps } from "@/lib/types/collection";
import { formatNumber, formatNumberWithCommas } from "@/lib/utils";

interface Props {
	className?: string;
	isPartner?: boolean;
	spotVisible?: boolean;
	acceptedSlot?: number | undefined;
	totalSlot?: number | undefined;
	spotType?: "filled" | "empty";
	paymentFee: number | undefined;
	coin: CoinProps | undefined;
	realTimeRate: number;
	amountVariant?: "light" | "dark";
	spotVariant?: "light" | "dark";
}

export const BountyAmountAndSlot = ({
	className,
	isPartner,
	spotVisible = true,
	acceptedSlot, // If spotVisible is false, then acceptedSlot is undefined
	totalSlot = 1, // If spotVisible is false, then totalSlot is undefined
	spotType = "filled", // If spotVisible is false, then spotType is empty
	paymentFee, // If totalSlot is undefined, then the totalSlot is 1, that makes isPartner useless hence paymentFee remains the same
	coin,
	realTimeRate,
	amountVariant = "light",
	spotVariant = "light",
}: Props) => {
	const total = totalSlot ?? 1; // to avoid division by zero
	const slotInfo = acceptedSlot
		? `${acceptedSlot}/${totalSlot}`
		: `${totalSlot}`;
	const spotInfo =
		spotType === "filled" && acceptedSlot !== 0
			? "filled"
			: `spot${totalSlot > 1 ? "s" : ""}`;

	return (
		<div className="flex items-center gap-2">
			<div
				className={`flex h-7 w-max flex-wrap items-center gap-1 rounded-full px-3 2xl:h-9 2xl:px-4 ${amountVariant === "light" ? "!bg-lighter-badge !text-black" : "!bg-dark-badge !text-white"} ${className}`}
			>
				<p className="text-xs leading-normal tracking-tight 2xl:text-lg">
					{isPartner
						? formatNumber(paymentFee ?? 0)
						: formatNumber((paymentFee ?? 0) / total)}{" "}
				</p>
				<Image
					src={coin?.icon ?? ""}
					alt={coin?.name ?? ""}
					width={20}
					height={20}
					className="h-[20px] w-[20px] overflow-hidden rounded-full bg-cover"
				/>
				<p className="text-xs leading-normal tracking-tight 2xl:text-lg">
					{coin?.symbol.toUpperCase()}{" "}
					<span className="font-bold">
						($
						{isPartner
							? formatNumber(realTimeRate * Number(paymentFee))
							: formatNumberWithCommas(
									(
										(realTimeRate * Number(paymentFee)) /
										total
									).toFixed(2)
								)}
						)
					</span>
				</p>
			</div>
			{spotVisible && (
				<span
					className={`inline-flex h-7 w-max items-center rounded-full px-2 text-[11px] font-normal leading-[21px] tracking-wide 2xl:h-9 2xl:px-4 2xl:text-base ${spotVariant === "light" ? "!bg-light-badge !text-black" : "!bg-dark-badge !text-white"} ${className}`}
				>
					{slotInfo} {spotInfo}
				</span>
			)}
		</div>
	);
};
