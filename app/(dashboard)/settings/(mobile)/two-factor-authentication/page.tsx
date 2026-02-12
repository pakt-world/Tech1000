"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { TwoFactorAuthentication4Mobile } from "@/widgets/settings/mobile/two-factor-authentication";

export default function TwofaPage(): JSX.Element | boolean {
	const tab = useMediaQuery("(min-width: 640px)");

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			window.location.href = `/settings`;
		}
	}, [tab]);

	return !tab && <TwoFactorAuthentication4Mobile />;
}
