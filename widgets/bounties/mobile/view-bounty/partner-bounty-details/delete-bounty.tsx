"use partner";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { type FC, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { useDeleteBounty, useGetBountyById } from "@/lib/api/bounty";
import success from "@/lottiefiles/success2.json";
import Lottie from "@/components/common/lottie";

interface PartnerDeleteBountyModalProps {
	bountyId: string;
}

export const DeleteBountyMobile: FC<PartnerDeleteBountyModalProps> = ({
	bountyId,
}) => {
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const router = useRouter();

	const bountyQuery = useGetBountyById({ bountyId });
	const { data: bounty } = bountyQuery;
	const title = bounty?.name as string;

	const deleteBountyMutation = useDeleteBounty();

	if (showSuccessMessage) {
		return (
			<div className="relative flex h-full w-full flex-col justify-center gap-4 bg-primary p-6">
				<div className="absolute inset-0 right-0 !z-0 bg-gradient-piece bg-cover bg-no-repeat" />
				<div className="flex flex-col items-center gap-1">
					<div className="-mt-[4] max-w-[200px]">
						<Lottie animationData={success} loop={false} />
					</div>

					<h2 className="text-2xl font-medium text-white">
						Bounty Deleted
					</h2>
					<span className="text-center text-white">
						This Bounty has been deleted.
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex h-full w-full flex-col gap-4 bg-primary pb-8">
			<MobileBreadcrumb
				items={[
					{
						label: "Bounties",
						link: "/bounties?bounties-type=open",
					},
					{
						label: "Bounties Details",
						link: `/bounties/${bountyId}`,
					},
					{
						label: "Delete",
						link: `/bounties/${bountyId}/delete`,
						active: true,
					},
				]}
			/>
			<div className="z-10 flex flex-col items-center justify-center gap-4 px-4">
				<h2 className="text-2xl font-medium text-white">
					Delete Bounty
				</h2>
				{title && (
					<h3 className="flex items-center gap-1 text-xl font-medium text-white">
						<span className="text-red-600">-</span>
						<span className="text-center">{title}</span>{" "}
						<span className="text-red-600">-</span>
					</h3>
				)}
				<span className="text-center text-[#979C9E]">
					This action is irreversible. Once you delete the Bounty, all
					of its content and data will be permanently erased. The
					funds will be returned to your wallet.
				</span>
			</div>
			<div className="z-10 mb-20 mt-auto flex w-full flex-col items-center justify-between gap-8 px-4">
				<span className="text-center font-bold text-white">
					Are you sure you want to proceed with the deletion?
				</span>
				<div className="flex w-full flex-row items-center justify-between gap-2">
					<Button
						fullWidth
						variant="white"
						onClick={() => {
							router.back();
						}}
					>
						No, Cancel
					</Button>

					<Button
						fullWidth
						variant="outline"
						onClick={() => {
							deleteBountyMutation.mutate(
								{ id: bountyId },

								{
									onSuccess: () => {
										setShowSuccessMessage(true);
										setTimeout(() => {
											router.push("/bounties");
										}, 1000);
									},
								}
							);
						}}
						disabled={deleteBountyMutation.isLoading}
					>
						{deleteBountyMutation.isLoading ? (
							<Spinner />
						) : (
							"Yes, Proceed"
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};
