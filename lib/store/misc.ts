/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";
import type { ExchangeRateRecord } from "../api/wallet";

interface TabCountStateForApplicants {
	count: number;
	setCount: (count: number) => void;
	resetTabCountState: () => void;
}

const initialTabCountState: TabCountStateForApplicants = {
	count: 0,
	setCount: () => {},
	resetTabCountState: () => {},
};

export const useApplicantTabCount = create<TabCountStateForApplicants>(
	(set) => ({
		...initialTabCountState,
		setCount: (count: number) => {
			set({ count });
		},
		resetTabCountState: () => {
			set({ ...initialTabCountState });
		},
	})
);

interface HeaderScroll {
	scrollPosition: number;
	setScrollPosition: (scrollPosition: number) => void;
	resetHeaderScroll: () => void;
}

const initialHeaderScrollState: HeaderScroll = {
	scrollPosition: 1,
	setScrollPosition: () => {},
	resetHeaderScroll: () => {},
};

export const useHeaderScroll = create<HeaderScroll>((set) => ({
	...initialHeaderScrollState,
	setScrollPosition: (scrollPosition: number) => {
		set({ scrollPosition });
	},
	resetHeaderScroll: () => {
		set({ ...initialHeaderScrollState });
	},
}));

interface ExchangeRateStoreProps {
	data: ExchangeRateRecord | undefined;
	setData: (data: ExchangeRateRecord) => void;
	resetExchangeRateStore: () => void;
}

const initialExchangeRateStoreState: ExchangeRateStoreProps = {
	data: undefined,
	setData: () => {},
	resetExchangeRateStore: () => {},
};

export const useExchangeRateStore = create<ExchangeRateStoreProps>((set) => ({
	...initialExchangeRateStoreState,
	setData: (data: ExchangeRateRecord) => {
		set({ data });
	},
	resetExchangeRateStore: () => {
		set({ ...initialExchangeRateStoreState });
	},
}));

interface LogoutConfirmationStoreProps {
	showLogoutConfirmation: boolean;
	setShowLogoutConfirmation: (showLogoutConfirmation: boolean) => void;
	resetLogoutConfirmationStore: () => void;
}

const initialLogoutConfirmationState: LogoutConfirmationStoreProps = {
	showLogoutConfirmation: false,
	setShowLogoutConfirmation: () => {},
	resetLogoutConfirmationStore: () => {},
};

export const useLogoutConfirmationStore = create<LogoutConfirmationStoreProps>(
	(set) => ({
		...initialLogoutConfirmationState,
		setShowLogoutConfirmation: (showLogoutConfirmation: boolean) => {
			set({ showLogoutConfirmation });
		},
		resetLogoutConfirmationStore: () => {
			set({ ...initialLogoutConfirmationState });
		},
	})
);

export const resetAllMiscStates = () => {
	useApplicantTabCount.getState().resetTabCountState();
	useHeaderScroll.getState().resetHeaderScroll();
	useExchangeRateStore.getState().resetExchangeRateStore();
	useLogoutConfirmationStore.getState().resetLogoutConfirmationStore();
};
