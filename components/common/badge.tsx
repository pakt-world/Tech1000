/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";

interface BadgeProps {
	title?: string;
	value?: string;
	total?: number;
	textColor?: string;
	bgColor?: string;
	// type?: string;
	isPartner?: boolean;
	borderColor: string;
}

export const Badge = ({
	title = "",
	// value = "",
	total = 0,
	textColor = "",
	bgColor = "",
	// type = "",
	isPartner,
}: BadgeProps): JSX.Element => {
	const lockedBadge = title === "Referral" || title === "Squad";

	return (
		<div
			className="flex w-full flex-col items-center justify-center rounded-lg border py-3 text-center text-base"
			style={{
				color: textColor,
				background: bgColor,
				borderColor: textColor,
			}}
		>
			{isPartner ? (
				<Image
					src="/icons/lock.png"
					height={50}
					width={50}
					alt="locked"
					className="mx-auto"
				/>
			) : lockedBadge ? (
				<Image
					src="/icons/lock.png"
					height={50}
					width={50}
					alt="locked"
					className="mx-auto"
				/>
			) : (
				<div className="mx-auto flex flex-col items-center font-mono text-xs 2xl:text-sm">
					<p className="font-mono">{total}</p>
				</div>
			)}
			<p className="font-mono text-xs 2xl:text-sm">
				{!lockedBadge && !isPartner && title}
			</p>
		</div>
	);
};
