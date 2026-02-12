/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { arc } from "d3-shape";
import { type FC, useId, useRef } from "react";
import { useIsClient } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import ProfileAvatar from "./profile-avatar";

type Size = "xs" | "sm" | "2sm" | "md" | "2md" | "lg" | "xl" | "2xl" | "3xl";

const SIZE_TO_PX: Record<Size, number> = {
	xs: 40,
	sm: 60,
	"2sm": 89,
	md: 110,
	"2md": 130,
	lg: 150,
	xl: 180,
	"2xl": 200,
	"3xl": 220,
};

interface SnowScoreProps {
	size: Size;
	score?: number;
	children?: React.ReactNode;
	isPartner?: boolean;
}

const progressToColor = (progress: number): string => {
	if (progress <= 24) {
		return "#fa0832";
	}
	if (progress <= 49) {
		return "#ffbf04";
	}
	if (progress <= 74) {
		return "#649ff9";
	}
	return "#17a753";
};

export const SnowScore: FC<SnowScoreProps> = ({
	size,
	score: initialScore = 63,
	children,
	isPartner,
}) => {
	const id = useId();
	const svgRef = useRef<SVGSVGElement>(null);
	const sizeInPx = SIZE_TO_PX[size];
	const thickness = sizeInPx / 11;
	const knobRadius = thickness * 1.2;
	const radius = (sizeInPx - thickness) / 2;

	const progressAngle = (initialScore / 100) * 2 * Math.PI;

	const bgArcGenerator = arc()
		.startAngle(0)
		.outerRadius(radius)
		.endAngle(2 * Math.PI)
		.innerRadius(radius - thickness);

	const progressArcGenerator = arc()
		.startAngle(0)
		.outerRadius(radius)
		.endAngle(progressAngle)
		.innerRadius(radius - thickness)
		.cornerRadius(666);

	// @ts-expect-error Expects 1 arguments, but got 0.
	const bgArcPath = bgArcGenerator();
	// @ts-expect-error Expects 1 arguments, but got 0.
	const progressArcPath = progressArcGenerator();

	// Add a knob to the progress arc
	const knobX =
		(radius - thickness / 2) * Math.cos(progressAngle - Math.PI / 2);
	const knobY =
		(radius - thickness / 2) * Math.sin(progressAngle - Math.PI / 2);

	const knobPosition = { x: knobX, y: knobY };

	// const onDrag = (event: MouseEvent): void => {
	//     if (!svgRef.current) return;
	//     const svgRect = svgRef.current.getBoundingClientRect();

	//     const newKnobPosition = {
	//         x: event.clientX - svgRect.left - radius,
	//         y: event.clientY - svgRect.top - radius,
	//     };

	//     setKnobPosition(newKnobPosition);

	//     // Calculate the new score based on the knob position
	//     const angle = Math.atan2(newKnobPosition.y, newKnobPosition.x);
	//     const newScore = (((angle + Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) * 100;
	//     setScore(newScore);
	// };

	return (
		<div className="relative flex items-center justify-center">
			<div
				style={{
					height: radius * 2,
					width: radius * 2,
					borderRadius: "666",
					overflow: "hidden",
					position: "absolute",
				}}
			>
				{children}
			</div>
			{!isPartner && initialScore === 0 && (
				<div
					className={`absolute right-0 top-[30%] z-20 flex h-[26px] w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-400 text-white${size === "lg" ? "!-right-4 scale-95" : size === "2md" ? "scale-85 !-right-4" : size === "md" ? "!-right-5 scale-75" : size === "sm" ? "!-right-8 scale-[0.6]" : ""}`}
				>
					<span className="text-center text-xs leading-[18px] tracking-wide text-white">
						New
					</span>
				</div>
			)}
			<svg
				ref={svgRef}
				width={sizeInPx + knobRadius}
				height={sizeInPx + knobRadius}
				viewBox={`0 0 ${sizeInPx + knobRadius} ${sizeInPx + knobRadius}`}
				style={{
					transform: "rotate(180deg)",
				}}
			>
				<style type="text/css">
					{`
            .progress-gradient {
              background-image: conic-gradient(
                from 0deg at 50% 50%,
                #fc2533,
                #fc2533,
                #ffc005,
                #ffc005,
                #ffc005,
                #649ff9,
                #649ff9,
                #649ff9,
                #04a82a,
                #04a82a
              );
            }
          `}
				</style>

				<g
					transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}
				>
					<clipPath id={id}>
						<path
							d={progressArcPath}
							transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}
						/>
					</clipPath>
					<path d={bgArcPath} fill="#454545" />
				</g>
				<foreignObject
					x="0"
					y="0"
					width={sizeInPx + knobRadius}
					height={sizeInPx + knobRadius}
					clipPath={`url(#${id})`}
				>
					<div
						className="progress-gradient"
						style={{
							width: sizeInPx + knobRadius,
							height: sizeInPx + knobRadius,
							borderRadius: 999,
						}}
					/>
				</foreignObject>

				{/* KNOB */}
				{!isPartner && (
					<g className="cursor-grab">
						<circle
							style={{
								display: initialScore === 0 ? "none" : "block",
							}}
							// onMouseDown={(e) => {
							//   e.preventDefault();
							//   window.addEventListener('mousemove', onDrag);
							//   window.addEventListener('mouseup', () => {
							//     window.removeEventListener('mousemove', onDrag);
							//   });
							// }}
							cx={knobPosition.x}
							cy={knobPosition.y}
							r={knobRadius}
							fill={progressToColor(initialScore)}
							transform={`translate(${(sizeInPx + knobRadius) / 2}, ${(sizeInPx + knobRadius) / 2})`}
						/>

						<text
							className="select-none"
							style={{
								display: initialScore === 0 ? "none" : "block",
							}}
							x={knobPosition.x + (sizeInPx + knobRadius) / 2}
							y={knobPosition.y + (sizeInPx + knobRadius) / 2}
							dy=".3em"
							textAnchor="middle"
							fill="white"
							fontWeight={700}
							transform={`rotate(180, ${knobPosition.x + (sizeInPx + knobRadius) / 2},
							${knobPosition.y + (sizeInPx + knobRadius) / 2})`}
							fontSize={Math.round(sizeInPx / 10)}
						>
							{`${Math.round(initialScore)}`}
						</text>
					</g>
				)}
			</svg>
		</div>
	);
};

type SnowProfileProps = Omit<SnowScoreProps, "children"> & {
	src?: string;
	url?: string;
	isPartner?: boolean;
	disabled?: boolean;
	score?: number | undefined;
	className?: string;
	onClick?: () => void;
};

export const SnowProfile: FC<SnowProfileProps> = ({
	size,
	score,
	src,
	url,
	isPartner,
	className,
	onClick,
}) => {
	const isClient = useIsClient();

	if (!isClient) {
		return null;
	}

	return (
		<div
			className={`relative flex items-center justify-center ${className}`}
			onClick={onClick ?? onClick}
		>
			<ProfileAvatar
				score={score}
				src={src || ""}
				url={url || ""}
				size={size}
				isPartner={isPartner}
			/>
		</div>
	);
};
