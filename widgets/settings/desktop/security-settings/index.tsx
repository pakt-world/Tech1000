"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChangePasswordForm } from "./change-password";
import { TwoFactorAuthentication } from "./two-factor-authentication";

export const SecurityView = (): ReactElement => {
	return (
		<div className="relative flex h-full grow flex-row gap-4 overflow-auto pb-4 2xl:gap-6">
			<ChangePasswordForm />
			<TwoFactorAuthentication />
		</div>
	);
};
