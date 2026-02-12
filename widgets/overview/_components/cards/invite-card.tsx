"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tag } from "@/lib/types/groups";
import { FeedData } from "@/lib/types/feed";
import { useMediaQuery } from "usehooks-ts";
import { InviteCard4Desktop } from "./desktop/invite-card-4-desktop";
import { InviteCard4Mobile } from "./mobile/invite-card-4-mobile";

interface InviteCardType {
	feedId: string;
	type:
		| "group_invite"
		| "application_accepted"
		| "application_rejected"
		| "post"
		| "comment"
		| "application"
		| "application_joined"
		| "group_invite";
	title: string;
	description?: string;
	groupId?: string;
	data?: FeedData;
	isBookmarked?: boolean;
	bookmarkId?: string;
	score?: number;
	tags?: Tag[];
	dismissByID: (id: string) => void;
	viewType: "bookmarked" | "others" | "post_comments";
	applicationId?: string;
	callback?: () => void;
	isDismissLoading?: boolean;
}

export const InviteCard = (props: InviteCardType): JSX.Element => {
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	return isDesktop ? (
		<InviteCard4Desktop {...props} />
	) : (
		<InviteCard4Mobile {...props} />
	);
};
