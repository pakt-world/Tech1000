"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as RadixTabs from "@radix-ui/react-tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Pending } from "@/components/kyc";
import { kycIsPending } from "@/lib/actions";
import { CollectionCategory, Roles } from "@/lib/enums";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useUserState } from "@/lib/store/account";
import { determineRole, titleCase } from "@/lib/utils";

import { AcceptedBounties } from "./home/assigned";
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
			className="flex items-center justify-center rounded-lg px-2 py-2.5 text-sm text-white duration-200 hover:bg-[#3D3D3D] radix-state-active:bg-white radix-state-active:text-black"
		>
			{label}
		</RadixTabs.Trigger>
	);
}

export default function BountiesMobileView(): JSX.Element {
	const router = useRouter();
	const pathname = usePathname();

	const searchParams = useSearchParams();

	const accountData = useUserState();
	const isPartner = determineRole(accountData) === Roles.PARTNER;

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
			defaultValue={CollectionCategory.CREATED}
			onValueChange={handleTabChange}
			className="relative flex h-full w-full flex-col"
		>
			{kycIsPending(accountData) && <Pending />}

			<div className="top-[70px] z-40 flex h-[61px] w-full items-center justify-between gap-4 border-b border-[#FFFFFF1A] bg-[#0D0E0F] px-5 py-2 max-sm:fixed sm:h-max">
				<RadixTabs.List className="grid w-full grid-cols-2 gap-1 rounded-lg bg-[#FFFFFF1F] p-0.5">
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
