/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import ReactOtpInput from "react-otp-input";

interface OtpInputProps {
	value: string;
	numInputs: number;
	onChange: (otp: string) => void;
}

export const OtpInput: FC<OtpInputProps> = ({
	numInputs,
	onChange,
	value,
	...props
}) => {
	return (
		<ReactOtpInput
			numInputs={numInputs}
			onChange={onChange}
			value={value}
			containerStyle="gap-4 flex"
			inputStyle="otp_style"
			renderInput={(inputProps) => {
				return (
					<input
						{...inputProps}
						className="input-style otp_style text-center text-base text-white outline-none"
						style={{
							borderRadius: "10px",
						}}
					/>
				);
			}}
			{...props}
		/>
	);
};

OtpInput.displayName = "OtpInput";
