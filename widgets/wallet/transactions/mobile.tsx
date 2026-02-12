"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import dayjs from "dayjs";
import { Loader } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import type { TransactionProps } from "@/lib/api/wallet";
import { useGetWalletTxsInfinitely } from "@/lib/api/wallet";
import { TransactionStatus } from "@/lib/enums";
import { formatUsd } from "@/lib/utils";

import { TransactionItem } from "./misc/mobile-transaction-item";
import { type MobileWalletTransactionsProps } from "./types";

const dateFormat = "MMMM DD, YYYY";

export const MobileWalletTransactions = (): JSX.Element => {
	const [currentData, setCurrentData] = useState<TransactionProps[]>([]);
	const [observe, setObserve] = useState(false);
	const prevPageRef = useRef(0);
	const currentPageRef = useRef(1);

	const {
		data: walletTx,
		refetch: fetchWalletTx,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetWalletTxsInfinitely({
		limit: 10,
		page: currentPageRef.current,
		filters: {
			status: [
				TransactionStatus.PROCESSING,
				TransactionStatus.COMPLETED,
				TransactionStatus.REPROCESSING,
			],
		},
	});
	const observerTarget = useRef<HTMLDivElement | null>(null);

	const fetchMore = (): void => {
		setObserve(false);
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	useEffect(() => {
		const currentTarget = observerTarget.current;
		if (!currentTarget) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) setObserve(true);
			},
			{ threshold: 0.5 }
		);

		observer.observe(currentTarget);

		return () => {
			observer.unobserve(currentTarget);
		};
	}, []);

	useEffect(() => {
		if (
			!isLoading &&
			!isFetchingNextPage &&
			prevPageRef.current !== currentPageRef.current
		) {
			fetchWalletTx();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPageRef.current]);

	useEffect(() => {
		if (observe) {
			fetchMore();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [observe]);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let totalData: any = [];
		// if (timelineData?.pages) {
		if (walletTx && Array.isArray(walletTx.pages)) {
			for (let i = 0; i < walletTx.pages.length; i++) {
				const walletTxData = walletTx.pages[i]?.transactions;
				if (Array.isArray(walletTxData)) {
					totalData = [...totalData, ...walletTxData];
				}
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const newData = totalData.sort((a: any, b: any) => {
			if (a && b) {
				return (
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
				);
			}
			return 0;
		});
		setCurrentData(newData);
		// }
	}, [walletTx, walletTx?.pages]);

	const data: MobileWalletTransactionsProps[] = useMemo(
		() =>
			(currentData ?? [])
				.map((tx: TransactionProps) => ({
					date: dayjs(tx.createdAt).format(dateFormat),
					type: tx.type,
					amount: String(tx.amount),
					description: tx.description && tx.description,
					currency: tx.currency.toUpperCase(),
					usdValue: formatUsd(tx.usdValue),
					status: tx.status,
					transactionHash:
						tx.responseData !== null &&
						tx.responseData !== undefined
							? JSON.parse(tx.responseData).data.tx
									.transactionHash
							: "",
					coin: tx.coin,
				}))
				.sort(
					(a, b) =>
						new Date(b?.date).getTime() -
						new Date(a?.date).getTime()
				),
		[currentData]
	);

	return (
		<div className="flex h-[550px] w-full max-w-full flex-col gap-4 rounded-lg bg-primary px-6 py-6">
			<h3 className="text-base font-semibold text-white">
				Wallet Transactions
			</h3>
			<div className="flex h-[550px] w-full flex-col gap-4 overflow-y-scroll pb-4">
				{data.map((transaction) => (
					<TransactionItem
						transaction={transaction}
						key={transaction.transactionHash}
					/>
				))}
				{isFetchingNextPage && (
					<div className="mx-auto flex w-full flex-row items-center justify-center text-center max-sm:my-4">
						<Loader
							size={25}
							className="animate-spin text-center text-white"
						/>
					</div>
				)}
				<span ref={observerTarget} />
			</div>
		</div>
	);
};
