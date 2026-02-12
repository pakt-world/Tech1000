/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import DeleteAccount from "../_shared/dropdowns/delete-account";

export const DeleteAccountMobile = (): JSX.Element => {
	return (
		<div className="relative size-full overflow-hidden bg-primary">
			<DeleteAccount />
		</div>
	);
};
