"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { formatDistance } from "date-fns";

import { emptyFunction } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "./button";
import { Modal } from "./headless-modal";

interface SessionTimeoutAlertProps {
	isTimeoutModalOpen: boolean;
	remainingTime: number;
	stayActive: () => void;
	Logout: () => void;
}

export const SessionTimeoutAlert = ({
	isTimeoutModalOpen,
	remainingTime,
	stayActive,
	Logout,
}: SessionTimeoutAlertProps): JSX.Element => {
	return (
		<Modal
			isOpen={isTimeoutModalOpen}
			closeModal={() => {
				emptyFunction();
			}}
			disableClickOutside
		>
			<div className="container_style flex w-full flex-col items-center gap-4 !overflow-hidden rounded-xl p-4 text-center">
				<div className="absolute inset-0 bg-gradient-piece bg-cover bg-no-repeat" />
				<h2 className="text-2xl font-bold text-white">
					Session Expiring
				</h2>
				<p className="text-white">
					Logging out{" "}
					<span>
						{formatDistance(remainingTime, 0, {
							includeSeconds: true,
							addSuffix: true,
						})}
					</span>
				</p>

				<div className="flex w-full items-center gap-1">
					<Button
						fullWidth
						variant="outline"
						className="scale-90"
						onClick={Logout}
					>
						Log Out
					</Button>
					<Button
						fullWidth
						className="scale-95"
						variant="white"
						onClick={stayActive}
					>
						Stay Active
					</Button>
				</div>
			</div>
		</Modal>
	);
};
