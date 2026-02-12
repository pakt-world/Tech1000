"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import type * as z from "zod";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { signupSchema4Web3 } from "@/lib/validations";
import { Button } from "../../../../components/common/button";
import { InputErrorMessage } from "../../../../components/common/InputErrorMessage";
import { Spinner } from "../../../../components/common/loader";
import CardView from "../../../../components/common/card-view";
import { CustomInput } from "../../../../components/common/custom-input";
import { useWeb3Onboard } from "@/lib/api/auth";
import { createQueryStrings } from "@/lib/utils";

export type FormValues = z.infer<typeof signupSchema4Web3>;

const SignupWeb3Form = (): React.JSX.Element => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const { mutate: web3OnboardMutation, isLoading } = useWeb3Onboard();

	const form = useForm<FormValues>({
		resolver: zodResolver(signupSchema4Web3),
		mode: "onChange",
	});

	const onSubmit: SubmitHandler<FormValues> = (values) => {
		web3OnboardMutation(
			{
				email: values?.email as string,
				firstName: values?.firstName as string,
				tempToken: token as string,
			},
			{
				onSuccess: (data) => {
					router.push(
						`/signup/verify?${createQueryStrings([
							{
								name: "email",
								value: values?.email as string,
							},
							{
								name: "token",
								value: (data?.tempToken?.token ||
									data?.token) as string,
							},
						])}`
					);
				},
			}
		);
	};

	return (
		<CardView className="!border-lemon-green sm:max-w-[600px]">
			<form
				method="post"
				onSubmit={form.handleSubmit(onSubmit)}
				className="relative z-[100] flex w-full flex-col items-center gap-6"
			>
				<div className="flex w-full flex-col gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="relative col-span-2 mb-2 flex w-full flex-col gap-2">
							<CustomInput
								htmlFor="firstName"
								label="Username"
								placeholder="Username"
								register={form.register("firstName")}
							/>
							<InputErrorMessage
								message={
									form.formState.errors.firstName?.message
								}
							/>
						</div>
					</div>

					<div className="relative mb-2 flex flex-col gap-2">
						<CustomInput
							htmlFor="email"
							label="Email Address"
							placeholder="Email Address"
							register={form.register("email")}
						/>
						<InputErrorMessage
							message={form.formState.errors.email?.message}
						/>
					</div>
				</div>

				<Button
					fullWidth
					type="submit"
					disabled={!form.formState.isValid || isLoading}
				>
					{isLoading ? <Spinner /> : "Register"}
				</Button>
			</form>
		</CardView>
	);
};

export default SignupWeb3Form;
