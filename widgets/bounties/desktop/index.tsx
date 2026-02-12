"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as RadixTabs from "@radix-ui/react-tabs";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Pending } from "@/components/kyc";
import { ENVS } from "@/config";
import { kycIsPending } from "@/lib/actions";
import { CollectionCategory, KycVerificationStatus, Roles } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { useKyc } from "@/lib/store/kyc";
import { determineRole, titleCase } from "@/lib/utils";

import { AcceptedBounties } from "./home/accepted";
import { CreatedBounties } from "./home/created";
import { OpenBounties } from "./home/open";

interface TabTriggerProps {
	value: string;
	label: string;
}

function TabTrigger({ label, value }: TabTriggerProps): React.JSX.Element {
	return (
		<RadixTabs.Trigger
			value={value}
			className="flex items-center justify-center rounded-lg px-6 py-1 duration-200 hover:bg-[#3D3D3D] radix-state-active:bg-[#3D3D3D] radix-state-active:text-white"
		>
			{label}
		</RadixTabs.Trigger>
	);
}

export default function BountiesDesktopView(): JSX.Element {
	const router = useRouter();
	const pathname = usePathname();

	const searchParams = useSearchParams();

	const accountData = useUserState();
	const isPartner = determineRole(accountData) === Roles.PARTNER;

	const { setOpenKycModal } = useKyc();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);
			return params.toString();
		},
		[searchParams]
	);

	const urlTab = searchParams.get("bounties-type") as CollectionCategory;
	const [activeTab, setActiveTab] = useState<CollectionCategory>(
		(urlTab ?? isPartner)
			? CollectionCategory.CREATED
			: CollectionCategory.OPEN
	);

	const handleTabChange = (value: CollectionCategory): void => {
		setActiveTab(value);
		router.push(`${pathname}?${createQueryString("bounties-type", value)}`);
	};

	useEffect(() => {
		if (urlTab != null) {
			setActiveTab(urlTab);
		}
	}, [urlTab]);

	return (
		<RadixTabs.Root
			value={activeTab}
			defaultValue="created"
			onValueChange={handleTabChange}
			className="flex h-full w-full flex-col gap-4 overflow-auto"
		>
			{kycIsPending(accountData) && <Pending />}
			<div className="flex w-full items-center justify-between gap-4">
				<RadixTabs.List className="grid grid-cols-2 gap-1 rounded-lg bg-[#7676801F] p-0.5 text-base text-[#9096A2]">
					{!isPartner && (
						<TabTrigger
							value={CollectionCategory.OPEN}
							label={titleCase(CollectionCategory.OPEN)}
						/>
					)}
					{isPartner && (
						<TabTrigger
							value={CollectionCategory.CREATED}
							label={titleCase(CollectionCategory.CREATED)}
						/>
					)}
					{!isPartner && (
						<TabTrigger
							value={CollectionCategory.ASSIGNED}
							label={titleCase(CollectionCategory.ASSIGNED)}
						/>
					)}
					{isPartner && (
						<TabTrigger
							value={CollectionCategory.OPEN}
							label={titleCase(CollectionCategory.OPEN)}
						/>
					)}
				</RadixTabs.List>

				{isPartner &&
					accountData.kycStatus !== KycVerificationStatus.REVIEW &&
					accountData.kycStatus !==
						KycVerificationStatus.SUBMITTED && (
						<Button
							variant="white"
							onClick={() => {
								if (!ENVS.isProduction || accountData.kyc) {
									router.push("/bounties/create");
								} else if (
									accountData.kycStatus !==
									KycVerificationStatus.APPROVED
								) {
									setOpenKycModal(true);
								}
							}}
						>
							<div className="flex items-center gap-2">
								<Plus size={20} />
								<span>Create Bounty</span>
							</div>
						</Button>
					)}
			</div>

			{isPartner ? (
				<RadixTabs.Content value={CollectionCategory.CREATED}>
					<CreatedBounties />
				</RadixTabs.Content>
			) : (
				<RadixTabs.Content value={CollectionCategory.ASSIGNED}>
					<AcceptedBounties />
				</RadixTabs.Content>
			)}
			<RadixTabs.Content value={CollectionCategory.OPEN}>
				<OpenBounties />
			</RadixTabs.Content>
		</RadixTabs.Root>
	);
}
