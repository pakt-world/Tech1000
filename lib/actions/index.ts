/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import type {
	CombinedConversationResponseProps,
	CombinedMessageProps,
	RecipientResponseProps,
} from "@/providers/socket-types";

import {
	type BountyInvitesDataProps,
	type BountyInvitesProps,
} from "../api/invites";
import {
	AchievementType,
	CollectionInviteStatus,
	CollectionStatus,
	CollectionTypes,
	KycVerificationStatus,
	PayoutStatus,
	Roles,
	SortApplicationsScoresBy,
} from "../enums";
import { emptyAchievementStyle } from "../constants";
import { type Review } from "../types";
import { type AccountProps } from "../types/account";
import { type CollectionProps } from "../types/collection";
import {
	type GroupAchievemtProps,
	type EmptyAchievementProps,
	type MemberProps,
} from "../types/member";
import {
	determineRole,
	formatDateHandler,
	getRandomReadableBgColor,
} from "../utils";

export const isBountyDeliverable = (
	collection: CollectionProps
): collection is CollectionProps => {
	return collection.type === CollectionTypes.DELIVERABLE;
};

export const isBountyApplicant = (
	collection: CollectionProps
): collection is CollectionProps => {
	return collection.type === CollectionTypes.APPLICATION;
};

export const isBountyCancellation = (
	collection: CollectionProps
): collection is CollectionProps => {
	return collection.type === CollectionTypes.CANCELLATION;
};

export const isReviewChangeRequest = (
	collection: CollectionProps
): collection is CollectionProps => {
	return collection.type === CollectionTypes.REVIEW_CHANGE_REQUEST;
};

export const isBountySlot = (
	collection: CollectionProps
): collection is CollectionProps => {
	return collection.type === CollectionTypes.SLOT;
};

export const getAchievementData = (
	type: AchievementType
): EmptyAchievementProps | undefined => {
	return emptyAchievementStyle.find(({ id }) => id === type);
};

export const hasFiveStarReview = (reviews: Review[]): boolean => {
	const hasFiveStar = reviews.filter((r) => r.rating === 5);
	return hasFiveStar.length > 0;
};

export const slotInfo = (
	b: CollectionProps
): {
	acceptedSlot: number;
	totalSlot: number;
} => {
	const acceptedSlot =
		b?.collections
			?.filter(isBountySlot)
			?.filter(
				(slot) =>
					slot.invite?.status === CollectionInviteStatus.ACCEPTED ||
					slot.status === CollectionStatus.COMPLETED ||
					slot.status === CollectionStatus.ONGOING
			).length ?? 0;
	return {
		acceptedSlot,
		totalSlot: b?.meta?.slotCount,
	};
};

export const isBountyPaid = (bounty: CollectionProps[]): CollectionProps[] => {
	return bounty.filter((b: CollectionProps) => b.escrowPaid);
};

export const partnerOpenBounties = (
	bounty: CollectionProps[],
	id: string
): CollectionProps[] => {
	const partnerId = id;
	const notFundedBounties = bounty.filter(
		(b: CollectionProps) => b.escrowPaid && b.creator?._id === partnerId
	);
	return notFundedBounties;
};

export const isBountyUnfunded = (
	bounty: CollectionProps[],
	user: AccountProps
): CollectionProps[] => {
	const loggedInUserId = user?._id;
	const notFundedBounties = bounty.filter(
		(b: CollectionProps) =>
			!b.escrowPaid && b.creator?._id === loggedInUserId
	);
	return notFundedBounties;
};

export const isSlotFilled = (bounty: CollectionProps): boolean => {
	const invitedSlots = bounty.collections.filter(isBountySlot);
	const acceptedSlotCount = invitedSlots.filter(
		(slot) => slot.invite?.status === CollectionInviteStatus.ACCEPTED
	).length;
	return acceptedSlotCount >= bounty.meta?.slotCount;
};

export const bountiesWithAvailableSlots = (
	bounties: CollectionProps[]
): CollectionProps[] => {
	return bounties.filter((b) => !isSlotFilled(b));
};

// Remove those without coin in meta
export const bountiesWithCoin = (
	bounties: CollectionProps[]
): CollectionProps[] => {
	return bounties.filter((b) => b.meta?.coin);
};

export const acceptedSlots = (bounty: CollectionProps): CollectionProps[] => {
	const bountySlots = bounty.collections.filter(isBountySlot);
	return bountySlots.filter(
		(slot) => slot.invite?.status === CollectionInviteStatus.ACCEPTED
	);
};

export const loggedInTalentAcceptedSlot = (
	bounty: CollectionProps,
	userId: string
): boolean => {
	const loggedInUserId = userId;
	const bountySlots = bounty.collections.filter(isBountySlot);
	return bountySlots.some(
		(slot) =>
			slot.invite?.receiver?._id === loggedInUserId &&
			slot.invite?.status === CollectionInviteStatus.ACCEPTED
	);
};

export const talentInvitedToBountySlot = (
	bounty: CollectionProps,
	userId: string
): boolean => {
	const loggedInUserId = userId;
	const bountySlots = bounty.collections.filter(isBountySlot);
	return bountySlots.some(
		(slot) => slot.invite?.receiver?._id === loggedInUserId
	);
};

export const talentInvitePending = (
	bounty: CollectionProps,
	userId: string
): boolean => {
	const loggedInUserId = userId;
	const bountySlots = bounty.collections.filter(isBountySlot);
	return (
		bountySlots.filter(
			(slot) => slot.invite?.receiver?._id === loggedInUserId
		)?.[0]?.status === CollectionStatus.PENDING
	);
};

export const talentAlreadyApplied = (
	bounty: CollectionProps,
	userId: string
): boolean => {
	const loggedInUserId = userId;
	const bountyApplicants = bounty.collections.filter(isBountyApplicant);
	return bountyApplicants.some(
		(applicant) => applicant.creator?._id === loggedInUserId
	);
};

export const sortLatestFirst = (
	bounties: CollectionProps[]
): CollectionProps[] => {
	return bounties.sort(
		(a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);
};

export const sortLatestFirst2 = (
	bounties: CollectionProps[]
): CollectionProps[] => {
	return bounties.sort((a, b) => {
		const aLatestUpdate = Math.max(
			...a.collections.map((item) => new Date(item.updatedAt).getTime())
		);
		const bLatestUpdate = Math.max(
			...b.collections.map((item) => new Date(item.updatedAt).getTime())
		);
		return bLatestUpdate - aLatestUpdate;
	});
};

export const removeDuplicatesFromArray = <T>(arr: T[]): T[] => {
	return [...new Set(arr)];
};

// Getting a bounty by it's name

export const getBountyByName = (
	bounties: CollectionProps[],
	name: string
): CollectionProps | undefined => {
	return bounties.find((b) => b.name === name);
};

// ============== Messaging ============== //

export const getSender = (
	loggedInUser: string,
	recipients: RecipientResponseProps[] = [],
	noError: boolean = true
): RecipientResponseProps => {
	const sender = recipients.find(
		(r: RecipientResponseProps) => r._id !== loggedInUser
	);
	if (!noError) {
		if (!sender) {
			throw new Error("Sender not found");
		}
	}
	if (sender === undefined) {
		return {
			profile: {
				bio: {
					title: "",
					description: "",
				},
			},
			socket: {
				status: "",
			},
			_id: "",
			firstName: "",
			lastName: "",
			score: 0,
			profileImage: {
				_id: "",
				url: "",
			},
			type: Roles.EMPTY,
			role: Roles.EMPTY,
			meta: {
				tokenId: "",
			},
		};
	}
	return sender;
};
export const getRecipient = (
	loggedInUser: string,
	recipients: RecipientResponseProps[] = [],
	noError: boolean = true
): RecipientResponseProps => {
	const recipient = recipients.find(
		(r: RecipientResponseProps) => r._id === loggedInUser
	);
	if (!noError) {
		if (!recipient) {
			throw new Error("Recipient not found");
		}
	}

	if (recipient === undefined) {
		return {
			profile: {
				bio: {
					title: "",
					description: "",
				},
			},
			socket: {
				status: "",
			},
			_id: "",
			firstName: "",
			lastName: "",
			score: 0,
			profileImage: {
				_id: "",
				url: "",
			},
			type: Roles.EMPTY,
			role: Roles.EMPTY,
		};
	}

	return recipient;
};

export const groupMessagesByDate = (
	msgs: CombinedMessageProps[]
): Array<[string, CombinedMessageProps[]]> => {
	// Grouping the messages by date
	const grouped = msgs.reduce<Record<string, CombinedMessageProps[]>>(
		(acc, message) => {
			const dateKey = formatDateHandler(message.createdAt, "YYYY-MM-DD");
			if (!acc[dateKey]) {
				acc[dateKey] = [];
			}
			acc[dateKey]?.push(message);
			return acc;
		},
		{}
	);

	// Converting the object into an array and sorting by date
	return Object.entries(grouped).sort(
		(a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
	);
};

export const getLastMessage = (messages: CombinedMessageProps[]): string => {
	const lastMessage = messages[messages.length - 1];
	const lstMsg =
		lastMessage?.content !== ""
			? lastMessage?.content
			: (lastMessage?.attachments?.[0]?.type ?? "");
	return lstMsg ?? "";
};

export const getLastMessageTime = (
	messages: CombinedMessageProps[]
): string => {
	if (messages.length === 0) {
		return ""; // or any default value you prefer
	}
	const lastMessage = messages[messages.length - 1] ?? messages[0];
	return lastMessage?.createdAt ?? "";
};

export const getConversationById = (
	messageId: string,
	allConversations: CombinedConversationResponseProps[],
	noError: boolean = true
): CombinedConversationResponseProps => {
	const convo = allConversations.find(
		(c: CombinedConversationResponseProps) => c._id === messageId
	);
	if (!noError) {
		if (!convo) {
			throw new Error("Conversation not found");
		}
	}

	if (convo === undefined) {
		return {
			_id: "",
			type: "",
			recipients: [],
			messages: [],
			createdAt: "",
			updatedAt: "",
			__v: 0,
			title: "",
			description: "",
		};
	}

	return convo;
};

export const parseMessages = (
	messages: Array<[string, CombinedMessageProps[]]>,
	loggedInUser: string
): Array<[string, CombinedMessageProps[]]> =>
	messages.map(([date, msgs]) => [
		date,
		msgs.map((m) => ({
			...m,
			isSent: m.user === loggedInUser,
			isRead: !!m.readBy?.includes(loggedInUser),
			timestamp: m.createdAt,
		})),
	]);

// Useful for Group chats and Direct Messages - Referenced for searching chats
export const getConversationHeader = (
	conversation: CombinedConversationResponseProps,
	loggedInUser: string
):
	| {
			_id: string | undefined;
			title: string;
			description: string;
			avatar: string;
			score: number;
	  }
	| {
			title: string | undefined;
			description: string | undefined;
			score: number;
			avatar: string;
			_id?: undefined;
	  } => {
	const sender = getSender(loggedInUser, conversation.recipients);

	return conversation.type === "DIRECT"
		? {
				_id: sender?._id,
				title:
					sender?.type === "creator"
						? sender?.firstName
						: `${sender?.firstName} ${sender?.lastName}`,
				description: sender?.profile?.bio?.title ?? "",
				avatar: sender?.profileImage?.url ?? "",
				score: sender?.score ?? 0,
			}
		: {
				title: conversation.title,
				description: conversation.description,
				score: 0,
				avatar: "",
			};
};

// Filter through conversation and remove the data with just one recipient - recipient is meant to be an array of 2 object (Direct Message)
export const removeSingleRecipientMessages = (
	allConversations: CombinedConversationResponseProps[]
): CombinedConversationResponseProps[] => {
	return allConversations.filter(
		(message) => (message.recipients?.length ?? 0) > 1
	);
};

// Function to update the progress of file uploads
export const updateFileUploadProgress = (
	id: string,
	progress: number,
	currentMessage: CombinedMessageProps | null
): CombinedMessageProps => {
	if (!currentMessage) {
		throw new Error("Current Message not found");
	}
	const updatedAttachments = currentMessage.attachments?.map((attachment) => {
		if (attachment._id === id) {
			// Ensure the size is a number if it's a string
			const size =
				typeof attachment.size === "string"
					? parseFloat(attachment.size)
					: attachment.size;
			return { ...attachment, progress, size };
		}
		return attachment;
	});

	return {
		...currentMessage,
		attachments: updatedAttachments,
	};
};

// ============== Messaging ============== //

export const talentAndClientHasReviewed = (
	bounty: CollectionProps
): boolean | undefined => {
	return (
		bounty.ratings?.some(
			(review) => review.owner?._id === bounty.owner?._id
		) &&
		bounty.ratings?.some(
			(review) => review.owner?._id === bounty.creator?._id
		)
	);
};

// Invite Feed Filter

export const filterInviteFeed = (
	bounties: BountyInvitesProps[],
	userId: string
): BountyInvitesProps[] => {
	// Spots are filled
	const isf = (b: CollectionProps): boolean => {
		const invitedSlots = b.collections.filter(isBountySlot);
		const acceptedSlotCount = invitedSlots.filter(
			(slot) =>
				slot?.status === CollectionStatus.ONGOING ||
				slot?.status === CollectionStatus.COMPLETED
		).length;
		return acceptedSlotCount >= b.meta?.slotCount;
	};

	// This user has already applied to the bounty
	const tap = (b: BountyInvitesDataProps): boolean => {
		const bountyApplicants =
			b.type === "application" &&
			b.creator._id === userId &&
			b.status === "pending";
		return bountyApplicants;
	};

	// This user is invited to the bounty
	const iv = (b: BountyInvitesDataProps): boolean => {
		const isInvited = b.type === "slot" && b.status === "pending";
		return isInvited;
	};

	return bounties.filter((invite) => {
		const { parent } = invite.data;
		if (parent) {
			return !isf(parent) && !tap(invite.data) && iv(invite.data);
		}
		// Will return false if parent is null or undefined, thus removing it from the list
		return false;
	});
};

export interface MappedMember {
	_id: string;
	name: string;
	title: string;
	score: string | number;
	image: string;
	skills: Array<{ name: string; color: string }>;
	achievements: GroupAchievemtProps;
	type: Roles;
	role: Roles;
	isMember?: boolean;
	nftTokenNumber?: string;
}

export const mapTalentData = (talent: MemberProps): MappedMember => ({
	_id: talent._id,
	name:
		determineRole(talent) === Roles.PARTNER
			? `${talent.firstName}`
			: `${talent.firstName} ${talent.lastName}`,
	title: talent?.profile?.bio?.title ?? "",
	score: talent?.score ?? "0",
	image: talent?.profileImage?.url ?? "",
	skills: (talent?.profile?.talent?.tagsIds ?? []).map((t) => ({
		name: t.name,
		color: t.color ?? getRandomReadableBgColor(),
	})),
	achievements: talent?.achievements,
	type: talent.type ?? Roles.EMPTY,
	role: talent.role ?? Roles.EMPTY,
	...(talent?.isMember ? { isMember: talent.isMember } : null),
	nftTokenNumber: talent?.nftTokenNumber,
});

export const clientHasReviewed = (bounty: CollectionProps): boolean => {
	return (
		bounty.ratings?.some(
			(review) => review.owner._id === bounty.owner?._id
		) ??
		bounty.ratings?.some(
			(review) => review.owner._id === bounty.creator?._id
		) ??
		false
	);
};

export const assignedSlots = (
	bountySlots: CollectionProps[]
): CollectionProps[] => {
	return bountySlots.filter(
		(bounty) =>
			bounty.payoutStatus !== PayoutStatus.COMPLETED &&
			bounty.inviteAccepted &&
			!clientHasReviewed(bounty) &&
			bounty.status !== CollectionStatus.CANCELLED
	);
};

export const unassignedBounties = (
	bounties: CollectionProps[],
	user: AccountProps
): CollectionProps[] => {
	return bounties.filter((bounty) => {
		const loggedInUserId = user?._id;
		const funded =
			bounty.escrowPaid && bounty.creator._id === loggedInUserId;
		const as = acceptedSlots(bounty);
		return as.length !== bounty.meta?.slotCount && funded;
	});
};

export const completedBounties = (
	bountySlots: CollectionProps[]
): CollectionProps[] => {
	return bountySlots.filter(
		(bounty) =>
			(bounty.payoutStatus === PayoutStatus.COMPLETED ||
				clientHasReviewed(bounty)) ??
			bounty.status === CollectionStatus.CANCELLED
	);
};

export const sortApplicantsHandler = (
	a: CollectionProps,
	b: CollectionProps,
	key: (obj: CollectionProps) => number,
	order: SortApplicationsScoresBy
): number => {
	if (order === SortApplicationsScoresBy.HIGHEST_TO_LOWEST) {
		return key(b) - key(a);
	}

	if (order === SortApplicationsScoresBy.LOWEST_TO_HIGHEST) {
		return key(a) - key(b);
	}

	return 0;
};

export const kycIsPending = (user: AccountProps): boolean => {
	const { kyc, kycStatus } = user;
	return (
		!kyc &&
		(kycStatus === KycVerificationStatus.REVIEW ||
			kycStatus === KycVerificationStatus.SUBMITTED)
	);
};

export const whichUserTyping = (
	id: string,
	loggedInUser: string,
	currentConversationId: string,
	messageId: string,
	sender: RecipientResponseProps
): string => {
	if (id !== loggedInUser && currentConversationId === messageId) {
		const s = sender._id === id;
		if (s) {
			const senderName =
				sender.role === Roles.PARTNER
					? sender?.firstName
					: `${sender?.firstName} ${sender?.lastName}`;
			const un = `${undefined} ${undefined}`;
			return `${`${senderName !== un ? `${senderName} is typing...` : ""}`}`;
		}
	}
	return "";
};
