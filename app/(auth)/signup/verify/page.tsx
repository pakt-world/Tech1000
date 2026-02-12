/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import SignupVerificationForm from "@/widgets/authentication/signup/web2-login/signup-verify";

export default function SignupVerificationPage(): React.JSX.Element {
	return (
		<div className="z-[2] mt-8 flex size-full flex-col items-center justify-start gap-6 sm:mx-auto md:justify-center">
			<div className="flex flex-col items-center gap-2 text-center text-white">
				<h3 className="font-sans text-2xl font-bold sm:text-3xl">
					Verify Email
				</h3>
				<p className="max-w-[600px] font-sans text-base">
					A code has been sent to your email address. <br /> Enter it
					to verify your email.
				</p>
			</div>
			<SignupVerificationForm />
		</div>
	);
}
