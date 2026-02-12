/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

import { toast } from "@/components/common/toaster";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ApiError } from "@/lib/axios";

import { type CountryProps, type StateProps } from "../types/location";

async function fetchStates(): Promise<StateProps[]> {
	const res = await axios.get(`/json/states.json`);
	return res.data;
}
async function fetchCountries(): Promise<CountryProps[]> {
	const res = await axios.get(`/json/countries.json`);
	return res.data;
}

export const useGetStates = (): UseQueryResult<StateProps[], ApiError> => {
	return useQuery({
		queryFn: async () => {
			const response = await fetchStates();
			return response;
		},
		queryKey: [`get-states`],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data) => {
			return data;
		},
	});
};

export const useGetCountries = (): UseQueryResult<CountryProps[], ApiError> => {
	return useQuery({
		queryFn: async () => {
			const response = await fetchCountries();
			return response;
		},
		queryKey: [`get-countries`],
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data.message ?? "Error fetching countries:"
			);
		},
		onSuccess: (data) => {
			return data;
		},
	});
};
