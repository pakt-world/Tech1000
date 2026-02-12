"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

import { PageError } from "@/components/common/page-error";
import { PageLoading } from "@/components/common/page-loading";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useGetBountyById } from "@/lib/api/bounty";
import { CollectionStatus } from "@/lib/enums";
import warning from "@/lottiefiles/warning.json";

import { BountyUpdates } from "./update";
import { ReviewSuccess } from "./update/update-success";
import Lottie from "@/components/common/lottie";

interface AmbassadorBountySheet4DesktopProps {
	bountyId: string;
	closeModal: () => void;
	extras?: string;
}

export const AmbassadorBountySheet4Desktop: FC<
	AmbassadorBountySheet4DesktopProps
> = ({ bountyId, closeModal, extras }) => {
	const query = useGetBountyById({ bountyId, extras });

	if (query.isError) return <PageError className="absolute inset-0" />;

	if (query.isLoading)
		return <PageLoading className="absolute inset-0" color="#FF99A2" />;

	const bounty = query.data;

	if (bounty.status === CollectionStatus.CANCELLED) {
		return (
			<div className="flex h-full flex-col items-center justify-center bg-red-50 text-red-500">
				<div className="flex w-[200px] items-center justify-center">
					<Lottie animationData={warning} loop={false} />
				</div>
				<span>This Bounty has been cancelled</span>
			</div>
		);
	}

	if (bounty.progress === 100) {
		return <ReviewSuccess closeModal={closeModal} />;
	}

	return <BountyUpdates bounty={bounty} />;
};
