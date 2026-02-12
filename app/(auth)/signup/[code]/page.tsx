"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Spinner } from "@/components/common/loader";
import SignupReferralForm from "@/widgets/authentication/signup/web2-login/signup-referral";
import { useValidateReferral } from "@/lib/api/referral";
import { Roles } from "@/lib/enums";
import warning from "@/lottiefiles/warning-2.json";
import { useProductVariables } from "@/hooks/use-product-variables";
import Lottie from "@/components/common/lottie";

export default function SignupReferralPage(): React.JSX.Element {
	const validateRef = useValidateReferral();
	const params = useParams();
	const [isLoading, _setIsLoading] = useState(true);
	const [errorMsg, _setErrorMsg] = useState(false);
	const [isPartner, setIsPartner] = useState<boolean>(false);
	const referralCode = String(params.code);

	const { variables } = useProductVariables();

	const validateReferral = (): void => {
		if (referralCode === "") {
			// throw error
			_setErrorMsg(true);
			_setIsLoading(false);
		}
		// validate code here
		validateRef.mutate(
			{ token: referralCode },
			{
				onSuccess: (data) => {
					setIsPartner(data.role === Roles.PARTNER);
					_setIsLoading(false);
				},
				onError: () => {
					_setErrorMsg(true);
					_setIsLoading(false);
				},
			}
		);
	};

	useEffect(() => {
		validateReferral();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="z-[2] flex w-full items-center sm:mx-auto sm:size-full">
			{!isLoading && !errorMsg && (
				<div className="flex size-full flex-col items-center justify-center gap-6 max-sm:pb-8">
					<div className="flex w-full flex-col items-center gap-2 text-center text-white">
						<h3 className="font-sans text-2xl font-bold text-white sm:text-3xl">
							Create Your Account
						</h3>
						<p className="w-[392px] text-center text-base leading-normal tracking-tight text-white">
							{variables?.LOGIN_SUBTEXT}
						</p>
					</div>

					<SignupReferralForm
						referralCode={referralCode}
						isPartner={isPartner}
					/>
				</div>
			)}
			{isLoading && <Spinner className="text-white" />}
			{!isLoading && errorMsg && (
				<div className="bg-[rgba(255, 255, 0.20)] flex w-full max-w-xl flex-col items-center justify-center gap-2 rounded-2xl border  border-white border-opacity-30 p-8 px-[40px] py-10 text-center text-white backdrop-blur-md sm:mx-auto sm:mt-28">
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
				</div>
			)}
		</div>
	);
}
