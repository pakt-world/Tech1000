"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetAccount } from "@/lib/api/account";

import { PageLoading } from "./page-loading";

interface DashProps {
	children: ReactNode;
	tokenSet?: boolean;
}

export const AccountWrapper = ({
	children,
	tokenSet = false,
}: DashProps): JSX.Element => {
	const { isFetched, isFetching } = useGetAccount();

	if (!tokenSet || (!isFetched && isFetching)) {
		return (
			<div className="flex h-full w-full items-center justify-center bg-primary">
				<PageLoading color="#FF99A2" />
			</div>
		);
	}

	return children as JSX.Element;
};
