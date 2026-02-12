/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";

// App2FA
interface OnboardingState {
	skill: string;
	image: string;
	tags: string[];
	setSkill: (skill: string) => void;
	setTags: (tags: string[]) => void;
	setProfileImage: (image: string) => void;
	resetOnboarding: () => void;
}

const initialOnboardingState = {
	skill: "",
	image: "",
	tags: [] as string[],
};

export const useOnboardingState = create<OnboardingState>((set) => ({
	...initialOnboardingState,
	setSkill: (skill: string) => set({ skill }),
	setProfileImage: (image: string) => set({ image }),
	setTags: (tags: string[]) => set({ tags }),

	resetOnboarding: () => set({ ...initialOnboardingState }),
}));

export const resetAllOnboardingStates = () => {
	useOnboardingState.getState().resetOnboarding();
};
