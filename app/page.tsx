"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageLoading } from "@/components/common/page-loading";

export default function Home(): JSX.Element {
	const router = useRouter();
	useEffect(() => {
		router.replace("/overview");
	}, [router]);

	return (
		<div className="flex h-full w-full items-center justify-center bg-primary">
			<PageLoading color="#FF99A2" />
		</div>
	);
}
