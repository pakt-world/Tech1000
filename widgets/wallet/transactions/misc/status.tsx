/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type TransactionStatus as TransactionStatusEnums } from "@/lib/enums";

type TransactionStatusColors = {
	[key in TransactionStatusEnums]: { bgColor: string; textColor: string };
};

const TRANSACTION_STATUS_COLORS: TransactionStatusColors = {
	failed: { bgColor: "bg-danger", textColor: "text-danger" },
	completed: { bgColor: "bg-success", textColor: "text-success" },
	pending: { bgColor: "bg-in-progress", textColor: "text-[#FFC107]" },
	processing: { bgColor: "bg-in-progress", textColor: "text-[#FFC107]" },
	reprocessing: { bgColor: "bg-in-progress", textColor: "text-[#FFC107]" },
};

export const TransactionStatus = ({
	status,
}: {
	status: TransactionStatusEnums;
}): JSX.Element => (
	<div
		className={`${
			TRANSACTION_STATUS_COLORS[status].bgColor || "bg-gray-300"
		} flex w-fit items-center gap-2 rounded-full bg-opacity-10 px-3 py-0.5 capitalize`}
	>
		<span
			className={`text-sm ${TRANSACTION_STATUS_COLORS[status].textColor || "text-title"}`}
		>
			{status}
		</span>
	</div>
);
