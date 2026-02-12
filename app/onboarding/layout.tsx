"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { getCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { PageLoading } from "@/components/common/page-loading";
import { useSetToken } from "@/hooks/use-set-token";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { Container } from "@/components/common/container";
import { useProductVariables } from "@/hooks/use-product-variables";
import { Spinner } from "@/components/common/loader";

interface Props {
	children: React.ReactNode;
}

function Loader(): React.JSX.Element {
	return (
		<div
			aria-live="polite"
			aria-busy="true"
			className="flex h-screen w-screen items-center justify-center"
		>
			<PageLoading color="#FF99A2" />
		</div>
	);
}

export default function OnboardingLayout({ children }: Props): JSX.Element {
	const token = getCookie(AUTH_TOKEN_KEY);
	const [isTokenSet, setIsTokenSet] = useState(false);

	const { variables } = useProductVariables();

	useSetToken({ token, setIsTokenSet });

	if (!isTokenSet) {
		return <Loader />;
	}

	return (
		<Container className="relative flex w-full flex-col items-start gap-8 overflow-y-auto overflow-x-hidden max-sm:h-full max-sm:!pt-6 max-sm:pb-12 sm:items-center sm:justify-center md:h-screen md:py-12">
			<div className="fixed inset-0 z-[1] size-full bg-default bg-cover bg-center bg-no-repeat object-cover" />
			<Link
				href="/"
				className="relative z-[2] h-[38px] w-[165.06px] max-sm:max-w-[163.71px] sm:h-[78px] sm:w-[295px]"
			>
				{variables?.LOGO ? (
					<Image
						src={variables?.LOGO}
						alt="Logo"
						width={295}
						height={78}
						priority
					/>
				) : (
					<Spinner />
				)}
			</Link>

			{children}
		</Container>
	);
}
