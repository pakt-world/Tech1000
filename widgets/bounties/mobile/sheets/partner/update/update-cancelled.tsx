/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import warning from "@/lottiefiles/warning.json";
import Lottie from "@/components/common/lottie";

export const PartnerBountyUpdateCancelled4Mobile = (): JSX.Element => {
	return (
		<div className="flex h-full flex-col items-center justify-center bg-red-50 text-red-500">
			<div className="flex w-[200px] items-center justify-center">
				<Lottie animationData={warning} loop={false} />
			</div>
			<span>This Bounty has been cancelled</span>
		</div>
	);
};
