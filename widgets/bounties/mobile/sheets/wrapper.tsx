/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode } from "react";

interface Props {
	isOpen: boolean;
	children: ReactNode;
	className?: string;
}

export const MobileSheetWrapper = ({
	children,
	isOpen,
	className,
}: Props): JSX.Element => {
	return (
		<div
			className={`fixed top-[70px] z-[999] h-[calc(100vh-70px)] w-full overflow-y-scroll bg-primary pb-16 transition-all duration-300 ease-in-out ${isOpen ? "right-0" : "-right-full"} ${className}`}
		>
			<div className="relative h-full w-full">{children}</div>
		</div>
	);
};
