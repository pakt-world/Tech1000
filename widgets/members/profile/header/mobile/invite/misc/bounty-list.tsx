"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactElement, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PageEmpty } from "@/components/common/page-empty";
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { type CollectionProps } from "@/lib/types/collection";

import { BountyCard } from "./bounty-card";
import { BountyListButton } from "./bounty-list-button";

interface BountyListProps {
	bounties: CollectionProps[];
	talentId: string;
	rates: ExchangeRateRecord | undefined;
}

export const BountyList = ({
	bounties,
	talentId,
	rates,
}: BountyListProps): ReactElement | null => {
	const router = useRouter();
	const [bountyId, setBountyId] = useState<string>("");

	if (bounties.length === 0)
		return <PageEmpty label="Your Created Bounties Will Appear Here" />;

	return (
		<div className="flex w-full flex-col bg-primary">
			<div className="fixed top-[70px] z-40 flex w-full flex-col">
				<div className="bg-hover-gradient p-4 text-white">
					<div
						className="flex cursor-pointer items-center gap-2"
						onClick={() => {
							setBountyId("");
							router.back();
						}}
						onKeyDown={() => {}}
						aria-label="Go Back"
						role="button"
						tabIndex={0}
					>
						<ChevronLeft size={24} strokeWidth={2} />
						<h2 className="text-lg font-bold">Invite to Bounty</h2>
					</div>
				</div>
				<div className="primary_border-y bg-primary p-2 px-4">
					<p className="text-lg font-bold text-white">
						Select Bounty to assign talent to
					</p>
				</div>
			</div>
			<div className="mt-[106px] flex w-full flex-grow flex-col overflow-y-auto overflow-x-hidden">
				{bounties.map((b) => {
					return (
						<BountyCard
							bounty={b}
							key={b._id}
							isSelected={bountyId === b._id}
							setBountyId={setBountyId}
							rates={rates}
						/>
					);
				})}
			</div>
			{bountyId !== "" && (
				<BountyListButton
					bountyId={bountyId}
					bounties={bounties}
					talentId={talentId}
				/>
			)}
		</div>
	);
};
