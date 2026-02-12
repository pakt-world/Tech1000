import { type KycVerificationStatus, type Roles } from "../enums";
import { GroupAchievemtProps } from "./member";

interface ProfileImageProps {
	name?: string;
	bucket?: string;
	size?: string;
	type?: string;
	url?: string;
	_id?: string;
}

interface ContactProps {
	city?: string;
	state?: string;
	phone?: string;
	address?: string;
	country?: string;
}

interface MemberProps {
	availability?: string;
	tags?: string[];
	tagsIds?: Array<{ name: string; color: string }>;
	about?: string;
}
interface ProfileProps {
	contact?: ContactProps;
	bio?: {
		title: string;
		description: string;
	};
	talent: MemberProps;
}

interface MetaProps {
	profileLinks?: {
		website?: string;
		x?: string;
		tiktok?: string;
		instagram?: string;
		github?: string;
	};
	onboarded?: boolean;
	imageUrl: string;
	pointScore: number;
	walletAddress?: string;
	tokenId?: string;
}

export interface AccountProps {
	_id: string;
	firstName?: string;
	lastName?: string;
	role: Roles;
	type?: Roles;
	profile?: ProfileProps;
	score?: number;
	profileCompleteness?: number;
	email?: string | undefined;
	profileImage?: ProfileImageProps;
	twoFa?: {
		status?: boolean;
		type?: string;
	};
	achievements?: GroupAchievemtProps;
	// VerifyEmailResponse
	token?: string;
	expiresIn?: number;
	kyc?: boolean;
	kycStatus?: KycVerificationStatus;
	isVerified?: boolean;
	timeZone?: string;
	meta?: MetaProps;
	isPrivate?: boolean;
	nftTokenNumber?: string;
}
