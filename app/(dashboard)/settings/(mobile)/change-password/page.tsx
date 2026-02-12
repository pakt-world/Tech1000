"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ChangePassword } from "@/widgets/settings/mobile/change-password";

export default function ChangePasswordPage(): JSX.Element | boolean {
	const tab = useMediaQuery("(min-width: 640px)");

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			window.location.href = `/settings`;
		}
	}, [tab]);

	return !tab && <ChangePassword />;
}
