"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ExchangeRateRecord } from "@/lib/api/wallet";
import { CollectionTypes, FeedType, Roles } from "@/lib/enums";
import { type DataFeedResponse } from "@/lib/types";

import { BountyApplicationCard } from "./feed-cards/bounty/applicant";
import { BountyCancelled } from "./feed-cards/bounty/cancelled";
import { BountyFeedCard } from "./feed-cards/bounty/feed";
import { PublicBountyCreatedFeed } from "./feed-cards/bounty/public-bounty-created";
import { BountyReviewedFeed } from "./feed-cards/bounty/reviewed";
import { BountyCompletionFeed } from "./feed-cards/deliverable/completion";
import { BountyUpdateFeed } from "./feed-cards/deliverable/update";
import { PaymentReleased } from "./feed-cards/payment-released";
import { ReferralBountyCompletion } from "./feed-cards/referral/bounty-completion";
import { ReferralSignupFeed } from "./feed-cards/referral/signup";
import { ReviewChangeCard } from "./feed-cards/review/change";
import { ReviewResponseChangeCard } from "./feed-cards/review/response-change";

export const ParseFeedView = (
	feed: DataFeedResponse,
	loggedInUser: string,
	key: number,
	rates?: ExchangeRateRecord | undefined,
	callback?: () => void,
	dismissFeed?: (id: string) => void,
	userType?: Roles,
	tab?: boolean
): ReactElement | null | undefined => {
	const coin = feed?.data?.meta?.coin;
	const isPartner = userType === Roles.PARTNER;
	// const isBookmarked = feed.isBookmarked ?? false;
	// const bookmarkId = feed.bookmarkId ?? feed._id;
	const { _id, type } = feed;
	const { isBookmarked = false, bookmarkId = _id } = feed;

	const feedCreator = {
		_id: feed?.creator?._id ?? "",
		avatar: feed?.creator?.profileImage?.url ?? "",
		name: `${feed?.creator?.firstName ?? ""} ${feed?.creator?.lastName ?? ""}`,
		score: (feed?.creator?.score as number) ?? 0,
		type: feed?.creator?.type ?? Roles.EMPTY,
		role: feed?.data?.creator?.role ?? Roles.EMPTY,
	};

	const inviter = {
		_id: feed?.data?.creator?._id ?? "",
		avatar: feed?.data?.creator?.profileImage?.url ?? "",
		name: `${feed?.data?.creator?.firstName ?? ""}`,
		score: feed?.data?.creator?.score ?? 0,
		type: feed?.data?.creator?.type ?? "",
		role: feed?.data?.creator?.role as Roles,
	};

	const talent = {
		_id: feed?.data?.owner?._id ?? "",
		avatar: feed?.data?.owner?.profileImage?.url ?? "",
		name: `${feed?.data?.owner?.firstName ?? ""} ${feed?.data?.owner?.lastName ?? ""}`,
		score: feed?.data?.owner?.score ?? 0,
		type: feed?.data?.owner?.type ?? "",
		role: feed?.data?.owner?.role as Roles,
	};

	const deliverableTotal = (feed?.data?.collections ?? []).filter(
		(f) => f.type === CollectionTypes.DELIVERABLE
	).length;
	const currentProgress = feed?.meta?.value;
	const deliverableCountPercentage = {
		total: deliverableTotal,
		progress: Math.floor(currentProgress as number),
	};

	switch (type) {
		case FeedType.COLLECTION_CREATED:
		case FeedType.PUBLIC_BOUNTY_CREATED:
			return (
				<PublicBountyCreatedFeed
					key={key}
					creator={{
						_id: feed?.creator?._id ?? "",
						avatar: feed?.creator?.profileImage?.url ?? "",
						name: `${feed?.creator?.firstName ?? ""}`,
						score: (feed?.creator?.score as number) ?? 0,
					}}
					amount={String(feed?.data?.paymentFee)}
					bountyId={feed?.data?._id}
					title={feed?.data?.name}
					feedId={feed?._id}
					bookmark={{ active: isBookmarked, id: bookmarkId }}
					callback={callback}
					close={dismissFeed}
					coin={feed?.data?.meta?.coin}
					realTimeRate={
						rates?.[feed?.data?.meta?.coin?.reference] ?? 0
					}
					slotCount={feed?.data?.meta?.slotCount ?? 0}
					isPartner={isPartner}
				/>
			);
		case FeedType.COLLECTION_INVITE:
		case FeedType.BOUNTY_INVITATION_RECEIVED:
			return (
				<BountyFeedCard
					key={key}
					feedId={feed?._id}
					title={feed?.data?.parent?.name ?? ""}
					type="bounty-invite-pending"
					amount={String(feed?.data?.parent?.paymentFee)}
					inviteId={feed?.data?.invite?._id ?? ""}
					inviter={{
						_id: feed?.creator?._id ?? "",
						avatar: feed?.creator?.profileImage?.url ?? "",
						name: `${feed?.creator?.firstName ?? ""}`,
						score: (feed?.creator?.score as number) ?? 0,
						type: feed?.creator?.type ?? Roles.EMPTY,
						role: feed?.creator?.role ?? Roles.EMPTY,
					}}
					bountyId={feed?.data?.parent?._id ?? ""}
					coin={feed?.data?.parent?.meta?.coin}
					realTimeRate={
						rates?.[feed?.data?.parent?.meta?.coin?.reference] ?? 0
					}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					close={dismissFeed}
					bountyData={feed?.data}
				/>
			);
		case FeedType.BOUNTY_INVITATION_ACCEPTED:
		case FeedType.BOUNTY_INVITATION_DECLINED:
		case FeedType.COLLECTION_INVITE_ACCEPTED:
		case FeedType.COLLECTION_INVITE_REJECTED:
		case FeedType.COLLECTION_INVITE_CANCELLED:
			return (
				<BountyFeedCard
					key={key}
					feedId={_id}
					title={feed?.data?.name}
					type="bounty-invite-response"
					accepted={
						feed?.type ===
						(FeedType.BOUNTY_INVITATION_ACCEPTED ||
							FeedType.COLLECTION_INVITE_ACCEPTED)
					}
					cancelled={
						feed?.type === FeedType.COLLECTION_INVITE_CANCELLED
					}
					bookmarked={isBookmarked}
					bountyId={feed?.data?._id}
					bookmarkId={bookmarkId}
					talent={feedCreator}
					close={dismissFeed}
					coin={coin}
					realTimeRate={
						(rates ? rates[coin?.reference] : 0) as number
					}
					amount={feed?.data?.paymentFee ?? 0}
					bountyData={feed?.data}
				/>
			);
		case FeedType.BOUNTY_APPLICATION_SUBMITTED:
			return (
				<BountyApplicationCard
					key={key}
					id={feed?._id}
					title={feed?.data?.parent?.name ?? ""}
					applicant={{
						_id: feed?.data?.creator?._id || "",
						name: `${feed?.data?.creator?.firstName} ${feed?.data?.creator?.lastName}`,
						avatar: feed?.data?.creator?.profileImage?.url ?? "",
						score: feed?.data?.creator?.score,
						title: feed?.data?.creator?.profile?.bio?.title ?? "",
					}}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					bountyId={feed?.data?.parent?._id ?? ""}
					close={dismissFeed}
					tab={tab}
				/>
			);
		case FeedType.BOUNTY_DELIVERABLE_UPDATE:
		case FeedType.COLLECTION_UPDATE: {
			const { data } = feed;
			return (
				<BountyUpdateFeed
					key={key}
					talent={talent}
					creator={inviter}
					id={feed?._id}
					title={feed?.title}
					description={feed?.description}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					close={dismissFeed}
					bountyId={feed?.data?._id}
					progress={deliverableCountPercentage}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					bountyTitle={data?.name}
					isMarked={feed?.meta?.isMarked as boolean}
				/>
			);
		}
		case FeedType.REFERRAL_SIGNUP:
			return (
				<ReferralSignupFeed
					key={key}
					id={feed?._id}
					name={`${feed?.creator?.firstName ?? ""} ${feed?.creator?.lastName ?? ""}`}
					title={feed?.title}
					description={feed?.description}
					avatar={feed?.creator?.profileImage?.url}
					userId={feed?.creator?._id}
					score={(feed?.creator?.score as number) ?? 0}
					close={dismissFeed}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
				/>
			);
		case FeedType.BOUNTY_REVIEW:
			return (
				<BountyReviewedFeed
					key={key}
					id={feed?._id}
					talent={talent}
					creator={inviter}
					isCreator={feed?.data?.creator?._id !== loggedInUser}
					title={feed?.data?.name}
					description={feed?.description}
					close={dismissFeed}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					rating={feed?.meta?.rating}
				/>
			);
		case FeedType.REFERRAL_COLLECTION_COMPLETION:
			return (
				<ReferralBountyCompletion
					key={key}
					id={feed?._id}
					talent={talent}
					close={dismissFeed}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					title={feed?.data?.name}
					rating={feed?.meta?.rating as number}
				/>
			);
		case FeedType.BOUNTY_PAYMENT_RELEASED:
			return (
				<PaymentReleased
					key={key}
					id={feed?._id}
					talent={talent}
					creator={inviter}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					amount={String(feed?.data?.paymentFee)}
					close={dismissFeed}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					title={feed?.title}
					coin={feed?.data?.meta?.coin}
				/>
			);
		case FeedType.COLLECTION_COMPLETED:
		case FeedType.BOUNTY_COMPLETION:
			return (
				<BountyCompletionFeed
					key={key}
					id={feed?._id}
					talent={talent}
					creator={inviter}
					bountyId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					close={dismissFeed}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					title={feed?.data?.name}
					tab={tab as boolean}
				/>
			);
		case FeedType.COLLECTION_CANCELLED:
		case FeedType.BOUNTY_CANCELLED:
			return (
				<BountyCancelled
					key={key}
					id={feed?._id}
					talent={talent}
					creator={inviter}
					bountyId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					close={dismissFeed}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					title={feed?.title}
				/>
			);
		case FeedType.BOUNTY_CANCELLED_REQUEST:
		case FeedType.BOUNTY_CANCELLED_ACCEPTED:
			return (
				<ReviewChangeCard
					key={key}
					id={feed?._id}
					talent={talent}
					creator={inviter}
					bountyId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					// close={dismissFeed}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					title={
						feed?.type === FeedType.BOUNTY_CANCELLED_ACCEPTED
							? feed?.data?.name
							: `${feedCreator?.name} requested to cancel a bounty`
					}
					description={feed?.description}
					isAccepted={
						feed?.type === FeedType.BOUNTY_CANCELLED_ACCEPTED
					}
					rating={feed?.meta?.value}
				/>
			);
		case FeedType.BOUNTY_REVIEW_CHANGE:
			return (
				<ReviewChangeCard
					key={key}
					id={feed?._id}
					talent={talent}
					creator={inviter}
					bountyId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					// close={dismissFeed}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					title={`${talent?.name} submitted a redo request`}
					description={feed?.description}
					isAccepted={false}
				/>
			);
		case FeedType.BOUNTY_REVIEW_CHANGE_ACCEPTED:
		case FeedType.BOUNTY_REVIEW_CHANGE_DECLINED:
			return (
				<ReviewResponseChangeCard
					key={key}
					id={feed?._id}
					talent={talent}
					creator={inviter}
					bountyId={feed?.data?._id}
					isCreator={feed?.data?.creator?._id === loggedInUser}
					close={dismissFeed}
					bookmarked={isBookmarked}
					bookmarkId={bookmarkId}
					title={feed?.title}
					description={feed?.description}
					isDeclined={
						feed?.type === FeedType.BOUNTY_REVIEW_CHANGE_DECLINED
					}
				/>
			);

		// case FeedType.ISSUE_RAISED:
		//   return <IssueResolutionRaiseFeed />;
		// case FeedType.ISSUE_RESOLUTION_GUILTY:
		//   return <IssueResolutionRejectFeed />;
		// case FeedType.ISSUE_RESOLUTION_RESOLVED:
		//   return <IssueResolutionResolveFeed />;
		// case FeedType.ISSUE_RESOLUTION_GUILTY_SECOND:
		//   return <SecondIssueResolutionRejectFeed />;
		// case FeedType.JURY_INVITATION:
		//   return <JuryInvitationFeed />;
		default:
			return null;
		// return (
		//   <BountyFeedCard
		//     key={key}
		//     title="Not known yet"
		//     type="bounty-invite-filled"
		//     inviter={inviter}
		//     feedId={feed?._id}
		//     // amount={amount}
		//     // inviteId={feed?.data?.invite}
		//     // bountyId={feed?.data?._id}
		//     bookmarked={isBookmarked}
		//     bookmarkId={bookmarkId}
		//     close={dismissFeed}
		//   />
		// );
	}
};
