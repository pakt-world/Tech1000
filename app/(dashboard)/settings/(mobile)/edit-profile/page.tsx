"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { useIsClient, useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { EditProfile } from "@/widgets/settings/mobile/edit-profile";

export default function EditProfilePage(): JSX.Element {
	const tab = useMediaQuery("(min-width: 640px)");
	const isClient = useIsClient();

	useEffect(() => {
		if (tab) {
			// Redirect to the desktop version of the page
			window.location.href = `/settings`;
		}
	}, [tab]);

	return isClient && !tab && <EditProfile />;
}
