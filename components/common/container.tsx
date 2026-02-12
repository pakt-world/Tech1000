/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";

interface Props {
	children: React.ReactNode;
	className?: string;
}

export const Container = ({
	children,
	className,
}: Props): React.JSX.Element => {
	return (
		<div className={`${cn("container mx-auto w-full px-4", className)}`}>
			{children}
		</div>
	);
};
