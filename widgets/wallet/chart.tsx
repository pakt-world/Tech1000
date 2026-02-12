"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as Tabs from "@radix-ui/react-tabs";
import { useRouter, useSearchParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Chart } from "@/components/common/chart";
import { useFetchWalletStats } from "@/lib/api/wallet";
import { transformAndSortData } from "@/lib/utils";

export interface TransformedData {
	date: string;
	amt: number;
	// [key: string]: string | number;
}

export const WalletBalanceChart = (): JSX.Element => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const queryParams = new URLSearchParams(searchParams);

	const period = queryParams.get("period") ?? "weekly";
	const format =
		period === "weekly"
			? "ddd"
			: period === "monthly"
				? "DD MMM"
				: "MMM YY";

	const { data: stats, isLoading } = useFetchWalletStats({
		format: period,
	});
	const data: TransformedData[] = transformAndSortData(stats, format);

	const modifiedData = [...data];

	if (modifiedData.length > 0) {
		const lastData = modifiedData[
			modifiedData.length - 1
		] as TransformedData;
		const additionalDataPoint = { date: "", amt: lastData.amt };
		modifiedData.push(additionalDataPoint);
	}

	return (
		<Tabs.Root
			defaultValue="week"
			className="container_style flex flex-col gap-2 rounded-lg p-2 max-sm:h-[250px]"
		>
			<div className="flex items-center justify-between gap-2">
				<span className="text-lg font-medium text-white">
					Balance Chart
				</span>

				<Tabs.List className="flex gap-1 rounded-lg bg-[#7676801F] p-1 text-xs text-white">
					<Tabs.Trigger
						className="rounded-md p-1 px-2 duration-200 hover:bg-white hover:bg-opacity-20 radix-state-active:bg-white radix-state-active:text-primary"
						value="week"
						onClick={() => {
							router.push("/wallet?period=weekly");
						}}
					>
						7 Days
					</Tabs.Trigger>
					<Tabs.Trigger
						className="rounded-md p-1 px-2 duration-200 hover:bg-white hover:bg-opacity-20 radix-state-active:bg-white radix-state-active:text-primary"
						value="month"
						onClick={() => {
							router.push("/wallet?period=monthly");
						}}
					>
						30 Days
					</Tabs.Trigger>
					<Tabs.Trigger
						className="rounded-md p-1 px-2 duration-200 hover:bg-white hover:bg-opacity-20 radix-state-active:bg-white radix-state-active:text-primary"
						value="year"
						onClick={() => {
							router.push("/wallet?period=yearly");
						}}
					>
						1 Year
					</Tabs.Trigger>
				</Tabs.List>
			</div>
			<div className="h-full">
				<Tabs.Content value="week" className="h-full">
					<Chart
						data={modifiedData}
						dataKey="amt"
						xAxisKey="date"
						height="lg"
						isLoading={isLoading}
					/>
				</Tabs.Content>
				<Tabs.Content value="month" className="h-full">
					<Chart
						data={modifiedData}
						dataKey="amt"
						xAxisKey="date"
						height="lg"
						showBrush
						useFormattedDateTick
						noOfTicks={10}
						isLoading={isLoading}
					/>
				</Tabs.Content>
				<Tabs.Content value="year" className="h-full">
					<Chart
						data={modifiedData}
						dataKey="amt"
						xAxisKey="date"
						height="lg"
						noOfTicks={12}
						fullBrush
						showBrush
						isLoading={isLoading}
					/>
				</Tabs.Content>
			</div>
		</Tabs.Root>
	);
};
