/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { PartnerOpenBountyCtas, type PartnerOpenBountyCtasProps } from "./open";
import {
	PartnerPrivateBountyCtas,
	type PartnerPrivateBountyCtasProps,
} from "./private";

export const CTAS: {
	open: FC<PartnerOpenBountyCtasProps>;
	private: FC<PartnerPrivateBountyCtasProps>;
} = {
	open: PartnerOpenBountyCtas,
	private: PartnerPrivateBountyCtas,
};
