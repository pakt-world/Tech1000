"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Check } from "lucide-react";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
	isComplete?: boolean;
	children: React.ReactNode;
}

export const StepIndicator = ({
	children,
	isComplete,
}: StepIndicatorProps): ReactElement | null => {
	return (
		<label className="flex cursor-pointer items-center gap-4 border-none">
			<Check
				className={cn(
					" flex cursor-pointer items-center gap-4 rounded-lg border-none text-white duration-200 hover:bg-opacity-10",
					{
						" bg-opacity-10 text-green-300 duration-200 hover:bg-opacity-20":
							isComplete,
					}
				)}
			/>
			<span
				className={cn(
					" flex cursor-pointer items-center gap-4 rounded-lg border-none text-white duration-200 hover:bg-opacity-10",
					{
						" bg-opacity-10 text-green-300 duration-200 hover:bg-opacity-20":
							isComplete,
					}
				)}
			>
				{children}
			</span>
		</label>
	);
};
