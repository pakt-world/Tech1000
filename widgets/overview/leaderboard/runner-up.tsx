"use client";

import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { SnowProfile } from "@/components/common/snow-profile";
import { truncate } from "@/lib/utils";

import { type LeaderBoardItemProps } from "./types";

export const RunnerUp = ({
	_id,
	name,
	score,
	nftTokenNumber,
	avatar,
	place,
	scoreLabel,
}: LeaderBoardItemProps & { desktop?: boolean }): JSX.Element => {
	const router = useRouter();

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() => {
				router.push(`/members/${_id}`);
			}}
			className="flex h-[61px] items-center gap-2 rounded-[10px] border border-[#6D6D6D] bg-ink-darkest p-3 pl-1"
		>
			<SnowProfile
				src={avatar}
				score={Math.round(nftTokenNumber)}
				size="sm"
				url={`/members/${_id}`}
			/>
			<div className="grow">
				<span className="text-base text-[#ECFCE5] ">
					{truncate(name, 15)}
				</span>
				<div className="flex items-center justify-between gap-2">
					<span className="text-sm text-[#F2F4F5]">
						<p>{`${scoreLabel}: ${Math.round(score)}`}</p>
					</span>
					<span className="text-sm text-[#CDCFD0]">{place}</span>
				</div>
			</div>
		</div>
	);
};
