"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { useIsClient, useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { DeleteAccountMobile } from "@/widgets/settings/mobile/delete-account";

export default function DeleteAccountPage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const isClient = useIsClient();

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			window.location.href = `/settings`;
		}
	}, [tab]);

	return isClient && !tab && <DeleteAccountMobile />;
}
