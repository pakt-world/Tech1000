/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { resetAllAccountStates } from "./account";
import { resetAllKYCStates } from "./kyc";
import { resetAllMiscStates } from "./misc";
import { resetAllOnboardingStates } from "./onboarding";
import { resetAllSecurityStates } from "./security";
import { resetAllWalletStates } from "./wallet";

export const resetAllStates = () => {
	resetAllKYCStates();
	resetAllAccountStates();
	resetAllMiscStates();
	resetAllOnboardingStates();
	resetAllSecurityStates();
	resetAllWalletStates();
};
