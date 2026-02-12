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
import { type AccountProps } from "@/lib/types/account";

import { useUserState } from "../store/account";
// import { useExchangeRateStore } from "../store/misc";
// import { type ExchangeRateRecord, fetchExchangeRate } from "./wallet";

const groupsBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export interface UpdateAccountParams {
	firstName?: string;
	lastName?: string;
	profile?: {
		contact?: {
			state?: string;
			city?: string;
			phone?: string;
			address?: string;
			country?: string;
		};
		bio?: {
			title?: string;
			description?: string;
		};
		talent?: {
			availability?: string;
			tags?: string[];
		};
	};
	profileImage?: string;
	isPrivate?: boolean;
	type?: string;
}

async function postUpdateAccount(
	values: UpdateAccountParams
): Promise<AccountProps> {
	const res = await axios.patch("/account/update", values);
	return res.data.data;
}

export function useUpdateAccount(): UseMutationResult<
	AccountProps,
	ApiError,
	UpdateAccountParams,
	unknown
> {
	return useMutation({
		mutationFn: postUpdateAccount,
		mutationKey: ["update_account_system"],
		onSuccess: () => {
			toast.success("Account updated successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

export async function fetchUserAccount(): Promise<AccountProps> {
	const res = await axios.get(`${groupsBaseUrl}/account`);
	return res.data.data;
}

export const useGetAccount = (): UseQueryResult<AccountProps, ApiError> => {
	const { setUser } = useUserState();
	// const { setData } = useExchangeRateStore();
	// Get the exchange rates immediately after fetching the user account
	// const getExchangeRates = async () => {
	// 	try {
	// 		const exchangeRates: ExchangeRateRecord = await fetchExchangeRate();
	// 		setData(exchangeRates);
	// 		// Use the exchangeRates as needed
	// 	} catch (error) {
	// 		const errorMessage =
	// 			error instanceof Error
	// 				? error.message
	// 				: "Error fetching exchange rates";
	// 		toast.error(errorMessage);
	// 	}
	// };

	return useQuery({
		queryFn: fetchUserAccount,
		queryKey: ["account-details"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (user: AccountProps) => {
			setUser(user);
			if (user) {
				// getExchangeRates();
			}

			return user;
		},
		// enabled: false,
	});
};

// ===

interface ChangePasswordParams {
	oldPassword: string;
	newPassword: string;
}

async function postChangePassword(values: ChangePasswordParams): Promise<void> {
	const res = await axios.put("/account/password/change", values);
	return res.data.data;
}

export function useChangePassword(): UseMutationResult<
	void,
	ApiError,
	ChangePasswordParams,
	unknown
> {
	return useMutation({
		mutationFn: postChangePassword,
		mutationKey: ["change_password"],
		onSuccess: () => {
			toast.success("Account Password changed successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

interface DeleteAccountParams {
	password: string;
}

async function postDeleteAccount(values: DeleteAccountParams): Promise<void> {
	const res = await axios.post("/account/delete-account", {
		password: values.password,
	});
	return res.data.data;
}

export function useDeleteAccount(): UseMutationResult<
	void,
	ApiError,
	DeleteAccountParams,
	unknown
> {
	return useMutation({
		mutationFn: postDeleteAccount,
		mutationKey: ["delete-account"],
		onSuccess: () => {
			toast.success("Account deleted successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

export async function utilityfetchUserAccount(
	authToken: string
): Promise<AccountProps> {
	const res = await axios.get(`${groupsBaseUrl}/account`, {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	return res.data.data;
}

export interface UtilityUpdateAccountParams {
	meta: {
		tokenId?: string;
		imageUrl?: string;
	};
}

export async function utilityUpdateAccount(
	values: UtilityUpdateAccountParams,
	authToken: string
): Promise<AccountProps> {
	const res = await axios.patch("/account/update", values, {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	return res.data.data;
}
