"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import LoginVerificationForm from "@/widgets/authentication/login/web2-login/login-verify";
import { TwoFactorAuthEnums } from "@/lib/enums";

export default function LoginVerificationPage(): React.JSX.Element {
	const searchParams = useSearchParams();
	const verifyType = searchParams.get("type");

	return (
		<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
			<div className="flex flex-col items-center gap-2 text-center text-white">
				<h3 className="font-sans text-3xl font-bold">2FA Security</h3>
				<p className="font-sans text-base">
					{verifyType === TwoFactorAuthEnums.AUTHENTICATOR
						? "Enter the OTP from your authenticator"
						: `Enter the code that was sent to email`}
				</p>
			</div>
			<LoginVerificationForm />
		</div>
	);
}
