/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";

// KYC

interface KycState {
	openKycModal: boolean;
	setOpenKycModal: (openKycModal: boolean) => void;
	disableClickOutside: boolean;
	setDisableClickOutside: (disableClickOutside: boolean) => void;
	resetKyc: () => void;
}

const initialKycState = {
	openKycModal: false,
	disableClickOutside: false,
};

export const useKyc = create<KycState>((set) => ({
	...initialKycState,
	setOpenKycModal: (openKycModal: boolean) => set({ openKycModal }),
	setDisableClickOutside: (disableClickOutside: boolean) =>
		set({ disableClickOutside }),

	resetKyc: () => set({ ...initialKycState }),
}));

export const resetAllKYCStates = () => {
	useKyc.getState().resetKyc();
};
