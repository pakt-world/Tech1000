"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { DeliverableProgressBar } from "@/components/common/deliverable-progress-bar";
import { SnowProfile } from "@/components/common/snow-profile";
import { type Roles } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { titleCase, truncateText } from "@/lib/utils";
import { AmbassadorBountySheet4Desktop } from "@/widgets/bounties/desktop/sheets/ambassador";
import { PartnerBountySheet4Desktop } from "@/widgets/bounties/desktop/sheets/partner";
import { DesktopSheetWrapper } from "@/widgets/bounties/desktop/sheets/wrapper";

interface ActiveBountyCardProps {
	id: string;
	title: string;
	description: string;
	ambassador: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		role: Roles;
	};
	partner: {
		_id: string;
		name: string;
		avatar: string;
		score: number;
		role: Roles;
	};
	isPartner: boolean;
	progress: {
		total: number;
		progress: number;
	};
	bountyProgress: number;
	tab: boolean;
}

export const ActiveBountyCard = ({
	id,
	ambassador,
	partner,
	title,
	description,
	progress,
	isPartner,
	bountyProgress,
	tab,
}: ActiveBountyCardProps): ReactElement => {
	const [seeMore, setSeeMore] = useState(false);
	const [isDesktopSheetOpen, setIsDesktopSheetOpen] = useState(false);

	const router = useRouter();

	const { _id: loggedInUser } = useUserState();

	const profileAccount = partner?._id === loggedInUser ? ambassador : partner;

	return tab ? (
		<div className="container_style relative z-10 flex w-full  gap-4 overflow-hidden rounded-2xl px-4 pl-2">
			<div className="">
				<SnowProfile
					src={profileAccount?.avatar}
					score={profileAccount?.score}
					size="lg"
					url={`/members/${profileAccount?._id}`}
					isPartner={profileAccount?._id === partner?._id}
				/>
			</div>
			<div className="flex w-full flex-col gap-4 py-4">
				<h3 className="line-clamp-2 text-xl font-bold text-neutral-400">
					{title}
				</h3>
				<p className="line-clamp-2 text-white">{description}</p>
				<div className="mt-auto flex items-center justify-between">
					<div className="flex w-full items-center gap-4">
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="white"
								onClick={() => {
									setIsDesktopSheetOpen(true);
								}}
								className="w-[120px]"
							>
								{isPartner && bountyProgress < 100
									? "View Updates"
									: isPartner && bountyProgress === 100
										? "Review"
										: !isPartner && "Update"}
							</Button>
							<Button
								size="sm"
								variant="outline"
								className="w-[120px]"
								asChild
							>
								<Link
									href={`/messages?userId=${isPartner ? ambassador?._id : partner?._id}`}
								>
									Message
								</Link>
							</Button>
						</div>
						<DeliverableProgressBar
							percentageProgress={progress.progress}
							totalDeliverables={progress.total}
							className="w-full max-w-[300px]"
						/>
					</div>
				</div>
			</div>

			<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
				<Briefcase size={200} color="#F2F4F5" className="opacity-10" />
			</div>
			<DesktopSheetWrapper
				isOpen={isDesktopSheetOpen}
				onOpenChange={setIsDesktopSheetOpen}
				className="flex flex-col"
			>
				{isPartner ? (
					<PartnerBountySheet4Desktop
						bountyId={id}
						ambassadorId={ambassador?._id}
						closeModal={() => {
							setIsDesktopSheetOpen(false);
						}}
					/>
				) : (
					<AmbassadorBountySheet4Desktop
						bountyId={id}
						closeModal={() => {
							setIsDesktopSheetOpen(false);
						}}
					/>
				)}
			</DesktopSheetWrapper>
		</div>
	) : (
		<div
			role="button"
			tabIndex={0}
			onClick={() => {
				router.push(`/bounties/${id}/updates`);
			}}
			// Doesn't work
			onKeyDown={() => {}}
			className="container_style flex w-full cursor-pointer flex-col gap-4 overflow-hidden !border-l-0 !border-r-0 border-b border-t !border-[#9BDCFD] px-[21px] py-4"
		>
			<div className="relative -left-[5px] flex items-center gap-2">
				<SnowProfile
					src={profileAccount.avatar}
					score={profileAccount.score}
					size="sm"
					url={`/members/${profileAccount._id}`}
					isPartner={profileAccount?._id === partner?._id}
				/>
				<div className="inline-flex flex-col items-start justify-start">
					<p className="flex text-lg leading-[27px] tracking-wide text-white">
						{profileAccount.name}
					</p>
					<span className="text-xs leading-[18px] tracking-wide text-gray-300">
						{titleCase(profileAccount.role)}
					</span>
				</div>
			</div>
			<div className="flex w-full flex-col gap-2">
				<h3 className="text-xl font-bold text-white">{title}</h3>
				<div className="relative w-[95%]">
					<p
						className={`inline text-base capitalize text-gray-300 ${!seeMore ? "line-clamp-2" : ""}`}
					>
						{truncateText(description as string, 120, seeMore)}
						&nbsp;
						{(description as string).length > 120 && (
							<button
								type="button"
								className="inline cursor-pointer text-white text-opacity-50 hover:text-opacity-100"
								onClick={(e) => {
									e.stopPropagation();
									setSeeMore(!seeMore);
								}}
							>
								{seeMore ? "less" : "more"}
							</button>
						)}
					</p>
				</div>
				<div className="flex">
					<DeliverableProgressBar
						percentageProgress={progress.progress}
						totalDeliverables={progress.total}
						className="w-full max-w-[300px]"
					/>
				</div>
			</div>
		</div>
	);
};
