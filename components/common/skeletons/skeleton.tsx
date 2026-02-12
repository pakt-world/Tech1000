"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-white/10", className)}
			{...props}
		/>
	);
}

export { Skeleton };
