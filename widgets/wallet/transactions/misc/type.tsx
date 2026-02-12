"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ArrowDownLeft, ArrowUpRight, Circle } from "lucide-react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { TransactionType as TransactionTypeEnum } from "@/lib/enums";

export const TransactionType = ({
	type,
	coin,
}: {
	type: TransactionTypeEnum;
	coin: {
		_id: string;
		icon: string;
		reference: string;
	};
}): JSX.Element => {
	let color: string;
	let Icon: React.ElementType;

	switch (type) {
		case TransactionTypeEnum.DEPOSIT:
			color = "success";
			Icon = ArrowDownLeft;
			break;
		case TransactionTypeEnum.WITHDRAWAL:
			color = "danger";
			Icon = ArrowUpRight;
			break;
		default:
			color = "gray-300";
			Icon = Circle;
			break;
	}

	return (
		<div className="flex items-center">
			<div className="flex items-center">
				<div
					className={`flex rounded-full bg-opacity-20 p-0.5 bg-${color}`}
				>
					<Icon className={`text-${color}`} size={24} />
				</div>
				<Image
					src={coin?.icon}
					width={25}
					height={25}
					alt={coin?.reference}
					className="relative -left-2 rounded-full"
				/>
			</div>
			<span className="text-sm capitalize">{type}</span>
		</div>
	);
};

export const MobileTransactionType = ({
	type,
}: {
	type: TransactionTypeEnum;
}): JSX.Element => {
	let color: string;
	let Icon: React.ElementType;

	switch (type) {
		case TransactionTypeEnum.DEPOSIT:
			color = "success";
			Icon = ArrowDownLeft;
			break;
		case TransactionTypeEnum.WITHDRAWAL:
			color = "danger";
			Icon = ArrowUpRight;
			break;
		default:
			color = "gray-300";
			Icon = Circle;
			break;
	}

	return (
		<div className="flex items-center gap-2">
			<div
				className={`flex rounded-full bg-opacity-20 p-0.5 bg-${color}`}
			>
				<Icon className={`text-${color}`} size={12} />
			</div>
			<span className="text-sm capitalize">{type}</span>
		</div>
	);
};
