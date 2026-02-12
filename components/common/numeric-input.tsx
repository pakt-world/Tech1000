/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { type ComponentProps, forwardRef } from "react";

type Props = ComponentProps<"input">;

export const NumericInput = forwardRef<HTMLInputElement, Props>(
	({ className, onChange, ...props }, forwardedRef) => {
		const handleInput = (
			event: React.ChangeEvent<HTMLInputElement>
		): void => {
			const numericValue = event.currentTarget.value.replace(
				/[^0-9]/g,
				""
			);
			// eslint-disable-next-line no-param-reassign
			event.currentTarget.value = numericValue;
			if (onChange) {
				onChange(event);
			}
		};
		return (
			<input
				type="text"
				ref={forwardedRef}
				className={className}
				onInput={handleInput}
				{...props}
			/>
		);
	}
);

NumericInput.displayName = "NumericInput";
