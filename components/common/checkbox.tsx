"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
		className?: string;
	}
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			"focus-visible:ring-ring data-[state=checked]:text-primary-foreground peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn("flex items-center justify-center text-current")}
		>
			<CheckIcon className="size-4" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckBox = ({ isChecked }: { isChecked: boolean }): JSX.Element => {
	return isChecked ? (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
		>
			<rect x="1" y="1" width="22" height="22" rx="5" fill="#007C5B" />
			<path
				d="M8 13L10.9167 16L16 8"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<rect
				x="1"
				y="1"
				width="22"
				height="22"
				rx="5"
				stroke="#4CD571"
				strokeWidth="2"
			/>
		</svg>
	) : (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
		>
			<rect
				x="1"
				y="1"
				width="22"
				height="22"
				rx="5"
				fill="url(#paint0_linear_988_53583)"
			/>
			<rect
				x="1"
				y="1"
				width="22"
				height="22"
				rx="5"
				stroke="#DADADA"
				strokeWidth="2"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_988_53583"
					x1="12"
					y1="0"
					x2="12"
					y2="24"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#FCFCFC" />
					<stop offset="1" stopColor="#F8F8F8" />
				</linearGradient>
			</defs>
		</svg>
	);
};

export { CheckBox, Checkbox };
