import React from "react";
import clsx from "clsx";

interface CardViewProps {
	children: React.ReactNode;
	className?: string;
	onClick?: (...args: any[]) => void;
	style?: React.CSSProperties;
	ref?: React.RefObject<HTMLDivElement>;
}

const CardView: React.FC<CardViewProps> = ({
	children,
	className,
	onClick,
	style,
	ref,
}) => {
	return (
		<div
			className={clsx(
				"mx-auto flex w-full items-center rounded-[30px] border-2 border-white/20 bg-ink-darkest/40 from-white via-transparent to-white p-4 backdrop-blur-sm max-sm:h-max sm:px-12 sm:py-12",
				className
			)}
			onClick={onClick}
			style={style}
			ref={ref}
		>
			{children}
		</div>
	);
};

export default CardView;
