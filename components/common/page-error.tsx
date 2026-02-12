/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { AlertCircle } from "lucide-react";
import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "@/lib/utils";

interface Props {
	error?: string;
	className?: string;
}

export const PageError: FC<Props> = ({ error, className }) => {
	return (
		<div
			aria-live="polite"
			aria-busy="true"
			className={cn(
				"flex h-screen w-full items-center justify-center bg-red-50 bg-transparent",
				className
			)}
		>
			<div className="flex flex-col items-center gap-2 text-center text-red-500">
				<AlertCircle size={60} strokeWidth={1} />
				<p className="text-lg">
					{error || "Something went wrong. Please try again later."}
				</p>
			</div>
		</div>
	);
};
