/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type TransactionStatus as TransactionStatusEnums,
	type TransactionType as TransactionTypeEnums,
} from "@/lib/enums";
import type { CoinProps } from "@/lib/types/collection";

export interface WalletTransactionsProps {
	date: string;
	amount: string;
	description: string;
	usdValue: string;
	type: {
		type: TransactionTypeEnums;
		coin: {
			_id: string;
			icon: string;
			reference: string;
		};
	};
	status: TransactionStatusEnums;
	transactionHash: string;
}

export interface MobileWalletTransactionsProps {
	date: string;
	amount: string;
	description: string;
	coin: CoinProps;
	usdValue: string;
	type: TransactionTypeEnums;
	status: TransactionStatusEnums;
	transactionHash: string;
	currency: string;
}
