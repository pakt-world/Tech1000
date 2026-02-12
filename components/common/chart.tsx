"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format, getDate } from "date-fns";
import { useState } from "react";
import {
	Brush,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	type TooltipProps,
	XAxis,
	YAxis,
} from "recharts";

import { formatNumberWithCommas } from "@/lib/utils";

import { Skeleton } from "./skeletons/skeleton";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

interface TransformedData {
	date: string;
	amt: number;
	// [key: string]: string | number; // Add this line
}

interface ChartProps {
	data: TransformedData[];
	height?: "sm" | "md" | "lg";
	dataKey: string;
	xAxisKey: string;
	showBrush?: boolean;
	showTooltip?: boolean;
	fullBrush?: boolean;
	noOfTicks?: number;
	useFormattedDateTick?: boolean;
	isLoading?: boolean;
}

const HEIGHT_MAP = {
	sm: 200,
	md: 300,
	lg: 400,
};

const formatter = (value: number): string =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(value);

const CustomTooltip = ({
	active,
	payload,
	label,
}: TooltipProps<number, string>): JSX.Element | null => {
	if (active && payload?.length) {
		return (
			<div className="flex flex-col gap-y-1 rounded-[4px] border-none bg-[#4CD471] px-[10px] py-2">
				<p className="label text-xs leading-5 text-white">{label}</p>

				<div className="flex items-center gap-x-1">
					<div className="size-2 rounded-full bg-[#ECFCE5]" />
					<p className="label text-sm font-medium leading-4 text-white">
						$
						{formatNumberWithCommas(
							payload[0]?.payload?.value?.toFixed(2)
						) ||
							formatNumberWithCommas(
								payload[0]?.value?.toFixed(2)
							)}
					</p>
				</div>
			</div>
		);
	}

	return null;
};

const formatDateTick = (tick: string): string => {
	const date = new Date(tick);

	if (getDate(date) % 5 === 0) {
		return format(date, "MMM dd");
	}
	return "";
};

interface BrushStartEndIndexProps {
	startIndex?: number;
	endIndex?: number;
}

export const Chart = ({
	data,
	dataKey,
	xAxisKey,
	height = "sm",
	showBrush = false,
	showTooltip = true,
	fullBrush = false,
	noOfTicks = 7,
	useFormattedDateTick = false,
	isLoading,
}: ChartProps): React.JSX.Element => {
	const totalDataPoints = data.length;

	const [brushIndex, setBrushIndex] = useState({
		startIndex:
			fullBrush || useFormattedDateTick
				? 0
				: Math.max(0, totalDataPoints - 1 - noOfTicks),
		endIndex: totalDataPoints - 1,
	});

	const handleBrushChange = (area: BrushStartEndIndexProps): void => {
		const startIndex = area.startIndex ?? 0;
		const endIndex = area.endIndex ?? 0;

		setBrushIndex({ startIndex, endIndex });
	};

	if (isLoading) {
		return (
			<div
				className={`z-50 flex size-full grow flex-col items-center justify-center rounded-lg p-0 ${HEIGHT_MAP[height]}`}
			>
				<Skeleton className="size-full" />
			</div>
		);
	}
	const checkAllAmountsZero = (d: TransformedData[]): boolean => {
		return d.every((item) => item.amt === 0);
	};

	if (!isLoading && checkAllAmountsZero(data)) {
		return (
			<div className="flex size-full items-center justify-center">
				<p className="text-sm text-white sm:text-base">
					Your chart will appear here
				</p>
			</div>
		);
	}

	return (
		<ResponsiveContainer
			width="100%"
			height="100%"
			maxHeight={HEIGHT_MAP[height]}
			className="w-full grow"
		>
			<LineChart
				data={data}
				margin={{ top: 5, right: 4, left: -5, bottom: 0 }}
				// margin={{ top: 5, right: 4, left: 10, bottom: 5 }} // Desktop
			>
				<XAxis
					dataKey={xAxisKey}
					fontSize="12px"
					tick={{
						fill: "#ffffff",
						transform: "translate(0, 5)",
					}}
					// axisLine={false}
					stroke="#72777A"
					interval={
						showBrush || useFormattedDateTick ? 0 : "preserveEnd"
					}
					tickFormatter={
						useFormattedDateTick ? formatDateTick : undefined
					}
				/>
				<YAxis
					// width={40}
					fontSize="12px"
					tick={{
						fill: "#ffffff",
					}}
					stroke="#72777A"
					domain={["auto", "auto"]}
					tickFormatter={formatter}
					axisLine={false}
				/>
				<CartesianGrid stroke="#72777A" horizontal={false} />
				<Line
					dot={false}
					type="stepAfter"
					stroke="#4CD471"
					strokeWidth={2}
					name={dataKey}
					dataKey={dataKey}
				/>
				{showTooltip && (
					<Tooltip offset={-20} content={CustomTooltip} />
				)}
				{showBrush && (
					<Brush
						dataKey={xAxisKey}
						onChange={handleBrushChange}
						startIndex={brushIndex.startIndex}
						endIndex={brushIndex.endIndex}
						height={18}
						stroke="#452F28"
						fontSize="12px"
					/>
				)}
			</LineChart>
		</ResponsiveContainer>
	);
};
