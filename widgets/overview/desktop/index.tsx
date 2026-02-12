"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { KycVerificationStatus } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { isProductionEnvironment, userKycIsApproved } from "@/lib/utils";
import { useMobileContext } from "@/providers/mobile-context-provider";
import FeedView4Desktop from "@/widgets/overview/desktop/feed";
import { UserGreetings4Desktop } from "@/widgets/overview/desktop/header/user-greetings";
import { GroupsCTA4Desktop } from "@/widgets/overview/desktop/header/call-to-action";
import { LeaderBoard } from "@/widgets/overview/leaderboard/screens/desktop";
import { useMediaQuery } from "usehooks-ts";
import { useCardVisibility } from "@/providers/card-visibility-provider";

const Overview4Desktop = () => {
	const { isAtTop } = useMobileContext();
	const { profileCompleteness, kycStatus } = useUserState();

	const isCardVisible = useCardVisibility(null);

	const isDesktop = useMediaQuery("(min-width: 1280px)");

	const profileScore = profileCompleteness ?? 0;
	const profileCompleted = profileScore > 70;
	const userHasDoneKyc = userKycIsApproved(
		kycStatus ?? KycVerificationStatus.EMPTY
	);
	const shouldResetMarginTop =
		!isAtTop ||
		!profileCompleted ||
		!userHasDoneKyc ||
		!isProductionEnvironment;
	const marginTopClass = shouldResetMarginTop
		? "max-sm:mt-0"
		: "max-sm:mt-[78px]";

	const isOverviewPage =
		window.location.pathname === "/overview" && isCardVisible;

	return (
		<div
			className={`flex w-full justify-start gap-6 transition-all duration-300 ease-in-out max-sm:h-full md:pt-0 ${marginTopClass} ${isOverviewPage ? " pt-20" : " pt-0"}`}
		>
			<div className="relative flex w-full grow flex-col max-sm:h-full max-sm:overflow-hidden sm:gap-7">
				{isDesktop && <UserGreetings4Desktop />}
				{isDesktop && <GroupsCTA4Desktop />}
				<FeedView4Desktop />
			</div>

			<div className="relative z-20 hidden min-h-full w-full shrink-0 basis-[270px] flex-col items-center overflow-y-auto sm:flex">
				<div className="scrollbar-hide fixed right-6 flex size-full w-[270px] flex-1 basis-0 flex-col overflow-y-auto">
					<LeaderBoard />
				</div>
			</div>
		</div>
	);
};

export default Overview4Desktop;
