/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	useInfiniteQuery,
	type UseInfiniteQueryResult,
	useMutation,
	type UseMutationResult,
	useQuery,
	useQueryClient,
	type UseQueryResult,
} from "@tanstack/react-query";

import { toast } from "@/components/common/toaster";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ApiError, axios } from "@/lib/axios";

import { type DataFeedResponse } from "../types";

const groupsBaseUrl = process.env.NEXT_PUBLIC_API_URL;

interface GetFeedsResponse {
	data: DataFeedResponse[] | [];
	limit: number;
	page: number;
	pages: number;
	total: number;
}

interface timelineFetchParams {
	page: number;
	limit: number;
	filter: Record<string, unknown>;
}

async function getTimelineFeeds({
	page,
	limit,
	filter,
}: timelineFetchParams): Promise<GetFeedsResponse> {
	const res = await axios.get(`/feeds`, {
		params: {
			page,
			limit,
			...filter,
		},
	});
	return res.data.data;
}

export const useGetTimeline = ({
	page,
	limit,
	filter,
}: timelineFetchParams): UseInfiniteQueryResult<
	[] | DataFeedResponse[],
	unknown
> => {
	return useInfiniteQuery(
		[`get-timeline_${page}_${limit}`],
		async ({ pageParam = 1 }) =>
			(await getTimelineFeeds({ page: pageParam, limit, filter })).data,
		{
			getNextPageParam: (_, pages) => pages.length + 1,
			enabled: true,
		}
	);
	// return useQuery({
	//   queryFn: async () => await getTimelineFeeds({ page, limit, filter }),
	//   queryKey: [`get-timeline_${page}_${limit}`],
	//   onError: (error: ApiError) => {
	//     toast.error(error?.response?.data.message || 'An error occurred');
	//   },
	//   onSuccess: (data: GetFeedsResponse) => {
	//     return data;
	//   },
	//   enabled: false,
	// });
};

// ===

interface CreatorData {
	_id: string;
	firstName: string;
	lastName: string;
	score: number;
	profileImage?: { url: string };
	profile?: { bio?: { role: string } };
	nftTokenNumber?: string;
	nftImageUrl?: string;
}

export interface GetTimelineResponse {
	leaderboard: CreatorData[];
	total: number;
	position: number;
}

interface GetLeaderboardParams {
	role: string;
	limit: number;
	scoreMin: number;
	sortBy?: string;
	orderBy?: string;
	profileCompletenessMin: number;
}

async function getLeaderBoard(
	params: GetLeaderboardParams
): Promise<GetTimelineResponse> {
	const res = await axios.get(`${groupsBaseUrl}/account/leaderboard`, {
		params: {
			// role: params.role,
			limit: params.limit,
			// profileCompletenessMin: params.profileCompletenessMin,
			// sortBy: params.sortBy,
			// orderBy: params.orderBy,
			// scoreMin: params.scoreMin,
		},
	});
	return res.data.data;
}

export const useGetLeaderBoard = (
	params: GetLeaderboardParams
): UseQueryResult<GetTimelineResponse, ApiError> => {
	return useQuery({
		queryFn: async () => getLeaderBoard(params),
		queryKey: ["get-leader-board"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data: GetTimelineResponse) => {
			return data;
		},
	});
};

// ===

async function dismissFeed(id: string): Promise<void> {
	const res = await axios.post(`${groupsBaseUrl}/feed/${id}`);
	return res.data.data;
}

export function useDismissFeed(): UseMutationResult<
	void,
	ApiError,
	string,
	unknown
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: dismissFeed,
		mutationKey: ["dismiss-feed-by-id"],
		onSuccess: async () => {
			await queryClient.refetchQueries([`get-timeline_1_10`], {
				stale: true,
			});
			//toast.success("Feed Dismissed successfully");
		},
		onError: () => {
			//toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// ===

async function dismissAllFeed(): Promise<void> {
	const res = await axios.put(`/feeds/dismiss/all`);
	return res.data.data;
}

export function useDismissAllFeed(): UseMutationResult<
	void,
	ApiError,
	void,
	unknown
> {
	return useMutation({
		mutationFn: dismissAllFeed,
		mutationKey: ["dismiss-all-feed"],
		onSuccess: () => {
			toast.success("All Feeds Dismissed successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
