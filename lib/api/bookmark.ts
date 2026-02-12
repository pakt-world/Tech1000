/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	useInfiniteQuery,
	UseInfiniteQueryResult,
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

import { GroupsBookmark, type Bookmark } from "../types";

const groupsBaseUrl = process.env.NEXT_PUBLIC_API_URL;
interface GetBookMarkResponse {
	data: Bookmark[];
	page: number;
	limit: number;
}

interface GetGroupsBookMarkResponse {
	data: GroupsBookmark[];
	page: number;
	pages: number;
	limit: number;
}

interface timelineFetchParams {
	page: number;
	limit: number;
	filter: Record<string, unknown>;
	options?: {
		staleTime?: number;
		cacheTime?: number;
	};
}

async function getBookmarks({
	page,
	limit,
	filter,
}: timelineFetchParams): Promise<GetBookMarkResponse> {
	const res = await axios.get("/bookmark", {
		params: {
			page,
			limit,
			...filter,
		},
	});
	return res.data.data;
}

async function getGroupsBookmarks({
	page,
	limit,
	filter,
}: timelineFetchParams): Promise<GetGroupsBookMarkResponse> {
	const res = await axios.get(`${groupsBaseUrl}/bookmark`, {
		params: {
			page,
			limit,
			...filter,
		},
	});
	return res.data.data;
}

export const useGetBookmarks = ({
	page,
	limit,
	filter,
}: timelineFetchParams): UseQueryResult<GetBookMarkResponse, ApiError> => {
	return useQuery({
		queryFn: async () => getBookmarks({ page, limit, filter }),
		queryKey: [`get-bookmark_req_${page}`],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data: GetBookMarkResponse) => {
			return data;
		},
	});
};

export function useGetGroupsBookmarksInfinitely({
	page,
	limit,
	filter,
	options,
}: timelineFetchParams): UseInfiniteQueryResult<
	GetGroupsBookMarkResponse,
	ApiError
> {
	return useInfiniteQuery(
		[`get-bookmarks_groups`, page, limit, filter],
		async ({ pageParam = 1 }) => {
			return await getGroupsBookmarks({
				page: pageParam,
				limit,
				filter,
			});
		},
		{
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			onError: (error: ApiError) => {
				toast.error(
					error?.response?.data.message ?? "An error occurred"
				);
			},
			enabled: true,
			staleTime: options?.staleTime,
			cacheTime: options?.cacheTime,
		}
	);
}

// ===

interface AddToBookmarkParams {
	reference: string;
	type: string;
}

async function addToBookmark({
	reference,
	type,
}: AddToBookmarkParams): Promise<AddToBookmarkParams> {
	const res = await axios.post(`${groupsBaseUrl}/bookmark`, {
		reference,
		type,
	});
	return res.data.data;
}

export function useSaveToBookmark(
	callBack?: () => void
): UseMutationResult<
	AddToBookmarkParams,
	ApiError,
	AddToBookmarkParams,
	unknown
> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addToBookmark,
		mutationKey: ["save-bookmark"],
		onSuccess: async () => {
			await Promise.all([
				queryClient.refetchQueries([`get-bookmark_req_1`]),
				queryClient.refetchQueries(["get-timeline"]),
				queryClient.refetchQueries(["get-bookmarks_groups"]),
				callBack?.(),
			]);
			toast.success("Saved to bookmark successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// ===

interface BookmarkParams {
	id: string;
}

async function removeFromBookmark({
	id,
}: BookmarkParams): Promise<BookmarkParams> {
	const res = await axios.delete(`${groupsBaseUrl}/bookmark/${id}`);
	return res.data.data;
}

export function useRemoveFromBookmark(
	callBack?: () => void
): UseMutationResult<BookmarkParams, ApiError, BookmarkParams, unknown> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: removeFromBookmark,
		mutationKey: ["removeFromBookmark"],
		onSuccess: async () => {
			await Promise.all([
				queryClient.refetchQueries([`get-bookmark_req_1`]),
				queryClient.refetchQueries(["get-timeline"]),
				queryClient.refetchQueries(["get-bookmarks_groups"]),
				callBack?.(),
			]);
			toast.success("Removed From bookmark successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
