"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import ResetPasswordForm from "@/widgets/authentication/login/web2-login/reset-password/reset-password";
import ResetPasswordVerificationForm from "@/widgets/authentication/login/web2-login/reset-password/reset-password-verify";

export default function ResetPasswordPage(): React.JSX.Element {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [showResetForm, setShowResetForm] = useState(false);
	const [otp, setOtp] = useState("");
	const email = searchParams.get("email") ?? "";
	const token = searchParams.get("token") ?? "";

	useEffect(() => {
		if (
			typeof email !== "string" ||
			typeof token !== "string" ||
			email === "" ||
			token === ""
		) {
			router.push("/forgot-password");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email, token]);

	return showResetForm ? (
		<ResetPasswordForm
			searchParams={searchParams}
			otp={otp}
			token={token}
		/>
	) : (
		<ResetPasswordVerificationForm
			searchParams={searchParams}
			email={email}
			token={token}
			setShowResetForm={() => {
				setShowResetForm(true);
			}}
			setOtp={setOtp}
		/>
	);
}
