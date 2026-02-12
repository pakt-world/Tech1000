/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Check } from "lucide-react";

interface PasswordCriteriaProps {
	isValidated: boolean;
	criteria: string;
	isSignUp?: boolean;
}

export const PasswordCriteria = ({
	isValidated,
	criteria,
	isSignUp,
}: PasswordCriteriaProps): React.JSX.Element => {
	return (
		<div
			className={`flex flex-row items-center gap-4 ${
				isValidated
					? "text-success"
					: `${isSignUp ? "text-white" : "text-body"}`
			}`}
		>
			<Check size={15} />
			{criteria}
		</div>
	);
};
