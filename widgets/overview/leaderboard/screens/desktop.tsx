"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetLeaderBoard } from "@/lib/api/dashboard";
import { Roles } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { determineRole } from "@/lib/utils";

import { Spinner } from "../../../../components/common/loader";
import { FirstPlace } from "../first-place";
import { RunnerUp } from "../runner-up";
import { SecondPlace } from "../second-place";
import { ThirdPlace } from "../third-place";
import { useProductVariables } from "@/hooks/use-product-variables";
import Image from "next/image";

export const LeaderBoard = (): ReactElement => {
	const {
		data: leaderboardData,
		isFetched,
		isFetching,
	} = useGetLeaderBoard({
		role: "ambassador",
		limit: 10,
		profileCompletenessMin: 70,
		sortBy: "score",
		orderBy: "desc",
		scoreMin: 1,
	});
	const leaderboard = (leaderboardData?.leaderboard ?? []).map(
		(leader, i) => ({
			_id: leader?._id,
			name: `${leader?.firstName} ${leader?.lastName}`,
			image: leader?.profileImage?.url,
			nftTokenNumber: leader?.nftTokenNumber,
			score: leader?.score,
			position: i + 1,
			title: leader?.profile?.bio?.role ?? "",
		})
	);

	const { variables } = useProductVariables();

	const user = useUserState();
	const isPartner = determineRole(user) === Roles.PARTNER;

	return (
		<>
			<div className="flex h-fit w-full shrink-0 flex-col gap-1 rounded-2xl border border-white/70 border-opacity-30 bg-[#000000] bg-opacity-50 px-3 py-1">
				<div className="text-center text-xl font-bold text-white">
					Leaderboard
				</div>
				{!isPartner && (
					<div className="mx-auto inline-flex h-[27px] w-full items-center justify-center gap-2 rounded-[18px] bg-gray-100 bg-opacity-10 px-2">
						<p className="text-sm leading-[21px] tracking-wide text-white">
							Your Position: {leaderboardData?.position ?? 0} /{" "}
							{leaderboardData?.total ?? 0}
						</p>
					</div>
				)}
				<div className=" scrollbar-hide relative flex flex-col  gap-2  text-white">
					{!isFetched && isFetching && <Spinner />}
					{leaderboard.map((l, i) => {
						if (l.position === 1)
							return (
								<FirstPlace
									key={i}
									_id={l._id}
									name={l.name}
									scoreLabel={variables?.SCORE_LABEL}
									nftTokenNumber={
										parseInt(l.nftTokenNumber || "") || 0
									}
									score={l.score}
									avatar={l.image}
									title={l.title}
									desktop
								/>
							);
						if (l.position === 2)
							return (
								<SecondPlace
									key={i}
									_id={l._id}
									name={l.name}
									nftTokenNumber={
										parseInt(l.nftTokenNumber || "") || 0
									}
									score={l.score}
									avatar={l.image}
									scoreLabel={variables?.SCORE_LABEL}
									title={l.title}
									desktop
								/>
							);
						if (l.position === 3)
							return (
								<ThirdPlace
									key={i}
									_id={l._id}
									name={l.name}
									nftTokenNumber={
										parseInt(l.nftTokenNumber || "") || 0
									}
									score={l.score}
									avatar={l.image}
									scoreLabel={variables?.SCORE_LABEL}
									title={l.title}
									desktop
								/>
							);
						return (
							<RunnerUp
								key={i}
								_id={l._id}
								name={l.name}
								nftTokenNumber={
									parseInt(l.nftTokenNumber || "") || 0
								}
								score={l.score}
								place={`${l.position}th`}
								avatar={l.image}
								scoreLabel={variables?.SCORE_LABEL}
								title={l.title}
								desktop
							/>
						);
					})}
				</div>
			</div>
			<a
				href="https://pakt.world"
				className="relative flex justify-center"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Image
					width="196"
					height="26"
					src="/images/powered-by-pakt.svg"
					alt="powered-by-pakt"
				/>
			</a>
		</>
	);
};
