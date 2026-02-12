"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronDown, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";

import { Spinner } from "@/components/common/loader";

import { FirstPlace } from "../first-place";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { RunnerUp } from "../runner-up";
import { SecondPlace } from "../second-place";
import { ThirdPlace } from "../third-place";
import { useProductVariables } from "@/hooks/use-product-variables";
import { GetTimelineResponse } from "@/lib/api/dashboard";

interface Props {
	leaderboardView: boolean;
	setLeaderboardView: (value: boolean) => void;
	leaderboard: Array<{
		_id: string;
		name: string;
		image: string | undefined;
		score: number;
		position: number;
		title: string;
		nftTokenNumber: number;
	}>;
	isFetched: boolean;
	isFetching: boolean;
	leaderboardData?: GetTimelineResponse;
}

export const MobileLeaderBoard = ({
	leaderboardView,
	setLeaderboardView,
	leaderboard,
	isFetched,
	isFetching,
	leaderboardData,
}: Props): JSX.Element => {
	const ref = useRef(null);
	const desktop = useMediaQuery("(min-width: 640px)");

	const handleClickOutside = (): void => {
		setLeaderboardView(false);
	};

	const { variables } = useProductVariables();

	useOnClickOutside(ref, handleClickOutside);

	return (
		<div
			className={`fixed !z-[9999] flex h-[554px] w-full shrink-0 flex-col gap-2 rounded-t-2xl bg-gradient-leaderboard py-2 transition-all duration-300 ease-in-out sm:hidden ${leaderboardView ? "bottom-0" : " -bottom-full"}`}
			ref={ref}
		>
			<div className="flex w-full flex-col items-center justify-center">
				<div
					className="flex w-full items-center justify-center"
					onClick={() => {
						setLeaderboardView(false);
					}}
					onKeyDown={() => {
						setLeaderboardView(false);
					}}
				>
					<ChevronDown
						className="h-8 w-8 rounded-md bg-opacity-30 text-zinc-300"
						role="button"
						tabIndex={0}
						aria-label="close"
					/>
				</div>

				<h3 className="text-center text-[22px] font-bold leading-[33px] tracking-wide text-slate-50">
					Leaderboard
				</h3>

				{leaderboardData && (
					<div className="flex items-center justify-center gap-1 rounded-2xl bg-[#F2F4F5]/10 px-10 py-1">
						<span className="text-sm text-white">
							Your Position: {leaderboardData?.position ?? 0}/
							{leaderboardData?.total ?? 0}
						</span>
						<ChevronRight className="size-4 text-white" />
					</div>
				)}
			</div>

			<div className="scrollbar-hide relative flex flex-col gap-2 overflow-y-scroll px-3 text-white">
				{!isFetched && isFetching && <Spinner />}
				{leaderboard.map((l, i) => {
					if (l.position === 1)
						return (
							<FirstPlace
								key={i}
								_id={l._id}
								name={l.name}
								nftTokenNumber={l.nftTokenNumber}
								score={l.score}
								avatar={l.image}
								desktop={desktop}
								scoreLabel={variables?.SCORE_LABEL}
							/>
						);
					if (l.position === 2)
						return (
							<SecondPlace
								key={i}
								_id={l._id}
								name={l.name}
								nftTokenNumber={l.nftTokenNumber}
								score={l.score}
								avatar={l.image}
								desktop={desktop}
								scoreLabel={variables?.SCORE_LABEL}
							/>
						);
					if (l.position === 3)
						return (
							<ThirdPlace
								key={i}
								_id={l._id}
								name={l.name}
								nftTokenNumber={l.nftTokenNumber}
								score={l.score}
								avatar={l.image}
								desktop={desktop}
								scoreLabel={variables?.SCORE_LABEL}
							/>
						);
					return (
						<RunnerUp
							key={i}
							_id={l._id}
							name={l.name}
							nftTokenNumber={l.nftTokenNumber}
							score={l.score}
							place={`${l.position}th`}
							avatar={l.image}
							desktop={desktop}
							scoreLabel={variables?.SCORE_LABEL}
						/>
					);
				})}
			</div>
		</div>
	);
};
