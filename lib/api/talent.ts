/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type QueryKey,
	useInfiniteQuery,
	type UseInfiniteQueryResult,
	useQuery,
	type UseQueryOptions,
	type UseQueryResult,
} from "@tanstack/react-query";

import { toast } from "@/components/common/toaster";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ApiError, axios } from "@/lib/axios";
import { type Review } from "@/lib/types";

import { GroupAchievemtProps, type MemberProps } from "../types/member";

const groupsBaseUrl = process.env.NEXT_PUBLIC_API_URL;

interface talentFetchParams {
	page?: number;
	limit: number;
	filter: Record<string, unknown>;
}
interface talentListResponse {
	data: MemberProps[];
	pages: number;
	page: number;
	limit: number;
	total: number;
}
interface reviewResponse {
	data: Review[];
	page: number;
	count: number;
}

async function getTalent({
	limit = 20,
	page = 1,
	filter,
}: talentFetchParams): Promise<talentListResponse> {
	const res = await axios.get(`${groupsBaseUrl}/account/users`, {
		params: {
			page,
			limit,
			...(filter ? { ...filter } : {}),
		},
	});
	return res.data.data;
}

async function getTalentById(id: string): Promise<MemberProps> {
	const talent = await axios.get(`${groupsBaseUrl}/account/user/${id}`);
	return talent.data.data;
}

async function getTalentReview(
	userId: string,
	page: string,
	limit: string
): Promise<reviewResponse> {
	const review = await axios.get(
		`/reviews?userId=${userId}&page=${page}${limit && `&limit=${limit}}`}`
	);
	return review.data.data;
}

export const useGetTalents = ({
	limit,
	page,
	filter,
}: talentFetchParams): UseQueryResult<talentListResponse, ApiError> => {
	const getQueryKey: QueryKey = [
		`user_${limit}_${page}_${JSON.stringify(filter)}`,
	];
	const options: UseQueryOptions<talentListResponse, ApiError> = {
		queryFn: async () => {
			return getTalent({ limit, page, filter });
		},
		queryKey: getQueryKey,
		onError: (error) => {
			toast.error(
				error.response?.data.message ??
					"An error fetching talents occurred"
			);
		},
		enabled: true,
		refetchOnMount: false,
		refetchInterval: 300000000,
	};

	return useQuery(getQueryKey, options);
};

export interface GetTalentResponse {
	limit: number;
	page: number;
	pages: number;
	total: number;
	data: MemberProps[];
}

export function useGetTalentInfinitely({
	limit,
	filter,
}: talentFetchParams): UseInfiniteQueryResult<GetTalentResponse, ApiError> {
	const getQueryKey: QueryKey = [
		"talents",
		`${limit}_${JSON.stringify(filter)}`,
	];
	return useInfiniteQuery(
		getQueryKey,
		async ({ pageParam = 1 }) =>
			getTalent({ limit, page: pageParam, filter }),
		{
			getNextPageParam: (lastPage) => {
				const { page: p, pages } = lastPage;
				const nextPage = p < pages;
				return nextPage ? p + 1 : undefined;
			},
			refetchOnMount: false,
		}
	);
}

export const useGetTalentById = (
	id: string,
	enabled: boolean = false
): UseQueryResult<
	{
		talent: MemberProps;
	},
	ApiError
> => {
	const getQueryIdKey = [`talent_id_${id}`];
	return useQuery({
		queryFn: async () => {
			const talent = await getTalentById(id);
			return { talent };
		},
		queryKey: getQueryIdKey,
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data.message ??
					"An error fetching talents occurred"
			);
		},
		enabled,
	});
};

export const useGetTalentReviewById = (
	id: string,
	page: string,
	limit: string,
	enabled = false
): UseQueryResult<reviewResponse, ApiError> => {
	const getQueryIdReview = [`talent_review_${id}_${page}_${limit}`];
	return useQuery({
		queryFn: async () => {
			const review = await getTalentReview(id, page, limit);
			return review;
		},
		queryKey: getQueryIdReview,
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data.message ??
					"An error fetching talents occurred"
			);
		},
		enabled,
	});
};

// get achievements
interface GetAchievementsParams {
	userId?: string;
}

async function fetchAchievements(
	params: GetAchievementsParams
): Promise<GroupAchievemtProps> {
	const res = await axios.get(`${groupsBaseUrl}/account/achievements`, {
		params: {
			...(params?.userId ? { userId: params.userId } : []),
		},
	});
	return res.data.data;
}

export function useGetAchievements(
	userId?: string
): UseQueryResult<GroupAchievemtProps, ApiError> {
	return useQuery({
		queryKey: ["get-achievements", userId ?? userId],
		queryFn: () => fetchAchievements({ userId }),
		onError: (error: any) => {
			toast.error(
				error?.response?.data.message ?? "Fetching achievements failed"
			);
		},
		onSuccess: () => {},
		enabled: true,
	});
}
