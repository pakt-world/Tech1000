import React, { forwardRef, FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import {
	Input as PaktInput,
	PasswordInput as PaktPasswordInput,
} from "pakt-ui";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	htmlFor?: string;
	register?: UseFormRegisterReturn;
	wrapper?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
	({ label, htmlFor, register, className, wrapper, ...props }) => {
		return (
			<div
				className={`flex flex-col ${label ? "gap-2 md:gap-3" : ""} ${wrapper}`}
			>
				{label && (
					<label htmlFor={htmlFor} className="text-md text-white">
						{label}
					</label>
				)}

				<PaktInput
					{...(register ? register : {})}
					className={` border !border-neutral-600 border-opacity-30 !bg-[#FCFCFD1A] !text-base !text-white placeholder:capitalize placeholder:!text-[#72777A] ${className}`}
					{...props}
				/>
			</div>
		);
	}
);

CustomInput.displayName = "CustomInput";
interface CustomPasswordInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	htmlFor?: string;
	register?: UseFormRegisterReturn;
}

export const CustomPasswordInput: FC<CustomPasswordInputProps> = ({
	label,
	htmlFor,
	register,
	className,
	...props
}) => {
	return (
		<div className={`flex flex-col ${label ? "gap-3" : ""}`}>
			{label && (
				<label htmlFor={htmlFor} className="text-md text-white">
					{label}
				</label>
			)}

			<PaktPasswordInput
				{...(register ? register : {})}
				className={`border !border-neutral-600 border-opacity-30 !bg-[#FCFCFD1A] !text-base !text-white placeholder:capitalize placeholder:!text-[#72777A] ${className}`}
				{...props}
			/>
		</div>
	);
};
