"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex !h-auto items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:!cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
	{
		variants: {
			variant: {
				default:
					"bg-lemon-green text-black hover:bg-opacity-60 dark:bg-bg-lemon-gree dark:text-ink-darkest dark:hover:bg-opacity-60 rounded-3xl text-lg",
				destructive: "bg-red-100 text-red-500",
				outline:
					"border-2 border-lemon-green text-white hover:text-white dark:border-lemon-green dark:hover:text-white",
				secondary:
					"bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
				ghost: "hover:!bg-transparent hover:!text-slate-50",
				link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
				white: "bg-white text-slate-900 hover:border hover:bg-opacity-60 hover:text-white",
			},
			size: {
				default: "h-10 px-5 py-3",
				xs: "h-6 px-2.5 py-1.5",
				sm: "h-9 rounded-[10px] px-4 py-2",
				md: "h-10 rounded-[10px] px-5 py-3",
				lg: "h-11 rounded-md px-8 py-2.5",
				icon: "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			fullWidth = false,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={`${cn(buttonVariants({ variant, size, className }))} ${fullWidth && "w-full"}`}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
