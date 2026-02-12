import { BreadcrumbItem } from "@/lib/types/groups";
import { ChevronRight } from "lucide-react";
import React from "react";

interface BreadcrumbProps {
	items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({ items }) => {
	const visibleCount = -2;

	const handleShowMore = () => {
		items[0]?.action();
	};

	const getVisibleItems = () => {
		const visibleItems = [...items];

		if (visibleItems.length <= 3) {
			return visibleItems;
		}

		const remainingItems = items.slice(-2);

		return remainingItems;
	};

	const visibleItems = getVisibleItems();
	const showEllipsis = items.length >= 4 && visibleCount <= 2;

	return (
		<nav className="flex items-center font-circular text-xs font-semibold md:mb-2 md:text-sm">
			{items.length >= 4 && (
				<>
					{items[0] && (
						<>
							<p
								onClick={items[0].action}
								className={`capitalize focus:outline-none ${items[0].isActive ? "text-lemon-green" : "text-white"}`}
							>
								{`${items[0].label.slice(0, 10)}${items[0].label.length > 10 ? ".." : ""}`}
							</p>
							{!showEllipsis && (
								<ChevronRight
									size={12}
									className="mx-3 text-white"
								/>
							)}
							{showEllipsis && (
								<span
									onClick={handleShowMore}
									className=" mx-3 flex cursor-pointer items-center text-white hover:underline"
								>
									<span>...</span>
								</span>
							)}
						</>
					)}
				</>
			)}
			{visibleItems.map((item, index) => (
				<span key={index} className="flex items-center">
					<>
						<p
							onClick={item.action}
							className={`capitalize focus:outline-none ${item.isActive ? "text-lemon-green" : "text-white"}`}
						>
							{`${item.label.slice(0, 14)} ${item.label.length > 14 ? ".." : ""}`}
						</p>
						{index !== visibleItems.length - 1 && (
							<ChevronRight
								size={14}
								className="mx-3 text-white"
							/>
						)}
					</>
				</span>
			))}
		</nav>
	);
};
