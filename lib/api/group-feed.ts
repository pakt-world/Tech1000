import { ApiError, axios } from "@/lib/axios";
import {
	useInfiniteQuery,
	UseInfiniteQueryResult,
	useQuery,
	UseQueryResult,
} from "@tanstack/react-query";

import { toast } from "@/components/common/toaster";
import { FeedCardType } from "../types/feed";

const groupsBaseUrl = process.env.NEXT_PUBLIC_API_URL;

// get feed posts
interface GetFeedParams {
	page?: number;
	limit?: number;
	type: string;
	options?: {
		staleTime?: number;
		cacheTime?: number;
	};
}

export interface GetFeedResponse {
	data: FeedCardType[];
	total: number;
	pages: number;
	page: number;
	limit: number;
}

async function getFeed(params: GetFeedParams): Promise<GetFeedResponse> {
	const res = await axios.get(`${groupsBaseUrl}/feed`, {
		params: {
			page: params.page || 1,
			limit: params.limit || 10,
			type: params.type,
		},
	});

	return res.data.data;
}

export function useGetInviteCount(
	params: GetFeedParams
): UseQueryResult<GetFeedResponse, ApiError> {
	return useQuery({
		queryFn: () =>
			getFeed({
				...params,
			}),
		queryKey: ["get-user-invite-count"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		refetchOnWindowFocus: true,
	});
}

export function useGetFeedInfinitely(
	params: GetFeedParams
): UseInfiniteQueryResult<GetFeedResponse, ApiError> {
	return useInfiniteQuery(
		[`get-user-feed-${params.type}`, params.page, params.limit],
		async ({ pageParam = 1 }) => {
			return await getFeed({
				...params,
				page: pageParam,
			});
		},
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: ApiError) => {
				toast.error(
					error?.message ?? "An error occurred while fetching feed"
				);
			},
			refetchOnWindowFocus: false,
			enabled: true,
			staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
			cacheTime: 1000 * 60 * 10, // Data stays in cache for 10 minutes
		}
	);
}
