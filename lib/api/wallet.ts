/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import {
	type QueryKey,
	useInfiniteQuery,
	type UseInfiniteQueryResult,
	useQuery,
	type UseQueryOptions,
	type UseQueryResult,
} from "@tanstack/react-query";
import { type AxiosResponse } from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import { type ApiError, type ApiResponse, axios } from "@/lib/axios";
import { useWalletState } from "@/lib/store/wallet";

import type { TransactionStatus, TransactionType } from "../enums";
import type { CoinProps } from "../types/collection";

export interface WalletProps {
	id?: string;
	_id?: string;
	amount: number;
	usdValue: number;
	coin: string;
	icon: string;
}

export interface IWallet {
	totalBalance: number | string;
	value: string;
	wallets: WalletProps[];
}

const getWalletQueryKey: QueryKey = ["wallet-details"];
const getWalletTxQueryKey: QueryKey = ["wallet-txs"];

// fetch wallets
const fetchWallet = async (): Promise<ApiResponse<IWallet>> =>
	axios.get(`/wallet`);

// transactions

// single transactions
// const fetchSingleTransactions = async (id: string): Promise<void> => {
//     try {
//         const { data } = await axios.get(`/transaction/${id}`);
//         if (data?.status === "success") {
//             return data?.data;
//         }
//     } catch (error) {
//         return error?.response?.data;
//     }
// };

// single transactions

interface fetchWalletStatsParams {
	format: string;
}

export interface ChartData {
	date: string;
	value: number;
}

// interface FetchWalletStatsResponse {
//     data: ChartData[];
//     message: string;
//     status: string;
// }

export const fetchWalletStats = async ({
	format,
}: fetchWalletStatsParams): Promise<ChartData[]> => {
	const res = await axios.get(`/transaction/stats?format=${format}`);
	return res.data.data;
};

export const useFetchWalletStats = (
	format: fetchWalletStatsParams
): UseQueryResult<ChartData[], ApiError> => {
	return useQuery({
		queryFn: async () => {
			if (format) {
				return fetchWalletStats(format);
			}
			throw new Error("No format parameter provided");
		},
		queryKey: [`wallet_starts_${JSON.stringify(format)}`],
		onError: (error: ApiError) => {
			toast.error(error.response?.data.message ?? "An error occurred");
		},
		enabled: Boolean(format), // Conditionally enable the query
	});
};

// wallet withdrawal
// const fetchWithdrawalStats = async (payload: any) => {
//     try {
//         const { data } = await axios.post(`/withdrawals`, payload);
//         if (data?.status === "success") {
//             return data;
//         }
//     } catch (error: any) {
//         return error?.response?.data;
//     }
// };

export type ExchangeRateRecord = Record<string, number>;

export const fetchExchangeRate = async (): Promise<ExchangeRateRecord> => {
	const res = await axios.get(`/transaction/exchange`);
	return res.data.data;
};

export const useExchangeRate = (): UseQueryResult<
	ExchangeRateRecord,
	ApiError
> => {
	const getQueryExchangeKey = ["exchange-rate"];
	return useQuery({
		queryFn: fetchExchangeRate,
		queryKey: getQueryExchangeKey,
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data.message ??
					"An error fetching exchange rate"
			);
		},
		// refetchInterval: 10000,
		// refetchOnWindowFocus: false,
	});
};

export const useGetWalletDetails = (): UseQueryResult<
	ApiResponse<IWallet>,
	ApiError<null>
> => {
	const { setWallet } = useWalletState();
	const options: UseQueryOptions<ApiResponse<IWallet>, ApiError<null>> = {
		queryFn: async () => {
			return fetchWallet();
		},
		queryKey: ["wallet-data-fetch"],
		onError: (error) => {
			toast.error(error.response?.data.message ?? "An error occurred");
		},
		onSuccess: ({ data }) => {
			setWallet(data.data);
		},
	};

	return useQuery(getWalletQueryKey, options);
};

// ===

export interface TransactionProps {
	amount: number;
	chain: string;
	coin: CoinProps;
	createdAt: string;
	currency: string;
	description: string;
	method: string;
	owner: string;
	rate: string;

	responseData: string;

	status: TransactionStatus;
	type: TransactionType;
	updatedAt: string;
	usdValue: number;
	_id: string;
	// wallets: WalletProps[];
}
export interface IWalletTx {
	page: string;
	pages: string;
	limit: string;
	transactions: TransactionProps[];
}

interface ITransaction {
	limit: number;
	page: number;
	filters: Record<string, unknown>;
}

const fetchWalletTransactions = async ({
	limit,
	page,
	filters,
}: ITransaction): Promise<AxiosResponse<IWalletTx>> => {
	const res = await axios.get(`/transaction`, {
		params: {
			page,
			limit,
			...filters,
		},
	});
	return res.data.data;
};

export const useGetWalletTxs = ({
	limit,
	page,
	filters,
}: ITransaction): UseQueryResult<IWalletTx, ApiError<null>> => {
	const options: UseQueryOptions<IWalletTx, ApiError<null>> = {
		// @ts-expect-error ---
		queryFn: async () => {
			return fetchWalletTransactions({ limit, page, filters });
		},
		queryKey: ["wallet-tx-q", limit, page],
		onError: (error) => {
			toast.error(error.response?.data.message ?? "An error occurred");
		},
		enabled: true,
	};

	return useQuery(getWalletTxQueryKey, options);
};

export const useGetWalletTxsInfinitely = ({
	limit,
	page,
	filters,
}: ITransaction): UseInfiniteQueryResult<IWalletTx, ApiError<null>> => {
	return useInfiniteQuery(
		[`wallet-txs_${page}_${limit}`],
		async ({ pageParam = 1 }) =>
			fetchWalletTransactions({ limit, page: pageParam, filters }),
		{
			getNextPageParam: (_, pages) => {
				return pages.length + 1;
			},
			enabled: true,
		}
	);
};
// ===

export interface PaymentCoinsProps {
	_id: string;
	name: string;
	symbol: string;
	icon: string;
	reference: string;
	decimal: string;
	isToken: boolean;
	rpcChainId: string;
	active: boolean;
	priceTag?: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	contractAddress?: string;
}

const fetchPaymentCoins = async (): Promise<PaymentCoinsProps[]> => {
	const res = await axios.get(`/payment/coins`);
	return res.data.data.reverse();
};

export const useGetPaymentCoins = (): UseQueryResult<
	PaymentCoinsProps[],
	ApiError
> => {
	const getQueryIdKey = ["payment-coin"];
	return useQuery({
		queryFn: fetchPaymentCoins,
		queryKey: getQueryIdKey,
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data.message ??
					"An error fetching payment coins"
			);
		},
	});
};

// ===

export interface ActiveRPCProps {
	rpcName: string;
	rpcChainId: string;
	rpcUrls: string[];
	blockExplorerUrls: string[];
}

const fetchRPCServer = async (): Promise<ActiveRPCProps> => {
	const res = await axios.get(`/payment/rpc`);
	return res.data.data;
};

export const useGetActiveRPC = (): UseQueryResult<ActiveRPCProps, unknown> => {
	const getQueryIdKey = ["active-rpc"];
	return useQuery({
		queryFn: fetchRPCServer,
		queryKey: getQueryIdKey,
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data.message ?? "An error fetching rpc"
			);
		},
	});
};
