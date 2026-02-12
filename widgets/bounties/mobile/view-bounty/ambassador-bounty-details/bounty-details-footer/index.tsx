/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import {
	AmbassadorOpenBountyCtas,
	type AmbassadorOpenBountyCtasProps,
} from "./open";
import {
	AmbassadorPrivateBountyCtas,
	type AmbassadorPrivateBountyCtasProps,
} from "./private";

export const CTAS: {
	open: FC<AmbassadorOpenBountyCtasProps>;
	private: FC<AmbassadorPrivateBountyCtasProps>;
} = {
	open: AmbassadorOpenBountyCtas,
	private: AmbassadorPrivateBountyCtas,
};
