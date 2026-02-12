"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useEffect } from "react";

import { useGetWalletDetails } from "@/lib/api/wallet";
import { useWalletState } from "@/lib/store/wallet";
import { useMediaQuery } from "usehooks-ts";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn, formatNumber, formatUsd } from "@/lib/utils";

interface Props {
	className?: string;
}

export const UserBalance: FC<Props> = ({ className }) => {
	const isMobile = useMediaQuery("(max-width: 640px)");
	const { totalBalance } = useWalletState();
	const { refetch } = useGetWalletDetails();
	useEffect(() => {
		refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<span className={cn("text-2xl text-white sm:text-3xl", className)}>
			{isMobile
				? `$${formatNumber(parseFloat(totalBalance as string))}`
				: formatUsd(parseFloat(totalBalance as string))}
		</span>
	);
};
