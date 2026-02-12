/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { ClientOpenBountyCtas, type ClientOpenBountyCtasProps } from "./open";
import {
	ClientPrivateBountyCtas,
	type ClientPrivateBountyCtasProps,
} from "./private";

export const CTAS: {
	open: React.FC<ClientOpenBountyCtasProps>;
	private: React.FC<ClientPrivateBountyCtasProps>;
} = {
	open: ClientOpenBountyCtas,
	private: ClientPrivateBountyCtas,
};
