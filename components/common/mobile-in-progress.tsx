"use client";

import { useProductVariables } from "@/hooks/use-product-variables";
import Image from "next/image";
import Link from "next/link";

export const MobileInProgress = (): JSX.Element => {
	const { variables } = useProductVariables();
	return (
		<div className="relative flex size-full">
			<div className="fixed inset-0 size-full bg-default bg-cover bg-center bg-no-repeat object-cover" />
			{/* <div className="fixed inset-0 bg-[url(/images/cardboard.webp)] bg-cover bg-center bg-no-repeat object-cover mix-blend-soft-light" /> */}
			<div className="relative flex h-screen w-full flex-col items-center justify-around px-8 py-12">
				<div className="relative flex w-full flex-col items-center justify-center gap-[30px]">
					<Image
						src="/images/tech1000-logo.svg"
						alt={`${variables?.NAME} Logo`}
						width={297}
						height={97}
					/>
					<p className="text-center font-[20px] leading-[30px] text-white">
						{variables?.NAME} is currently a desktop-based platform.
						Pakt is building the mobile version as we speak.
					</p>
				</div>
				<Link href="http://pakt.world" target="_blank">
					<Image
						src="/images/p.png"
						alt="Pakt"
						width={100}
						height={39.42}
					/>
				</Link>
			</div>
		</div>
	);
};
