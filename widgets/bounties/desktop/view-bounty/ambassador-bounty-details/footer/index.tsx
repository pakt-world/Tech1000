/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentOpenBountyCtas, type TalentOpenBountyCtasProps } from "./open";
import {
	TalentPrivateBountyCtas,
	type TalentPrivateBountyCtasProps,
} from "./private";

export const CTAS: {
	open: React.FC<TalentOpenBountyCtasProps>;
	private: React.FC<TalentPrivateBountyCtasProps>;
} = {
	open: TalentOpenBountyCtas,
	private: TalentPrivateBountyCtas,
};
