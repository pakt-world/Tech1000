"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ApplicantCard } from "./applicant-card";
import { PostCommentCard } from "./post-comment-card";
import { InviteCard } from "./invite-card";
import { FeedCardType } from "@/lib/types/feed";
import { useDismissFeed } from "@/lib/api/dashboard";
import { useQueryClient } from "@tanstack/react-query";
import { useRemoveFromBookmark } from "@/lib/api/bookmark";

type ViewType = "bookmarked" | "others" | "post_comments";
interface CardType {
	props: FeedCardType;
	viewType: ViewType;
	callback?: () => void;
}
export const FeedCard = ({
	props,
	viewType,
	callback,
}: CardType): JSX.Element => {
	const { type } = props;
	const applicantTypes = ["application_accepted", "application_rejected"];
	const postCommentTypes = ["post", "comment"];
	const inviteFeedTypes = [
		"application_joined",
		"group_invite",
		"application",
	];
	const queryClient = useQueryClient();
	const { mutate: dismissFeed, isLoading: isDismissLoading } =
		useDismissFeed();
	const removeBookmark = useRemoveFromBookmark();

	const dismissByID = (id: string): void => {
		if (!!props?.bookmarkId) {
			removeBookmark.mutate(
				{ id: props?.bookmarkId },
				{
					onSuccess: () => {
						queryClient.invalidateQueries(["get-user-feed", 1, 10]);
						callback?.();
					},
				}
			);
		} else {
			dismissFeed(id, {
				onSuccess: () => {
					queryClient.invalidateQueries(["get-user-feed", 1, 10]);
					callback?.();
				},
			});
		}
	};

	if (props?.isDismissed) return <></>;
	if (applicantTypes.includes(type)) {
		return (
			<ApplicantCard
				{...props}
				dismissByID={dismissByID}
				viewType={viewType}
				callback={callback}
				isDismissLoading={isDismissLoading}
			/>
		);
	}
	if (postCommentTypes.includes(type)) {
		// if (type === "comment") return <div></div>;
		return (
			<PostCommentCard
				{...props}
				dismissByID={dismissByID}
				viewType={viewType}
				callback={callback}
				isDismissLoading={isDismissLoading}
			/>
		);
	}
	if (inviteFeedTypes.includes(type)) {
		return (
			<InviteCard
				{...props}
				dismissByID={dismissByID}
				viewType={viewType}
				callback={callback}
				isDismissLoading={isDismissLoading}
			/>
		);
	}
	return (
		<ApplicantCard
			{...props}
			dismissByID={dismissByID}
			viewType={viewType}
			callback={callback}
			isDismissLoading={isDismissLoading}
		/>
	);
};
