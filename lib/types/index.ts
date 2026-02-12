import { type AccountProps } from "./account";
import { type CollectionProps } from "./collection";
import { FeedCardType } from "./feed";

export interface Review {
	_id: string;
	data: CollectionProps;
	owner: AccountProps;
	rating: number;
	receiver: AccountProps;
	review: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface DataFeedResponse {
	closed: boolean;
	createdAt?: string;
	updatedAt?: string;
	creator: AccountProps;
	data: CollectionProps;
	description: string;
	isBookmarked?: boolean;
	bookmarkId?: string;
	isPublic?: boolean;
	owner: AccountProps;
	owners?: AccountProps[];
	title: string;
	type: string;
	meta?: {
		value: number;
		isMarked: boolean;
		rating: number;
	};
	_id: string;
}

export interface Bookmark {
	_id: string;
	type: string;
	owner?: AccountProps;
	data: CollectionProps;
	feed: DataFeedResponse;
}

export interface GroupsBookmark {
	bookmarkId: string;
	bookmarkType: string;
	createdAt: string;
	data: FeedCardType;
	UserProfile: AccountProps;
}

// Referrals

interface ReferedUserProps {
	_id: string;
	firstName: string;
	lastName: string;
	type: "recipient";
	profile: AccountProps;
	isPrivate: boolean;
	score: number;
	profileCompleteness: number;
	profileImage: ProfileImage;
}

interface UserContact {
	state: string;
	city: string;
	country: string;
}

interface UserBio {
	title: string;
	description: string;
}

interface UserTalent {
	tags: string[];
	tagsIds: string[];
}

interface ReferredUserProfileProps {
	contact: UserContact;
	bio: UserBio;
	talent: UserTalent;
}

interface ProfileImage {
	_id: string;
	name: string;
	type: string;
	size: string;
	url: string;
}

interface Referral {
	_id: string;
	firstName: string;
	lastName: string;
	type: "recipient";
	profile: ReferredUserProfileProps;
	isPrivate: boolean;
	score: number;
	profileCompleteness: number;
	profileImage: ProfileImage;
}

export interface ReferredUser {
	_id: string;
	referralId: string;
	userId: ReferedUserProps;
	referral: Referral;
	completedGig: boolean;
	status: boolean;
	createdAt: string;
	updatedAt: string;
}

//groups
export interface ImageData {
	name: string;
	uploaded_by: string;
	type: string;
	size: string;
	bucket: string;
	url: string;
	status: boolean;
	deletedAt: null | Date;
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

//nft
export interface NFTAttribute {
	trait_type: string;
	value: string;
}

export interface NFTMetadata {
	name: string;
	description: string;
	image: string;
	attributes: NFTAttribute[];
	tokenId: string;
}
