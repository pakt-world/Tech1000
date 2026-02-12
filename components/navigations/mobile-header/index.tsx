"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import { useGetLeaderBoard } from "@/lib/api/dashboard";
import { useUserState } from "@/lib/store/account";
import { useMobileContext } from "@/providers/mobile-context-provider";
import { MobileLeaderBoard } from "@/widgets/overview/leaderboard/screens/mobile";
import { useProductVariables } from "@/hooks/use-product-variables";
import { Spinner } from "@/components/common/loader";
import { useCardVisibility } from "@/providers/card-visibility-provider";

export const MobileHeader = (): JSX.Element | null => {
	const router = useRouter();
	const pathname = usePathname();
	const isCardVisible = useCardVisibility(null);

	const { variables } = useProductVariables();

	const {
		firstName,
		profileImage,
		//@ts-ignore
		meta: { tokenId, imageUrl },
	} = useUserState();
	const { showLeaderBoard, setShowLeaderBoard } = useMobileContext();
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
			score: leader?.score,
			nftTokenNumber: parseInt(leader?.nftTokenNumber || "") || 0,
			position: i + 1,
			title: leader?.profile?.bio?.role ?? "",
		})
	);

	const shouldScale =
		window.location.pathname === "/overview" && isCardVisible;

	if (!firstName) return null;

	if (pathname.startsWith("/messages/")) return null;

	return (
		<>
			<div className="fixed left-0 top-0 !z-30 block max-h-[148px] min-h-[70px] w-full shrink-0 overflow-hidden sm:hidden">
				<div
					className={`absolute z-[5] translate-x-1/2 transition-transform duration-200 ease-in-out will-change-auto ${shouldScale ? "translate-y-1/2 scale-[1.3]" : "translate-y-[2%] scale-100"}`}
				>
					<SnowProfile
						size="md"
						score={parseInt(tokenId || "") || 0}
						src={profileImage?.url}
						url="/profile"
						className={`${shouldScale ? "-left-0" : "-left-[20px]"} relative transition-all duration-300`}
						// isPartner={isPartner}
					/>
				</div>
				<div className="relative !z-[2] flex !h-[70px] w-full items-center justify-between bg-ink-darkest/40 from-white via-transparent to-white px-5 backdrop-blur-sm">
					<div />
					<Button
						className="m-0 h-max w-max p-0"
						onClick={() => {
							router.push("/overview");
						}}
						variant="ghost"
					>
						{variables?.LOGO ? (
							<Image
								src={variables?.LOGO}
								alt={`${variables?.NAME} Logo`}
								width={150}
								height={37}
								className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
							/>
						) : (
							<Spinner />
						)}
					</Button>
					<div
						className="flex h-full cursor-pointer items-center justify-center"
						role="button"
						tabIndex={0}
						aria-label="expand"
					>
						<Image
							src={imageUrl}
							alt={`Nft Logo`}
							width={32}
							height={53}
							className="rounded"
						/>
					</div>
				</div>
				<div
					className={`transition-height relative z-[1] flex w-full items-center overflow-hidden border-y border-white/20 px-5 duration-300 ease-in-out will-change-auto ${shouldScale ? "h-[78px]" : "h-0"}`}
				>
					<div className="absolute inset-0 z-[1] size-full bg-ink-darkest/40 bg-default from-white via-transparent to-white bg-cover bg-center bg-no-repeat object-cover backdrop-blur-sm" />
					{/* <div className="absolute inset-0 z-[1] bg-ink-darkest/40 bg-[url(/images/cardboard.webp)] from-white via-transparent to-white bg-cover bg-center bg-no-repeat object-cover mix-blend-soft-light backdrop-blur-sm" /> */}
					<div className="z-20 flex w-full items-center justify-between gap-2">
						<Button
							className="flex h-[38px] w-max rounded-[10px] border border-white !bg-[#DDB5B8] !bg-opacity-20"
							onClick={() => {
								setShowLeaderBoard(true);
							}}
						>
							<div className="ml-16 flex items-center gap-1">
								<span className="text-sm text-white">
									View Leaderboard
								</span>
								<ChevronRight className="size-4 text-white" />
							</div>
						</Button>
					</div>
				</div>
			</div>
			{pathname === "/overview" && (
				<MobileLeaderBoard
					setLeaderboardView={setShowLeaderBoard}
					leaderboardView={showLeaderBoard}
					leaderboard={leaderboard}
					isFetched={isFetched}
					isFetching={isFetching}
					leaderboardData={leaderboardData}
				/>
			)}
		</>
	);
};
