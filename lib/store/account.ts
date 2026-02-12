import { create } from "zustand";

import { KycVerificationStatus, Roles } from "@/lib/enums";
import { type AccountProps } from "@/lib/types/account";

type UserState = AccountProps & {
	setUser: (user: AccountProps) => void;
	resetUser: () => void;
};

const initialUserState: AccountProps = {
	_id: "",
	type: Roles.EMPTY,
	email: "",
	lastName: "",
	firstName: "",
	score: 0,
	kyc: false,
	kycStatus: KycVerificationStatus.EMPTY,
	isVerified: false,
	profileImage: { url: "" },
	profileCompleteness: 0,
	profile: {
		talent: { tagsIds: [], availability: "", tags: [] },
	},
	twoFa: { status: false, type: "" },
	timeZone: "",
	role: Roles.EMPTY,
	meta: {
		profileLinks: {
			website: "",
			x: "",
			tiktok: "",
			instagram: "",
			github: "",
		},
		imageUrl: "",
		pointScore: 0,
		tokenId: "",
	},
};

export const useUserState = create<UserState>()((set) => ({
	...initialUserState,
	setUser: (user: AccountProps) => {
		set(user);
	},
	resetUser: () => set({ ...initialUserState }),
}));

export const resetAllAccountStates = () => {
	useUserState.getState().resetUser();
};
