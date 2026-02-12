"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

interface BreadcrumbItem {
	label: string;
	action?: () => void;
	active?: boolean;
	link?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	className?: string;
}

export const MobileBreadcrumb = ({
	items,
	className,
}: BreadcrumbProps): JSX.Element => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const handleItemClick = (index: number): void => {
		setActiveIndex(index);
		if (items[index]?.action) {
			items[index]?.action?.();
		}
	};
	return (
		<div
			className={`primary_border-y sticky -top-px left-0 z-50 inline-flex !min-h-[43px] w-full flex-col items-start justify-center gap-2.5 border-2 border-white/20 bg-ink-darkest/40 from-white via-transparent to-white px-4 sm:hidden ${className}`}
		>
			<div className="flex h-full items-center justify-center gap-2">
				{items?.map((item, index) => (
					<div key={index} className="flex h-full items-center gap-2">
						{index !== 0 && (
							<ChevronRight size={16} className="text-white" />
						)}
						<Link
							href={item.link ?? "#"}
							className={`max-w-[200px] truncate font-circular text-sm leading-[21px] tracking-wide ${(item.active ?? index === activeIndex) ? "font-semibold !text-white" : "!text-gray-500"}`}
							onClick={(e) => {
								e.stopPropagation();
								handleItemClick(index);
							}}
						>
							{item.label}
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};
