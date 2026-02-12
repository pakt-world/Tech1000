/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IWallet {
	totalBalance: string | number;
	value: string;
	wallets:
		| Array<{
				id?: string;
				_id?: string;
				amount: number;
				usdValue: number;
				coin: string;
				icon: string;
		  }>
		| [];
}

type WalletState = IWallet & {
	setWallet: (wallet: IWallet) => void;
	resetWalletState: () => void;
};

const initialWalletState: IWallet = {
	totalBalance: "0.00",
	value: "0.00",
	wallets: [],
};

export const useWalletState = create<WalletState>()(
	persist(
		(set) => ({
			...initialWalletState,
			setWallet: (wallet) => {
				set(wallet);
			},
			resetWalletState: () => {
				set({ ...initialWalletState });
			},
		}),
		{
			name: "wallet",
		}
	)
);

export const resetAllWalletStates = () => {
	useWalletState.getState().resetWalletState();
};
