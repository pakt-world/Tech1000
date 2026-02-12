"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import Image from "next/image";

import { useProductVariables } from "@/hooks/use-product-variables";
import { Spinner } from "@/components/common/loader";

export const Brand = (): JSX.Element => {
	const { variables } = useProductVariables();
	return (
		<div className="relative z-[2] mx-auto flex w-max items-center gap-2 pb-2 sm:gap-[15px]">
			{variables?.LOGO ? (
				<Image
					src={variables?.LOGO}
					alt="Logo"
					width={200}
					height={48}
					className=""
					priority
				/>
			) : (
				<Spinner />
			)}
		</div>
	);
};
