"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Input } from "pakt-ui";
import { useState } from "react";

export const NumericInput = ({
	value,
	onChange,
	placeholder,
	className,
	noLabel,
}: {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	noLabel?: boolean;
}): React.JSX.Element => {
	const [inputValue, setInputValue] = useState(value);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value: v } = e.target;

		if (v.match(/^[0-9]*[.,]?[0-9]*$/)) {
			setInputValue(v);
			onChange(v);
		}
	};

	return (
		<Input
			type="text"
			label={!noLabel ? "Amount" : ""}
			autoCorrect="off"
			autoComplete="off"
			spellCheck="false"
			value={inputValue}
			onChange={handleChange}
			className={`input-style !text-white placeholder:opacity-30 ${className}`}
			placeholder={placeholder}
		/>
	);
};
