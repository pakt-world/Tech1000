/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { EmailAuth2FA } from "@/widgets/settings/desktop/security-settings/two-factor-authentication/email-auth";
import { GoogleAuth2FA } from "@/widgets/settings/desktop/security-settings/two-factor-authentication/google-auth";

export const TwoFactorAuthentication4Mobile = (): JSX.Element => {
	const router = useRouter();
	const { twoFa } = useUserState();
	const is2FASetUp =
		(twoFa?.status && twoFa?.type === TwoFactorAuthEnums.AUTHENTICATOR) ??
		false;
	const isEmailSetUp =
		(twoFa?.status && twoFa?.type === TwoFactorAuthEnums.EMAIL) ?? false;
	const isSecuritySetUp =
		(twoFa?.status &&
			twoFa?.type === TwoFactorAuthEnums.SECURITY_QUESTION) ??
		false;

	return (
		<div className="relative size-full overflow-hidden bg-ink-darkest/40 from-white via-transparent to-white font-circular">
			<div className="fixed top-[70px] z-50 flex w-full items-center gap-2 bg-ink-darkest/40 from-white via-transparent to-white p-4 backdrop-blur-sm">
				<Button
					className="p-0"
					onClick={() => {
						router.back();
					}}
					variant="ghost"
				>
					<ChevronLeft className="text-white" />
				</Button>
				<h1 className="text-lg font-bold leading-[27px] tracking-wide text-white">
					2FA
				</h1>
			</div>
			<div className="flex w-full flex-col justify-between gap-5 p-5 py-20">
				<GoogleAuth2FA
					isEnabled={is2FASetUp}
					disabled={isSecuritySetUp || isEmailSetUp}
				/>
				<EmailAuth2FA
					isEnabled={isEmailSetUp}
					disabled={is2FASetUp || isSecuritySetUp}
				/>
			</div>
		</div>
	);
};
