/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";
import { type FC } from "react";

interface SpinnerProps {
	size?: number;
	className?: string;
}

export const Spinner: FC<SpinnerProps> = ({ size = 24, className }) => {
	return (
		<div className={`flex w-full items-center justify-center ${className}`}>
			<Loader className="animate-spin" size={size} />
		</div>
	);
};
