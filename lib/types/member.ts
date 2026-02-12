import {
	type AchievementType,
	type Bucket,
	type Roles,
	type SocketStatus,
} from "../enums";

// ===
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
// ===
interface Profile {
	contact: Contact;
	bio: Bio;
	talent: Talent;
}
// ===
interface Socket {
	id: string;
	status: SocketStatus;
}
// ===
interface ProfileImage {
	_id: string;
	name: string;
	type: string;
	size: string;
	url: string;
	bucket?: Bucket;
}
// ===
export interface AchievementProps {
	_id: string;
	owner: string;
	type: AchievementType;
	total: string;
	value: string;
	createdAt: string; // Date type
	updatedAt: string; // Date type
	__v: number;
}

export interface EmptyAchievementProps {
	id: AchievementType;
	title: string;
	total: string;
	textColor: string;
	bgColor: string;
}

// ===
interface ProfileLinks {
	website: string;
	x: string;
	tiktok: string;
	instagram: string;
	github: string;
}

interface Meta {
	profileLinks: ProfileLinks;
}

export interface MemberProps {
	_id: string;
	firstName: string;
	lastName: string;
	type: Roles;
	role: Roles;
	profile: Profile;
	isPrivate: boolean;
	score: number;
	profileCompleteness: number;
	socket: Socket;
	profileImage: ProfileImage;
	meta: Meta;
	// Properties below are not useful in bounties
	achievements: GroupAchievemtProps;
	createdAt: Date;
	updatedAt: Date;
	isBookmarked: boolean;
	bookmarkId: string;
	isMember?: boolean;
	nftImageUrl?: string;
	nftTokenNumber?: string;
}

export interface GroupAchievemtProps {
	comments: number;
	posts: number;
	upvotes: number;
}
