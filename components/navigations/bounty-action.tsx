"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Plus, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Roles } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { useMobileContext } from "@/providers/mobile-context-provider";

import { Button } from "../common/button";

const BountyAction = (): JSX.Element | boolean => {
	const router = useRouter();
	const pathname = usePathname();
	const urlParams = useSearchParams();
	const tab = urlParams.get("tab");

	const { showOpenBounties } = useMobileContext();
	const user = useUserState();

	const toggleButtons = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.stopPropagation();
		if (user.role === Roles.PARTNER) {
			router.push("/bounties/create");
		} else {
			router.push("/bounties");
		}
	};
	const showBountyAction =
		(pathname === "/overview" && tab !== "bookmarks") ||
		pathname === "/bounties";

	return (
		user.role === Roles.PARTNER && (
			<div
				className={`${showBountyAction && !showOpenBounties ? "block" : "hidden"} fixed bottom-[15%] right-2 z-30 sm:hidden`}
			>
				<Button
					className="relative z-20 !h-[68px] !w-[68px] cursor-pointer rounded-full p-0 !opacity-100 shadow hover:!bg-primary"
					onClick={toggleButtons}
					type="button"
					variant="white"
				>
					{user.role === Roles.PARTNER ? (
						<Plus size={37} />
					) : (
						<Search size={37} />
					)}
				</Button>
			</div>
		)
	);
};

export default BountyAction;
