import CardView from "@/components/common/card-view";
import React from "react";
import { GoogleAuth2FA } from "./google-auth";
import { EmailAuth2FA } from "./email-auth";
import { useUserState } from "@/lib/store/account";
import { TwoFactorAuthEnums } from "@/lib/enums";

export const TwoFactorAuthentication = () => {
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
		<CardView className=" flex h-fit w-[70%] flex-col gap-6 !p-6 2xl:w-3/4 ">
			{/* eslint-disable-next-line react/jsx-pascal-case */}
			<h3 className="w-full text-left text-lg font-bold !text-white">
				2FA
			</h3>

			<div className="flex w-full justify-between gap-4 2xl:gap-5">
				<GoogleAuth2FA
					isEnabled={is2FASetUp}
					disabled={isSecuritySetUp || isEmailSetUp}
				/>
				<EmailAuth2FA
					isEnabled={isEmailSetUp}
					disabled={is2FASetUp || isSecuritySetUp}
				/>
			</div>
		</CardView>
	);
};
