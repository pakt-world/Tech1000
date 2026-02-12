/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as Dialog from "@radix-ui/react-dialog";
import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "@/lib/utils";

interface Props {
	isOpen: boolean;
	className?: string;
	children: React.ReactNode;
	onOpenChange: (open: boolean) => void;
	disableClickOutside?: boolean;
	handleOverlayClick?: (e: React.MouseEvent) => void;
}

export const Modal: FC<Props> = ({
	children,
	isOpen,
	onOpenChange,
	className,
	disableClickOutside,
	handleOverlayClick,
}) => {
	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay
					className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-none duration-200 data-[state=open]:animate-overlayShow"
					onClick={handleOverlayClick}
				/>
				<Dialog.Content
					className={cn(
						"fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow",
						className
					)}
					onInteractOutside={(e) => {
						if (disableClickOutside) {
							e.preventDefault();
						}
					}}
				>
					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
