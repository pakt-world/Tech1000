"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "@/lib/utils";

import { toast } from "./toaster";

interface Props {
	className?: string;
	color?: string;
}

export const PageLoading = ({ className, color }: Props): React.JSX.Element => {
	useEffect(() => {
		async function getLoader(): Promise<void> {
			try {
				const { spiral } = await import("ldrs");
				spiral.register();
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error fetching exchange rates";
				toast.error(errorMessage);
			}
		}
		getLoader();
	}, []);
	return (
		<div
			aria-live="polite"
			aria-busy
			className={cn(
				"flex h-screen w-full items-center justify-center",
				className
			)}
		>
			<l-zoomies
				size="80"
				stroke="5"
				bg-opacity="0.1"
				speed="1.4"
				// color="#FF99A2"
				color={color ?? "#ffffff"}
			/>
		</div>
	);
};
