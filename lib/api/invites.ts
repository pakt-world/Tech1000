/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	useMutation,
	type UseMutationResult,
	useQuery,
	type UseQueryResult,
} from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import { type ApiError, axios } from "@/lib/axios";

import { type Roles } from "../enums";
import { FeedType } from "../enums";
import { type CollectionProps, type MetaProps } from "../types/collection";
import { useCreateFeed } from "./feed";

// Get Invites
interface getInviteParams {
	page?: number;
	limit?: number;
	filter?: Record<string, unknown>;
}

export interface BountyInvitesDataProps {
	_id: string;
	name: string;
	isPrivate: boolean;
	escrowPaid: boolean;
	deliveryDate: string;
	description: string;
	paymentFee: number;
	creator: {
		_id: string;
		firstName: string;
		lastName: string;
		score: number;
		profileImage?: {
			url: string;
		};
		profile: {
			bio: {
				title: string;
				description: string;
			};
			talent: {
				tags: string[];
			};
		};
		type: string;
	};
	meta: MetaProps;
	parent: CollectionProps;
	status?: string;
	type?: string;
}

export interface BountyInvitesProps {
	status: "pending" | "accepted" | "rejected";
	_id: string;
	createdAt: string;
	data: BountyInvitesDataProps;
	sender?: {
		_id: string;
		firstName: string;
		lastName: string;
		score: number;
		profileImage?: {
			url: string;
		};
		profile: {
			bio: {
				title: string;
				description: string;
			};
			talent: {
				tags: string[];
			};
		};
		type: Roles;
		role?: Roles;
	};
}

export interface GetInviteResponse {
	data: BountyInvitesProps[];
	page: number;
	limit: number;
	total: number;
	pages: number;
}

async function getInvites({
	page = 1,
	limit = 10,
	filter,
}: getInviteParams): Promise<GetInviteResponse> {
	const res = await axios.get("/invite", {
		params: {
			page,
			limit,
			...filter,
		},
	});
	return res.data.data;
}

export const useGetInvites = ({
	page,
	limit,
	filter,
}: getInviteParams): UseQueryResult<GetInviteResponse, ApiError> => {
	return useQuery({
		queryFn: async () => getInvites({ page, limit, filter }),
		queryKey: [`get_invites_${page}_${limit}_${JSON.stringify(filter)}`],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		refetchInterval: 10000,
		refetchOnWindowFocus: false,
	});
};

// Accept Invite

interface AcceptPrivateBountyInviteParams {
	inviteId: string;
}

async function acceptInvite({
	id,
}: {
	id: string;
}): Promise<AcceptPrivateBountyInviteParams> {
	const res = await axios.post(`/invite/${id}/accept`);
	return res.data.data;
}

export function useAcceptInvite({
	bountyId,
}: {
	bountyId: string;
}): UseMutationResult<AcceptPrivateBountyInviteParams, ApiError, unknown> {
	const createFeed = useCreateFeed();
	// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
	return useMutation({
		mutationFn: acceptInvite,
		mutationKey: ["accept-private-bounty-invite"],
		onSuccess: () => {
			// create feed for accept invite
			createFeed.mutate({
				title: "Invite Accepted",
				description: "Invite Accepted",
				data: bountyId,
				type: FeedType.BOUNTY_INVITATION_ACCEPTED,
				isPublic: true,
			});
			toast.success("Invite Accepted successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Decline Invite

interface DeclineInviteResponse {
	meta: string;
	message: string;
}

async function declineInvite({
	id,
}: {
	id: string;
}): Promise<DeclineInviteResponse> {
	const res = await axios.post(`/invite/${id}/decline`);
	return res.data.data;
}

// interface DeclineInviteParams {
//     BountyCreator: string;
//     bountyId: string;
// }

// export function useDeclineInvite({ bountyCreator, bountyId }: DeclineInviteParams): UseMutationResult<
//     DeclineInviteResponse,
//     ApiError,
//     {
//         id: string;
//     },
//     unknown
// > {
export function useDeclineInvite(): UseMutationResult<
	DeclineInviteResponse,
	ApiError,
	{ id: string },
	unknown
> {
	// const createFeed = useCreateFeed();
	return useMutation({
		mutationFn: declineInvite,
		mutationKey: ["invite-call-action"],
		onSuccess: () => {
			// create feed for decline invite
			// createFeed.mutate({
			//   owners: [bountyCreator],
			//   title: 'Invite Declined',
			//   description: 'Invite Declined',
			//   data: bountyId,
			//   type: FeedType.BOUNTY_INVITATION_DECLINED,
			//   isPublic: false,
			// });
			toast.success("Invite Declined successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
