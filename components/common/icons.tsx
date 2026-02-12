/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

interface IconProps {
	size?: number;
	className?: string;
	style?: React.CSSProperties;
	// eslint-disable-next-line react/no-unused-prop-types
	fill?: string;
	// eslint-disable-next-line react/no-unused-prop-types
	onClick?: () => void;
}

export const DollarIcon: FC<IconProps> = ({ size = 24, className, style }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			className={className}
			fill="currentColor"
			viewBox={`0 0 ${size} ${size}`}
			style={{ msFilter: "", ...style }}
		>
			<path d="M15.999 8.5h2c0-2.837-2.755-4.131-5-4.429V2h-2v2.071c-2.245.298-5 1.592-5 4.429 0 2.706 2.666 4.113 5 4.43v4.97c-1.448-.251-3-1.024-3-2.4h-2c0 2.589 2.425 4.119 5 4.436V22h2v-2.07c2.245-.298 5-1.593 5-4.43s-2.755-4.131-5-4.429V6.1c1.33.239 3 .941 3 2.4zm-8 0c0-1.459 1.67-2.161 3-2.4v4.799c-1.371-.253-3-1.002-3-2.399zm8 7c0 1.459-1.67 2.161-3 2.4v-4.8c1.33.239 3 .941 3 2.4z" />
		</svg>
	);
};

export const CheckMark: FC<IconProps> = ({
	size = 24,
	className,
	style,
	fill,
	onClick,
}) => {
	if (fill) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={size}
				height={size}
				className={className}
				fill={fill}
				viewBox={`0 0 ${size} ${size}`}
				style={{ msFilter: "", ...style }}
				onClick={onClick}
			>
				<path
					fill="rgba(33,173,33,1)"
					d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.413-1.414-5.657 5.657-2.829-2.829-1.414 1.414L11.003 16z"
				/>
			</svg>
		);
	}
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			className={className}
			viewBox={`0 0 ${size} ${size}`}
			style={{ msFilter: "", ...style }}
		>
			<path
				fill="#ffffff"
				d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.657-5.657 1.414 1.414L11.003 16z"
			/>
		</svg>
	);
};
