"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Container } from "@/components/common/container";
// import SignupForm from "@/components/forms/signup";
import { SystemSettings, useGetSetting } from "@/lib/api/setting";
import { SETTING_CONSTANTS } from "@/lib/enums";
import warning from "@/lottiefiles/warning-2.json";
import { Spinner } from "@/components/common/loader";
import { useProductVariables } from "@/hooks/use-product-variables";
import SignupWeb3Form from "@/widgets/authentication/signup/web3-login/signup-web3";
import Lottie from "@/components/common/lottie";

export default function SignupPage(): React.JSX.Element {
	// const validateRef = useValidateReferral();
	const { variables } = useProductVariables();

	const [errorMsg, _setErrorMsg] = useState(true);
	const { data: systemSetting, isLoading: settingsLoading } = useGetSetting({
		enable: true,
	});
	// const isTab = useMediaQuery("(min-width: 620px)");
	const loading = settingsLoading;

	useMemo(() => {
		if (systemSetting != null) {
			const signupByInviteOnly = Boolean(
				systemSetting[
					SETTING_CONSTANTS.ALLOW_SIGN_ON_INVITE_ONLY as keyof SystemSettings
				] === "true"
			);
			_setErrorMsg(signupByInviteOnly);
		}
	}, [systemSetting]);

	return (
		<div className="z-[2] flex w-full items-center sm:mx-auto sm:size-full">
			{!loading && !errorMsg && (
				<div className="flex size-full flex-col items-center justify-center gap-6 max-sm:pb-8">
					<div className="flex flex-col items-center gap-2 text-center text-white">
						<h3 className="font-sans text-2xl font-bold sm:text-3xl">
							Create Your Account
						</h3>
						<p className="w-[392px] text-center text-base leading-normal tracking-tight text-white">
							{variables?.LOGIN_SUBTEXT}
						</p>
					</div>
					<SignupWeb3Form />
				</div>
			)}
			{loading && <Spinner className="h-full text-white" />}
			{!loading && errorMsg && (
				<Container className="bg-[rgba(255, 255, 0.20)] mt-28 flex w-full max-w-xl flex-col items-center justify-center gap-2 rounded-2xl  border border-white border-opacity-30 p-8 px-[40px] py-10 text-center text-white backdrop-blur-md sm:mx-auto sm:mt-28">
					<div className="flex w-full max-w-[150px] items-center justify-center">
						<Lottie animationData={warning} />
					</div>
					<h3 className="text-2xl font-bold sm:text-3xl">
						Invalid Referral Code
					</h3>
					<h6 className="flex-wrap text-base font-thin opacity-80 sm:text-lg">
						You need a valid referral code to be able to sign up to
						{variables?.NAME}.{" "}
					</h6>
				</Container>
			)}
		</div>
	);
}
