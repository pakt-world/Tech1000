"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type PaginationState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Table } from "@/components/common/table";
import { type TransactionProps, useGetWalletTxs } from "@/lib/api/wallet";
import { TransactionStatus } from "@/lib/enums";
import {
	formatDateHandler,
	formatUsd,
	parseTransactionHash,
} from "@/lib/utils";

import { TABLE_COLUMNS } from "./misc/columns";

const dateFormat = "MM/DD/YYYY";
const MAX = 20;

export const WalletTransactions = (): JSX.Element => {
	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: 1,
		pageSize: 6,
	});

	const {
		data: walletTx,
		refetch: fetchWalletTx,
		isLoading,
		isFetched: walletFetched,
		isFetching: walletIsFetching,
	} = useGetWalletTxs({
		limit: pageSize,
		page: pageIndex,
		filters: {
			status: [
				TransactionStatus.PROCESSING,
				TransactionStatus.COMPLETED,
				TransactionStatus.REPROCESSING,
			],
		},
	});
	const loading = !walletFetched && walletIsFetching && isLoading;
	const pagesize = parseInt(walletTx?.pages ?? "1", 10);
	const page = parseInt(walletTx?.page ?? "1", 10);

	const walletTransactions = useMemo(
		() =>
			(walletTx?.transactions ?? [])
				.map((tx: TransactionProps) => ({
					date: formatDateHandler(tx.createdAt, dateFormat),
					type: {
						type: tx.type,
						coin: tx.coin,
					},
					amount: String(tx.amount),
					description:
						tx.description && tx.description?.length > MAX
							? `${tx.description.slice(0, MAX)}...`
							: tx.description,
					usdValue: formatUsd(tx.usdValue),
					status: tx.status,
					transactionHash: parseTransactionHash(tx),
				}))
				.sort(
					(a, b) =>
						new Date(b?.date).getTime() -
						new Date(a?.date).getTime()
				),
		[walletTx]
	);
	const data = walletTransactions.map((transaction) => ({
		...transaction,
		transactionHash:
			typeof transaction.transactionHash === "string"
				? transaction.transactionHash
				: JSON.stringify(transaction.transactionHash), // Convert to string if it's an object
	}));

	const loadPage = async (): Promise<void> => {
		await Promise.all([fetchWalletTx()]);
	};

	useEffect(() => {
		loadPage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		fetchWalletTx();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageIndex, pageSize]);

	return (
		<div className="container_style flex h-[600px] w-full max-w-full flex-col gap-4 rounded-lg px-6 py-6">
			<h3 className="text-lg font-semibold text-white">
				Wallet Transactions
			</h3>
			<Table
				data={data}
				columns={TABLE_COLUMNS}
				pageCount={pagesize}
				setPagination={setPagination}
				pagination={{ pageIndex: page, pageSize }}
				loading={loading}
			/>
		</div>
	);
};
