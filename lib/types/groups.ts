/* -------------------------------------------------------------------------- */
/*                             Profile Types                                  */
/* -------------------------------------------------------------------------- */

import { Roles } from "../enums";

export interface TalentProfile {
	tags: string[];
	tagsIds: string[];
	availability: "available" | "unavailable";
}

export interface CreatorProfile {
	_id: string;
	firstName: string;
	lastName: string;
	role: "user" | "admin";
	type: "recipient" | "donor";
	profile: {
		talent: TalentProfile;
		verified: boolean;
	};
	isPrivate: boolean;
	score: number;
	profileCompleteness: number;
	socket: {
		status: "ONLINE" | "OFFLINE";
	};
}

/* -------------------------------------------------------------------------- */
/*                             Collection Types                               */
/* -------------------------------------------------------------------------- */

export interface Collection {
	_id: string;
	creator: CreatorProfile;
	name: string;
	category: string;
	description: string;
	equity: string;
	parent: string;
	collections: Collection[];
	type: string;
	owners: string[];
	invites: string[];
	attachments: any[];
	attachmentData: any[];
	tagsData: string[];
	tags: string[];
	status: string;
	inviteAccepted: boolean;
	payoutStatus: string;
	feePayoutStatus: string;
	paktFeePayoutStatus: string;
	isPrivate: boolean;
	ratings: any[];
	recipientCompletedJob: boolean;
	score: number;
	progress: number;
	isDeleted: boolean;
	payoutTransactions: any[];
	failedPayoutCount: number;
	failedFeePayoutCount: number;
	failedPaktFeePayoutCount: number;
	meta: {
		invite: string;
	};
	isParentFunded: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

/* -------------------------------------------------------------------------- */
/*                             Tag Types                                      */
/* -------------------------------------------------------------------------- */

export interface Tag {
	_id: string;
	name: string;
	key: string;
	color: string;
	type?: string;
	categories?: any[];
	isParent?: boolean;
	createdAt?: string;
	updatedAt?: string;
	__v?: number;
	entryCount?: number;
}

/* -------------------------------------------------------------------------- */
/*                             Group Types                                    */
/* -------------------------------------------------------------------------- */

interface Contact {
	state: string;
	city: string;
	country: string;
}
// ===
interface Bio {
	title: Roles;
	description: string;
}
// ===
interface TagsID {
	_id: string;
	name: string;
	categories: unknown[];
	isParent: boolean;
	type: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	entryCount: number;
	key?: string;
	color?: string;
}

interface Talent {
	tags: string[];
	tagsIds: TagsID[];
}
export interface MemberMeta {
	invite: string;
	userId: string;
	isAdmin?: boolean;
}

export interface MemberProfile {
	verified?: boolean;
	bio?: Bio;
	contact?: Contact;
	talent?: Talent;
	profileImage?: string;
}

export interface Member {
	_id: string;
	groupId: string;
	status: string;
	firstName: string;
	lastName: string;
	memberProfile: MemberProfile;
	memberScore: number;
	memberId: string;
	meta: MemberMeta;
	type: string;
	profileImage?: string;
	achievements?: {
		nftTokenNumber: string;
		nftImageUrl: string;
	};
	nftTokenNumber: string;
	nftImageUrl: string;
}

export interface Group {
	admins: Member[];
	_id: string;
	members: Member[];
	tags: Tag[];
	name: string;
	description: string;
	createdAt: string;
	type: string;
	image: string;
	memberCount: number;
	founder: Member;
	groupType: string;
	score: number;
}

export interface GroupAdmin {
	_id: string;
	status: "ongoing" | "inactive";
	firstName: string;
	lastName: string;
	memberProfile: MemberProfile;
	memberScore: number;
	memberId: string;
	userId: string;
	meta: MemberMeta;
	type: "admin" | "member";
}

/* -------------------------------------------------------------------------- */
/*                             Invited Members                                */
/* -------------------------------------------------------------------------- */

export interface AdminUserInfo {
	profile: MemberProfile;
	score: number;
	_id: string;
	firstName: string;
	lastName: string;
	image?: string;
}

export interface UserInvitedInfo {
	profile: MemberProfile;
	score: number;
	_id: string;
	firstName: string;
	lastName: string;
	image?: string;
	nftTokenNumber?: string;
	tags?: Tag[];
}

export interface Invite {
	inviteId: string;
	adminUserInfo: AdminUserInfo;
	userInvitedInfo: UserInvitedInfo;
	memberId: string;
	groupName: string;
	groupId: string;
	status: string;
	achievements?: {
		nftTokenNumber?: string;
	};
}

export interface Applicant {
	firstName: string;
	lastName: string;
	imageUrl: string;
	_id: string;
	profile: MemberProfile;
	score: number;
	nftTokenNumber: string;
}

export interface Application {
	applicationId: string;
	groupId: string;
	groupName: string;
	status: string;
	type: string;
	meta: MemberMeta;
	applicant: Applicant;
}

/* -------------------------------------------------------------------------- */
/*                             Post Types                                    */
/* -------------------------------------------------------------------------- */

export interface Creator {
	score?: number;
	_id: string;
	firstName?: string;
	lastName?: string;
	title: string;
	bio?: string;
	tags?: Tag[];
	image?: string;
	nftTokenNumber: string;
	nftImageUrl: string;
}

type PostType = "comment" | "type" | "post";

export interface Comment {
	commentId: string;
	content: string;
	attachments?: AttachmentsType[];
	commentCount: number;
	upvotes: number;
	creator: Creator;
	comment?: string;
	createdAt?: string;
	groupId?: string;
	parentId?: string;
	type?: PostType;
	title?: string;
	hasUpvoted?: boolean;
}

export interface GroupPost {
	postId: string;
	title: string;
	content: string;
	attachments: AttachmentsType[];
	upvotes: number;
	comments?: Comment[];
	createdAt: string;
	creator: Creator;
	commentCount: number;
	hasUpvoted?: boolean;
	score: number;
}

export interface PostUser {
	score: number;
	_id: string;
	firstName: string;
	lastName: string;
	title: string;
	bio: string;
	tags: Tag[];
	image: string;
}

export interface PostTag {
	_id: string;
	name: string;
	color: string;
	categories: string[];
	isParent: boolean;
	type: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export type AttachmentType = "image" | "video" | "file";

export interface Attachment {
	type: AttachmentType;
	fileName?: string;
	storageUrl: string;
	_id: string;
}

export interface AttachmentsType {
	mimeType: string;
	url: string;
	_id: string;
	name: string;
}

export interface CommentTrailType {
	content: string;
	attachments: AttachmentsType[];
	type: string;
	commentId: string;
	parentId: string;
	createdAt: string;
	groupId: string;
	upvotes: number;
	creator: Creator;
	commentCount: number;
	comments: Comment[];
	trails: Comment[];
	hasUpvoted?: boolean;
}

export interface BreadcrumbItem {
	label: string;
	action: () => void;
	isActive: boolean;
	text?: string;
}
