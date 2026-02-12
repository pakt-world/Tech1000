export enum CollectionTypes {
	BOUNTY = "bounty",
	SLOT = "slot",
	APPLICATION = "application",
	DELIVERABLE = "deliverable",
	CANCELLATION = "cancellation",
	REVIEW_CHANGE_REQUEST = "review_change_request",
}

export enum CollectionStatus {
	PENDING = "pending",
	ONGOING = "ongoing",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
	WAITING = "waiting", // Not so used
	CANCELLED_REQUESTED = "cancelled_requested", // Not so used
}

export enum CollectionInviteStatus {
	PENDING = "pending",
	ACCEPTED = "accepted",
	REJECTED = "rejected",
	CANCELLED = "cancelled",
	ONGOING = "ongoing",
}

export enum PayoutStatus {
	AWAITING = "awaiting",
	PROCESSING = "processing",
	REPROCESSING = "reprocessing",
	COMPLETED = "completed",
	FAILED = "failed",
}
export enum TransactionStatus {
	PROCESSING = "processing",
	PENDING = "pending",
	COMPLETED = "completed",
	FAILED = "failed",
	REPROCESSING = "reprocessing",
}

export enum TransactionType {
	WITHDRAWAL = "withdrawal",
	DEPOSIT = "deposit",
}
export enum CollectionCategory {
	CREATED = "created",
	ASSIGNED = "assigned",
	OPEN = "open",
}

export enum SortApplicationsScoresBy {
	HIGHEST_TO_LOWEST = "highest-to-lowest",
	LOWEST_TO_HIGHEST = "lowest-to-highest",
}

export enum SortApplicationsBy {
	SCORE = "score",
	BID = "bid",
}

export enum Roles {
	PARTNER = "partner",
	AMBASSADOR = "ambassador",
	EMPTY = "",
	CREATOR = "creator",
	RECIPIENT = "recipient",
}

export enum BountyType {
	PRIVATE = "private",
	OPEN = "open",
}

export enum KycVerificationStatus {
	CREATED = "created",
	APPROVED = "approved",
	RESUBMISSION_REQUESTED = "resubmission_requested",
	DECLINED = "declined",
	EXPIRED = "expired",
	ABANDONED = "abandoned",
	SUBMITTED = "submitted",
	MEDIA_UPLOADED = "media_uploaded",
	REVIEW = "review",
	EMPTY = "",
}

export enum BountyCategory {
	Design = "design",
	Engineering = "engineering",
	Content = "content",
	Marketing = "marketing",
	Events = "events",
	Others = "others",
}

export enum SocketStatus {
	Offline = "OFFLINE",
	Online = "ONLINE",
}

export enum Bucket {
	ChainsiteStorage = "chainsite-storage",
}

export enum TagType {
	Empty = "",
	Tags = "tags",
}

export enum AchievementType {
	REVIEW = "review",
	REFERRAL = "referral",
	FIVE_STAR = "five-star",
	SQUAD = "squad",
	EMPTY = "",
}

export enum FeedType {
	COLLECTION_CREATED = "collection_created",
	COLLECTION_INVITE = "collection_invite",
	REFERRAL_SIGNUP = "referral_signup",
	REFERRAL_COLLECTION_COMPLETION = "referral_bounty_completion",
	COLLECTION_UPDATE = "collection_update",
	COLLECTION_DELIVERED = "collection_delivered",
	COLLECTION_COMPLETED = "collection_completed",
	COLLECTION_REVIEWED = "collection_reviewed",
	COLLECTION_CANCELLED = "collection_cancelled",
	COLLECTION_INVITE_FILLED = "collection_invite_filled",
	COLLECTION_INVITE_ACCEPTED = "collection_invite_accepted",
	COLLECTION_INVITE_REJECTED = "collection_invite_rejected",
	COLLECTION_INVITE_CANCELLED = "collection_invite_cancelled",
	ISSUE_RAISED = "issue_resolution_raise",
	JURY_INVITATION = "jury_invitation",
	ISSUE_RESOLUTION_GUILTY = "issue_resolution_guilty",
	ISSUE_RESOLUTION_GUILTY_SECOND = "second_issue_resolution_guilty",
	ISSUE_RESOLUTION_RESOLVED = "issue_resolution_resolve",

	PUBLIC_BOUNTY_CREATED = "public_bounty_created",
	BOUNTY_APPLICATION_SUBMITTED = "bounty_application_submitted",
	BOUNTY_INVITATION_RECEIVED = "bounty_invitation_received",
	PUBLIC_BOUNTY_FILLED = "public_bounty_filled",
	BOUNTY_DELIVERABLE_UPDATE = "bounty_deliverable_update",
	BOUNTY_INVITATION_ACCEPTED = "bounty_invitation_accepted",
	BOUNTY_INVITATION_DECLINED = "bounty_invitation_declined",
	BOUNTY_COMPLETION = "bounty_Completion",
	BOUNTY_CANCELLED = "bounty_cancelled",
	BOUNTY_CANCELLED_REQUEST = "bounty_cancelled_request",
	BOUNTY_CANCELLED_ACCEPTED = "bounty_cancelled_accepted",
	BOUNTY_REVIEW = "bounty_review",
	BOUNTY_REVIEW_CHANGE = "bounty_review_change",
	BOUNTY_REVIEW_CHANGE_ACCEPTED = "bounty_review_change_accepted",
	BOUNTY_REVIEW_CHANGE_DECLINED = "bounty_review_change_declined",
	BOUNTY_PAYMENT_RELEASED = "a_payment_released",
}

export enum MessageDataTypeEnums {
	DIRECT = "DIRECT",
}

export enum MessageTypeEnums {
	TEXT = "TEXT",
	MEDIA = "MEDIA",
}

export enum ConversationEnums {
	USER_CONNECT = "USER_CONNECT",
	GET_ALL_CONVERSATIONS = "GET_ALL_CONVERSATIONS",
	JOIN_OLD_CONVERSATIONS = "JOIN_OLD_CONVERSATIONS",
	GET_ALL_USERS = "GET_ALL_USERS",
	INITIALIZE_CONVERSATION = "INITIALIZE_CONVERSATION",
	FETCH_CONVERSATION_MESSAGES = "FETCH_CONVERSATION_MESSAGES",
	SEND_MESSAGE = "SEND_MESSAGE",
	// CURRENT_RECIPIENT = "CURRENT_RECIPIENT",
	// USER_TYPING = "USER_TYPING",
	SENDER_IS_TYPING = "SENDER_IS_TYPING",
	SENDER_STOPS_TYPING = "SENDER_STOPS_TYPING",
	POPUP_MESSAGE = "POPUP_MESSAGE",
	MARK_MESSAGE_AS_SEEN = "MARK_MESSAGE_AS_SEEN",
	USER_STATUS = "USER_STATUS",
	// BROADCAST_MESSAGE = "BROADCAST_MESSAGE",
	// DELETE_CONVERSATION = "DELETE_CONVERSATION",
	// DELETE_MESSAGE = "DELETE_MESSAGE",
}

export enum ConversationTypeEnums {
	DIRECT = "DIRECT",
	GROUP = "GROUP",
	ALL = "ALL",
}

export enum MediaEnums {
	IMAGE_PNG = "image/png",
	IMAGE_JPEG = "image/jpeg",
	IMAGE_JPG = "image/jpg",
	IMAGE_GIF = "image/gif",
	IMAGE_SVG = "image/svg",
	PDF = "application/pdf",
	DOC = "application/msword",
	DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	XLS = "application/vnd.ms-excel",
}

export enum GroupInviteType {
	Open = "open",
	Close = "close",
	Private = "private",
}

export enum TwoFactorAuthEnums {
	AUTHENTICATOR = "google_auth",
	EMAIL = "email",
	SECURITY_QUESTION = "security_answer",
	EMPTY = "",
}
export const SETTING_CONSTANTS = {
	ALLOW_SIGN_ON_INVITE_ONLY: "allow_sign_on_invite_only",
};
