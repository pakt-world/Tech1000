/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { SystemSettings } from "../api/setting";
import { SYSTEM_SETTINGS_KEY } from "../utils";

// App2FA
interface SettingState {
	settings: SystemSettings | null;
	setSettings: (settings: SystemSettings | null) => void;
}

export const useSettingState = create<SettingState>()(
	persist(
		(set) => ({
			settings: null,
			setSettings: (settings: SystemSettings | null) => set({ settings }),
		}),
		{
			name: SYSTEM_SETTINGS_KEY,
		}
	)
);
