"use client";

import CardView from "@/components/common/card-view";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode } from "react";

export const BountyFeedWrapper = ({
	children,

	icon: Icon,
	className,
}: {
	children: ReactNode;

	icon?: React.ElementType;
	className?: string;
}): JSX.Element => {
	return (
		<CardView
			className={`relative gap-4 overflow-hidden !p-2 ${className}`}
		>
			{children}

			{Icon && (
				<div className="absolute right-6 top-0 -z-[1] translate-x-1/3">
					<Icon size={174} color="#CCF97533" />
				</div>
			)}
		</CardView>
	);
};
