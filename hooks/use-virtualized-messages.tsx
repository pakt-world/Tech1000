"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useVirtualizer } from "@tanstack/react-virtual";
import type { ComponentType } from "react";
import { useEffect, useRef } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { formatDateHandler } from "@/lib/utils";
import type { CombinedMessageProps } from "@/providers/socket-types";

export interface DateMessage {
	category: "date";
	content: string; // The date string or formatted date content
	key: string;
}

export interface RegularMessage {
	category: "message";
	isTemporary: boolean; // Optional, true if the message is temporary
	key: string;
}

export type ExtendedRegularMessage = Partial<CombinedMessageProps> &
	Partial<RegularMessage>;

export type Message = DateMessage | ExtendedRegularMessage;

interface UseVirtualizedMessagesProps {
	messages: Message[]; // Array of messages to render
	Bubble: ComponentType<{ message: ExtendedRegularMessage }>; // Bubble component to render each message
}

export function RowVirtualizerDynamic({
	messages,
	Bubble,
}: UseVirtualizedMessagesProps) {
	const parentRef = useRef<HTMLDivElement>(null);

	// const [enabled, setEnabled] = useState(true);

	const count = messages.length;
	const virtualizer = useVirtualizer({
		count,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 45,
		overscan: 20,
		// enabled,
	});

	const items = virtualizer.getVirtualItems();

	// Invert the scroll direction
	useEffect(() => {
		const el = parentRef.current;
		if (!el) return;
		const invertedWheelScroll = (event: WheelEvent) => {
			el.scrollTop -= event.deltaY;
			event.preventDefault();
		};

		el.addEventListener("wheel", invertedWheelScroll, false);

		return () => el.removeEventListener("wheel", invertedWheelScroll);
	}, []);

	// virtualizer.scrollToIndex(0); === scroll to the top
	// virtualizer.scrollToIndex(count / 2); === scroll to the middle
	// virtualizer.scrollToIndex(count - 1); === scroll to the end
	// setEnabled((prev) => !prev); === toggle virtualizer {enabled ? "off" : "on"}

	return (
		<div
			ref={parentRef}
			style={{
				height: "100%",
				width: "100%",
				overflowY: "auto",
				// overflowAnchor: "none",
				transform: "scaleY(-1)",
				contain: "strict",
			}}
		>
			<div
				style={{
					height: virtualizer.getTotalSize(),
					width: "100%",
					position: "relative",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						transform: `translateY(${items[0]?.start ?? 0}px)`,
					}}
				>
					{items.map((virtualRow) => {
						const bubbleContent = messages[
							virtualRow.index
						] as ExtendedRegularMessage;
						return (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={virtualizer.measureElement}
								style={{
									transform: `scaleY(-1)`,
								}}
							>
								{messages[virtualRow.index]?.category ===
								"date" ? (
									<div className="chat-date">
										<h2>
											{formatDateHandler(
												bubbleContent?.content
											)}
										</h2>
									</div>
								) : bubbleContent ? (
									<Bubble message={bubbleContent} />
								) : (
									<p className="text-white">Loading...</p>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
