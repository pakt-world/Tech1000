/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type MobileWalletTransactionsProps } from "../types";
import { TransactionStatus } from "./status";
import { MobileTransactionType } from "./type";
import { ENVS } from "@/config";

// Not using this in any other file - I just added the export
export const TransactionHash = ({ hash }: { hash: string }): JSX.Element =>
	hash !== "" ? (
		<Link
			href={`${ENVS.NEXT_PUBLIC_SNOWTRACE_APP_URL}/tx/${hash}`}
			target="_blank"
			className="inline-flex h-[22px] w-[124.35px] items-center justify-center gap-[6.45px] rounded-lg border bg-violet-100 px-2 py-0.5"
		>
			<span className="shrink grow basis-0 text-center text-xs font-medium leading-[18px] tracking-wide text-indigo-600">
				View On-chain
			</span>
			<ArrowUpRight className="relative h-[12.90px] w-[12.90px] text-indigo-600" />
		</Link>
	) : (
		<div />
	);

export const TransactionItem = ({
	transaction,
}: {
	transaction: MobileWalletTransactionsProps;
}): JSX.Element => (
	<div className="primary_border-x primary_border-y flex w-full flex-col items-start gap-4 rounded-lg bg-primary-light p-4">
		<div className="flex w-full items-center justify-between text-white">
			<span className="text-sm leading-[21px] tracking-wide text-zinc-500">
				{transaction?.date}
			</span>
			<MobileTransactionType type={transaction?.type} />
		</div>
		<div className="inline-flex w-full flex-col items-start justify-start gap-4 rounded-lg">
			<div className="h-[0px] self-stretch border border-gray-200" />
			<h4 className=" line-clamp-2 self-stretch text-base font-medium leading-normal tracking-wide text-white">
				{transaction?.description}
			</h4>
		</div>
		<div className="flex w-full items-center justify-between">
			<div className="flex w-max items-center gap-2.5">
				<p className="text-base font-normal leading-[27px] tracking-wide text-white">
					{transaction?.usdValue}
				</p>
				<Image
					width={20}
					height={20}
					src={transaction?.coin?.icon}
					alt={transaction?.coin?.reference}
				/>
				<p className="text-base font-normal leading-[27px] tracking-wide text-white">
					{transaction?.currency}
				</p>
			</div>
			<TransactionStatus status={transaction?.status} />
		</div>
	</div>
);
