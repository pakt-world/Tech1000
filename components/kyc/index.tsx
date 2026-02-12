"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { kycIsPending } from "@/lib/actions";
import { KycVerificationStatus, Roles } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { useKyc } from "@/lib/store/kyc";
import { isProductionEnvironment } from "@/lib/utils";

export const Pending = (): JSX.Element => (
	<div className="flex h-[59px] w-full items-center justify-start rounded-lg border border-blue-400 bg-[#0065D01A] bg-opacity-40 p-4">
		<p className="text-lg leading-[27px] tracking-wide text-blue-300">
			Your KYC is in review. Approval should take no more than 30 minutes.
		</p>
	</div>
);

const Kyc = (): JSX.Element | null => {
	const accountData = useUserState();

	const { setOpenKycModal } = useKyc();

	if (!isProductionEnvironment) {
		return null;
	}

	if (kycIsPending(accountData)) {
		return <Pending />;
	}

	if (accountData.kycStatus !== KycVerificationStatus.APPROVED) {
		return (
			<div className="z-30 flex w-full items-center justify-between rounded-[16px] border border-primary-lighter bg-primary p-4 shadow max-sm:flex-col max-sm:gap-4">
				<p className="text-base font-normal text-white">
					{accountData.type === Roles.RECIPIENT
						? "KYC is required before applying to bounties and making wallet withdrawals."
						: "KYC is required before creating bounties and interacting with the wallet."}
				</p>
				<Button
					variant="white"
					size="lg"
					className="rounded-[10px] max-sm:w-full"
					onClick={() => {
						setOpenKycModal(true);
					}}
				>
					Setup KYC
				</Button>
			</div>
		);
	}

	return null;
};

export default Kyc;
