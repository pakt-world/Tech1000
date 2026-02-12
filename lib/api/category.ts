/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { toast } from "@/components/common/toaster";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ApiError, axios } from "@/lib/axios";

export interface CategoryData {
	_id: string;
	name: string;
	color: string;
	categories: unknown[]; // Replace 'any' with more specific type if categories have a defined structure
	isParent: boolean;
	type: string;
	createdAt: string; // ISO Date string, could also use Date type
	updatedAt: string; // ISO Date string, could also use Date type
	__v: number;
}

interface CategoryResponse {
	data: CategoryData[];
}

async function getLeaderBoard(search: string): Promise<CategoryResponse> {
	const res = await axios.get(`/tag-category?search=${search}`);
	return res.data.data;
}

export const useGetCategory = (
	search: string
): UseQueryResult<CategoryResponse, ApiError> => {
	return useQuery({
		// queryFn: async () => getLeaderBoard(search),
		queryFn: async () => {
			if (search) {
				return getLeaderBoard(search);
			}
			throw new Error("No search parameter provided");
		},
		queryKey: [`category_${JSON.stringify(search)}`],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		enabled: Boolean(search), // Conditionally enable the query
		onSuccess: (data: CategoryResponse) => {
			return data;
		},
	});
};
