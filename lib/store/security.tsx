/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";

// App2FA
interface AuthApp2FA {
	isModalOpen: boolean;
	closeModal: () => void;
	openModal: () => void;
	secret: string;
	setSecret: (secret: string) => void;
	qrCode: string;
	setQrCode: (qrCode: string) => void;
	resetAuthApp2FA: () => void;
}

const initialAuthApp2FAState = {
	isModalOpen: false,
	secret: "",
	qrCode: "",
};

export const useAuthApp2FAState = create<AuthApp2FA>((set) => ({
	...initialAuthApp2FAState,
	openModal: () => set({ isModalOpen: true }),
	closeModal: () => set({ isModalOpen: false }),
	setSecret: (secret: string) => set({ secret }),
	setQrCode: (qrCode: string) => set({ qrCode }),
	resetAuthApp2FA: () => set({ ...initialAuthApp2FAState }),
}));

// Email 2FA state
interface Email2FAState {
	isModalOpen: boolean;
	closeModal: () => void;
	openModal: () => void;
	resetEmail2FA: () => void;
}

const initialEmail2FAState = {
	isModalOpen: false,
};

export const useEmail2FAState = create<Email2FAState>((set) => ({
	...initialEmail2FAState,
	openModal: () => set({ isModalOpen: true }),
	closeModal: () => set({ isModalOpen: false }),
	resetEmail2FA: () => set({ ...initialEmail2FAState }),
}));

// Security Question State
interface SecurityQuestion2FAState {
	isModalOpen: boolean;
	securityQuestions: string[];
	setSecurityQuestions: (securityQuestions: string[]) => void;
	closeModal: () => void;
	openModal: () => void;
	resetSecurityQuestion2FA: () => void;
}
const initialSecurityQuestion2FAState = {
	isModalOpen: false,
	securityQuestions: [] as string[],
};

export const useSecurityQuestion2FAState = create<SecurityQuestion2FAState>(
	(set) => ({
		...initialSecurityQuestion2FAState,
		setSecurityQuestions: (securityQuestions: string[]) =>
			set({ securityQuestions }),
		openModal: () => set({ isModalOpen: true }),
		closeModal: () => set({ isModalOpen: false }),
		resetSecurityQuestion2FA: () =>
			set({ ...initialSecurityQuestion2FAState }),
	})
);

interface MscState {
	isInput6DigitCode?: boolean;
	setIsInput6DigitCode?: (value: boolean) => void;
	resetMscState: () => void;
}

const initialMscState = {
	isInput6DigitCode: false,
};

export const useMscState = create<MscState>((set) => ({
	...initialMscState,
	setIsInput6DigitCode: (value: boolean) => set({ isInput6DigitCode: value }),
	resetMscState: () => set({ ...initialMscState }),
}));

export const resetAllSecurityStates = () => {
	useAuthApp2FAState.getState().resetAuthApp2FA();
	useEmail2FAState.getState().resetEmail2FA();
	useSecurityQuestion2FAState.getState().resetSecurityQuestion2FA();
	useMscState.getState().resetMscState();
};
