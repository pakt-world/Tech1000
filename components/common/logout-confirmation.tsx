"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useProductVariables } from "@/hooks/use-product-variables";

import { Button } from "./button";
import { Modal } from "./headless-modal";
import CardView from "./card-view";

interface LogoutConfirmationProps {
	showLogoutConfirmation: boolean;
	stayActive: () => void;
	Logout: () => void;
}

export const LogoutConfirmation = ({
	showLogoutConfirmation,
	stayActive,
	Logout,
}: LogoutConfirmationProps): JSX.Element => {
	const { variables } = useProductVariables();
	return (
		<Modal
			isOpen={showLogoutConfirmation}
			closeModal={() => {
				stayActive();
			}}
			disableClickOutside
		>
			<CardView className=" flex w-full flex-col items-center gap-4 !overflow-hidden rounded-xl !p-6 text-center">
				<h2 className="text-2xl font-bold text-white">Logout</h2>
				<p className="text-white">
					Do you want to logout of {variables?.NAME}?
				</p>

				<div className="flex w-full items-center gap-1">
					<Button
						fullWidth
						variant="outline"
						className="scale-95"
						onClick={stayActive}
					>
						No
					</Button>
					<Button
						fullWidth
						className="scale-90"
						variant="white"
						onClick={Logout}
					>
						Yes
					</Button>
				</div>
			</CardView>
		</Modal>
	);
};
