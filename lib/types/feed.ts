import { AttachmentsType, Creator, GroupAdmin, Tag } from "./groups";

export interface FeedData {
	attachments: AttachmentsType[];
	commentCount: number;
	createdAt: string;
	creator?: Creator;
	postId: string;
	title: string;
	upvotes: number;
	image: string;
	parentId?: string;
	commentId?: string;
	groupId?: string;
	inviteId?: string;
	applicationId?: string;
	tags?: Tag[];
	applicant?: Record<string, string>;
	founder?: Creator;
	name?: string;
}

export interface FeedCardType {
	applicationId?: string;
	bookmarkId?: string;
	commentId?: string;
	createdAt: string;
	data?: FeedData;
	description?: string;
	feedId: string;
	groupAdmin?: GroupAdmin;
	groupId?: string;
	inviteId?: string;
	isBookmarked?: boolean;
	isDismissed?: boolean;
	postId: string;
	title: string;
	type:
		| "group_invite"
		| "application_accepted"
		| "application_rejected"
		| "post"
		| "comment";
}
