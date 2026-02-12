"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Container } from "@/components/common/container";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { useProductVariables } from "@/hooks/use-product-variables";
import { Spinner } from "@/components/common/loader";

interface Props {
	children: ReactNode;
}

export default function AuthLayout({ children }: Props): JSX.Element {
	const token = getCookie(AUTH_TOKEN_KEY);
	const router = useRouter();

	const { variables } = useProductVariables();

	useEffect(() => {
		if (token) {
			router.push("/overview");
		}
	}, [router, token]);

	return (
		<Container className="relative flex w-full flex-col gap-8 overflow-y-auto overflow-x-hidden max-sm:h-full max-sm:pb-12 max-sm:pt-6 sm:py-12 md:h-screen">
			<div className="fixed inset-0 z-[1] size-full bg-default bg-cover bg-center bg-no-repeat object-cover" />
			<div className="z-[2] flex w-full items-center  justify-center sm:justify-between">
				<Link
					className="relative max-w-[163.71px] sm:max-w-[200px]"
					href="/"
				>
					{variables?.LOGO ? (
						<Image
							src={variables?.LOGO}
							alt="Logo"
							width={250}
							height={60}
							priority
						/>
					) : (
						<Spinner />
					)}
				</Link>
				{/* {pathname.includes("signup") && (
					<Button
						asChild
						variant="outline"
						className={`relative block rounded-3xl px-6 py-2 font-bold max-sm:border-none max-sm:p-0`}
					>
						<Link href="/login">Sign in</Link>
					</Button>
				)} */}
				{/* {pathname.includes("login") && (
					<Button
						asChild
						variant="outline"
						className={`relative block rounded-3xl px-6 py-2 font-bold max-sm:border-none max-sm:p-0`}
					>
						<Link href="/signup">Sign up</Link>
					</Button>
				)} */}
			</div>
			{children}
		</Container>
	);
}
