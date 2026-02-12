"use client";

import CardView from "@/components/common/card-view";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode } from "react";

export const FeedWrapper = ({
	children,

	icon: Icon,
	className,
	onClick,
}: {
	children: ReactNode;

	icon?: React.ElementType;
	className?: string;
	onClick?: () => void;
}): JSX.Element => {
	return (
		<CardView
			className={`relative gap-4 overflow-hidden rounded-none !p-4 md:min-h-[175px] md:rounded-[30px] ${className}`}
			onClick={onClick}
		>
			{children}

			{Icon && (
				<div className="absolute right-4 top-0 -z-[1] translate-x-1/3">
					<Icon size={200} color="#CCF97533" />
				</div>
			)}
		</CardView>
	);
};
