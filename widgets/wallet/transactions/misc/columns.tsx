"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import {
	type TransactionStatus as TransactionStatusEnums,
	type TransactionType as TransactionTypeEnums,
} from "@/lib/enums";
import { formatNumber } from "@/lib/utils";

import { type WalletTransactionsProps } from "../types";
import { TransactionStatus } from "./status";
import { TransactionType } from "./type";
import { ENVS } from "@/config";

export const TABLE_COLUMNS: Array<ColumnDef<WalletTransactionsProps>> = [
	{
		header: "Date",
		accessorFn: (data) => data.date,
	},
	{
		header: "Type",
		accessorFn: (data) => data.type,
		cell: ({ getValue }) => {
			const { type, coin } = getValue() as {
				type: TransactionTypeEnums;
				coin: {
					_id: string;
					icon: string;
					reference: string;
				};
			};
			return <TransactionType type={type} coin={coin} />;
		},
	},
	{
		header: "Description",
		accessorFn: (data) => data.description,
	},
	{
		header: "Amount",
		accessorFn: (data) => formatNumber(Number(data.amount)),
	},
	{
		header: "USD Value",
		accessorFn: (data) => data.usdValue,
	},
	{
		header: "Status",
		accessorFn: (data) => data.status,
		cell: ({ getValue }) => (
			<TransactionStatus status={getValue<TransactionStatusEnums>()} />
		),
	},
	{
		header: " ",
		accessorFn: (data) => data.transactionHash,
		cell: ({ getValue }) => {
			const transactionHash = getValue();
			return transactionHash !== "" ? (
				<Link
					href={`${ENVS.NEXT_PUBLIC_SNOWTRACE_APP_URL}/tx/${transactionHash as string}`}
					target="_blank"
					className="inline-flex h-[22px] w-[124.35px] items-center justify-center gap-[6.45px] rounded-lg border bg-violet-100 px-2 py-0.5"
				>
					<span className="shrink grow basis-0 text-center text-xs font-medium leading-[18px] tracking-wide text-indigo-600">
						View On-chain
					</span>
					<ArrowUpRight className="relative h-[12.90px] w-[12.90px] text-indigo-600" />
				</Link>
			) : (
				<div />
			);
		},
	},
];
