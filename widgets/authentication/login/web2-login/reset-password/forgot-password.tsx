"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { useRequestPasswordReset } from "@/lib/api/auth";
import { createQueryStrings } from "@/lib/utils";
import { forgotPasswordSchema } from "@/lib/validations";
import CardView from "../../../../../components/common/card-view";
import { CustomInput } from "../../../../../components/common/custom-input";

type FormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = (): JSX.Element => {
	const router = useRouter();
	const requestPasswordReset = useRequestPasswordReset();

	const form = useForm<FormValues>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit: SubmitHandler<FormValues> = (values) => {
		requestPasswordReset.mutate(values, {
			onSuccess: (data) => {
				router.push(
					`/forgot-password/reset?${createQueryStrings([
						{
							name: "email",
							value: values.email,
						},
						{
							name: "token",
							value: data.tempToken.token,
						},
					])}`
				);
			},
		});
	};

	return (
		<CardView className="max-w-[600px]">
			<form
				className="relative z-[100] mx-auto flex w-full  flex-col items-center gap-6"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="relative flex w-full flex-col gap-2">
					<CustomInput
						id="email"
						htmlFor="email"
						label="Email"
						placeholder="Email"
						type="email"
						register={form.register("email")}
					/>
				</div>

				<Button
					fullWidth
					disabled={
						!form.formState.isValid ||
						requestPasswordReset.isLoading
					}
				>
					{requestPasswordReset.isLoading ? (
						<Spinner />
					) : (
						"Send Reset Link"
					)}
				</Button>

				<Link
					href="/login"
					className="mt-4 font-sans text-sm text-white"
				>
					Back to login
				</Link>
			</form>
		</CardView>
	);
};

export default ForgotPasswordForm;
