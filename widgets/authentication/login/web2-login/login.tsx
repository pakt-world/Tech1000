"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { useLogin } from "@/lib/api/auth";
import { AUTH_TOKEN_KEY, createQueryStrings } from "@/lib/utils";
// import { useUserState } from "@/lib/store/account";
import { loginSchema } from "@/lib/validations";
import CardView from "../../../../components/common/card-view";
import {
	CustomInput,
	CustomPasswordInput,
} from "../../../../components/common/custom-input";

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = (): React.JSX.Element => {
	const login = useLogin();
	const router = useRouter();
	// const { setUser } = useUserState();
	const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
		login.mutate(values, {
			onSuccess: (data) => {
				if (!data.isVerified) {
					router.push(
						`/signup/verify?${createQueryStrings([
							{ name: "email", value: data.email },
							{
								name: "token",
								value: data.tempToken?.token ?? "",
							},
							{ name: "verifyType", value: "email" },
						])}`
					);
					return;
				}
				if (data.twoFa?.status) {
					router.push(
						`/login/verify?${createQueryStrings([
							{
								name: "token",
								value: data?.tempToken?.token ?? "",
							},
							{ name: "verifyType", value: "2fa" },
							{ name: "type", value: data.twoFa.type },
							{ name: "email", value: values.email },
						])}`
					);
					return;
				}
				// setUser(data);
				// Set Timezone to localStorage
				localStorage.setItem(
					"5n0wf0rt_u53r_71m3z0n3",
					data.timeZone || browserTimeZone
				);
				setCookie(AUTH_TOKEN_KEY, data.token);
				const params = new URLSearchParams(window.location.search);
				const redirect = params.get("redirect") ?? "/overview";
				router.push(redirect);
				// router.push("/overview");
			},
		});
	};

	return (
		<CardView className="!border-1 !border-lemon-green sm:max-w-[600px]">
			<form
				method="post"
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-6"
			>
				<div className="flex w-full flex-col gap-5 text-white">
					<CustomInput
						register={form.register("email")}
						label={"Email Address"}
						htmlFor="email"
						placeholder="enter your email"
					/>

					<CustomPasswordInput
						register={form.register("password")}
						label={"Password"}
						htmlFor="password"
						placeholder="enter your password"
					/>

					<div className="flex items-center justify-end">
						<Link
							href="/forgot-password"
							className="text-sm text-white"
						>
							Forgot Password?
						</Link>
					</div>
				</div>

				<Button
					fullWidth
					disabled={!form.formState.isValid || login.isLoading}
					className="touch-manipulation"
				>
					{login.isLoading ? <Spinner /> : "Log in"}
				</Button>
			</form>
		</CardView>
	);
};

export default LoginForm;
