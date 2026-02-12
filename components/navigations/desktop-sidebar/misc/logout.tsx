"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { LogOut as LogoutIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { useLogoutConfirmationStore } from "@/lib/store/misc";

export const LogOut = ({
	noLabel,
	className = "",
}: {
	noLabel?: boolean;
	className?: string;
}): JSX.Element => {
	const { setShowLogoutConfirmation } = useLogoutConfirmationStore();
	return (
		<Button
			onClick={() => {
				setShowLogoutConfirmation(true);
			}}
			className={`flex w-full items-center rounded-lg px-3 py-2 text-base font-normal text-white duration-200 hover:bg-white hover:bg-opacity-20 sm:min-w-[150px] sm:justify-start ${className}`}
			type="button"
			variant="ghost"
		>
			<LogoutIcon size={20} />
			{!noLabel && <span className="ml-2">Logout</span>}
		</Button>
	);
};
