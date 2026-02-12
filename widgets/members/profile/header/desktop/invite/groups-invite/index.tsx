"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { DesktopSheetWrapper } from "@/widgets/bounties/desktop/sheets/wrapper";

import InvitesGroupPage from "./misc/invite-member";

interface Props {
	isOpen: boolean;
	talentId: string;
	setIsOpen: (isOpen: boolean) => void;
}

export const InviteMemberToGroup4Desktop = ({
	isOpen,
	setIsOpen,
	talentId,
}: Props): ReactElement | null => {
	return (
		<DesktopSheetWrapper
			isOpen={isOpen}
			onOpenChange={() => {
				setIsOpen(false);
			}}
			className="!bg-transparent"
		>
			<InvitesGroupPage
				talentId={talentId}
				onOpenChange={() => {
					setIsOpen(false);
				}}
			/>
		</DesktopSheetWrapper>
	);
};
