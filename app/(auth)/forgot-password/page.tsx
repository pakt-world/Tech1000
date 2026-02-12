/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";
import ForgotPasswordForm from "@/widgets/authentication/login/web2-login/reset-password/forgot-password";

export default function ForgotPasswordPage(): React.JSX.Element {
	return (
		<Container className="z-[2] flex size-full max-w-2xl flex-col items-center justify-center gap-6">
			<div className=" flex flex-col items-center gap-2 text-center text-white">
				<h3 className=" text-2xl font-bold sm:text-3xl">
					Forgot Password
				</h3>
				<p className="max-w-[595px]  text-base">
					Enter the email you used to create your account so we can
					send you instructions on how to reset your password.
				</p>
			</div>
			<ForgotPasswordForm />
		</Container>
	);
}
