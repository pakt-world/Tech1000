"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;

type SelectTriggerRef = React.ElementRef<typeof SelectPrimitive.Trigger>;
type SelectTriggerProps = React.ComponentPropsWithoutRef<
	typeof SelectPrimitive.Trigger
>;

export const SelectTrigger = React.forwardRef<
	SelectTriggerRef,
	SelectTriggerProps & { className?: string; noChevron?: boolean }
>(({ className, children, noChevron, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			"border-input placeholder:text-muted-foreground flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
			className
		)}
		{...props}
	>
		{children}
		{!noChevron && (
			<SelectPrimitive.Icon asChild>
				<ChevronDown className="size-4 opacity-50" />
			</SelectPrimitive.Icon>
		)}
	</SelectPrimitive.Trigger>
));

SelectTrigger.displayName = "SelectTrigger";

type SelectContentRef = React.ElementRef<typeof SelectPrimitive.Content>;
type SelectContentProps = React.ComponentProps<typeof SelectPrimitive.Content>;

export const SelectContent = React.forwardRef<
	SelectContentRef,
	SelectContentProps & { className?: string }
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Content
		{...props}
		ref={ref}
		position="popper"
		className={cn(
			"relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
			className
		)}
	>
		<SelectPrimitive.Viewport
			className={cn(
				"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] p-1"
			)}
		>
			{children}
		</SelectPrimitive.Viewport>
	</SelectPrimitive.Content>
));

SelectContent.displayName = "SelectContent";

type SelectItemRef = React.ElementRef<typeof SelectPrimitive.Item>;
type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>;

export const SelectItem = React.forwardRef<
	SelectItemRef,
	SelectItemProps & { className?: string }
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	>
		<span className="absolute right-2 flex size-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="size-4" />
			</SelectPrimitive.ItemIndicator>
		</span>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;

type SelectLabelRef = React.ElementRef<typeof SelectPrimitive.Label>;
type SelectLabelProps = React.ComponentPropsWithoutRef<
	typeof SelectPrimitive.Label
>;

export const SelectGroupLabel = React.forwardRef<
	SelectLabelRef,
	SelectLabelProps & { className?: string }
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn("px-2 py-1.5 text-sm font-semibold", className)}
		{...props}
	/>
));

SelectGroupLabel.displayName = SelectPrimitive.Label.displayName;
