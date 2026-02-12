"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Bookmark } from "lucide-react";
import { type FC, useState } from "react";

import { CheckMark } from "@/components/common/icons";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useRemoveFromBookmark, useSaveToBookmark } from "@/lib/api/bookmark";

interface bookmarkType {
	id: string;
	size: number;
	type: string;
	isBookmarked?: boolean;
	bookmarkId: string;
	callback?: () => void;
	useCheck?: boolean;
}
export const RenderBookMark: FC<bookmarkType> = ({
	size = 20,
	isBookmarked,
	id,
	bookmarkId,
	type = "collection",
	callback,
	useCheck,
}) => {
	const [bookmarked, setBookmarked] = useState(isBookmarked);
	const addBookmark = useSaveToBookmark(callback);
	const removeBookmark = useRemoveFromBookmark(callback);

	const CallFuc = (): void => {
		if (bookmarked) {
			setBookmarked(false);
			removeBookmark.mutate(
				{ id: bookmarkId },
				{
					onSuccess: () => {
						setBookmarked(false);
						callback?.();
					},
				}
			);
			return;
		}
		setBookmarked(true);
		addBookmark.mutate(
			{ reference: id, type },
			{
				onSuccess: () => {
					setBookmarked(true);
					callback?.();
				},
			}
		);
	};

	if (useCheck) {
		return (
			<div
				className="flex-end flex min-w-fit text-white"
				onClick={(e) => {
					CallFuc();
					e.stopPropagation();
				}}
				role="button"
				tabIndex={0}
				onKeyPress={(event) => {
					event.stopPropagation();
					if (event.key === "Enter") {
						CallFuc();
					}
				}}
			>
				<CheckMark
					fill={bookmarked ? "#7DDE86" : undefined}
					className="cursor-pointer"
					size={24}
				/>{" "}
				<span className="ml-2">{bookmarked ? "Saved" : "Save"}</span>
			</div>
		);
	}

	return (
		<Bookmark
			fill={bookmarked ? "#7DDE86" : ""}
			className={`cursor-pointer ${bookmarked ? "text-green-500" : "text-white"}`}
			size={size}
			onClick={(e) => {
				CallFuc();
				e.stopPropagation();
			}}
		/>
	);
};
