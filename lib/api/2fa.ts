/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { toast } from "@/components/common/toaster";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ApiError, axios } from "@/lib/axios";

import { useGetAccount } from "./account";

// === Initiate 2FA Email === //

interface Initiate2FAParams {
	type: string;
}

interface Initiate2FAResponse {
	securityQuestions?: string[];
	qrCodeUrl?: string;
	secret?: string;
	type?: string;
}

async function postInitiate2FA(
	values: Initiate2FAParams
): Promise<Initiate2FAResponse> {
	const res = await axios.post("/account/initiate/2fa", values);
	return res.data.data;
}

export function useInitialize2FA(): UseMutationResult<
	Initiate2FAResponse,
	ApiError,
	Initiate2FAParams,
	unknown
> {
	return useMutation({
		mutationFn: postInitiate2FA,
		mutationKey: ["initialize_2fa_setup"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// === Initiate 2FA Email === //

interface ActivateDeactivate2FAParams {
	code: string;
	securityQuestion?: string;
}

async function postActivate2FA(
	values: ActivateDeactivate2FAParams
): Promise<void> {
	const res = await axios.post("/account/activate/2fa", values);
	return res.data.data;
}

export function useActivate2FA(): UseMutationResult<
	void,
	ApiError,
	ActivateDeactivate2FAParams,
	unknown
> {
	const { isFetching, refetch: fetchAccount } = useGetAccount();
	return useMutation({
		mutationFn: postActivate2FA,
		mutationKey: ["activate_2fa_setup"],
		onSuccess: async () => {
			if (!isFetching) await fetchAccount();
			// toast.success("2FA successfully activated");
		},
		// onError: (error: ApiError) => {
		// 	toast.error(error?.response?.data.message ?? "An error occurred");
		// },
	});
}

// ===

async function postDeActivate2FA(
	values: ActivateDeactivate2FAParams
): Promise<void> {
	const res = await axios.post("/account/deactivate/2fa", values);
	return res.data.data;
}

export function useDeActivate2FA(): UseMutationResult<
	void,
	ApiError,
	ActivateDeactivate2FAParams,
	unknown
> {
	const { isFetching, refetch: fetchAccount } = useGetAccount();
	return useMutation({
		mutationFn: postDeActivate2FA,
		mutationKey: ["deactivate_2fa_setup"],
		onSuccess: async () => {
			if (!isFetching) await fetchAccount();
			// toast.success("2FA successfully deactivated");
		},
		// onError: (error: ApiError) => {
		// 	toast.error(error?.response?.data.message ?? "An error occurred");
		// },
	});
}

// ===

async function postInitiate2FAEmail(): Promise<void> {
	const res = await axios.post("/account/2fa/email");
	return res.data.data;
}

export function useInitiate2FAEmail(): UseMutationResult<
	void,
	ApiError,
	void,
	unknown
> {
	return useMutation({
		mutationFn: postInitiate2FAEmail,
		mutationKey: ["deactivate_email_2fa_setup"],
		// onSuccess: () => {
		// 	toast.success("Email 2FA Code successfully Sent");
		// },
		// onError: (error: ApiError) => {
		// 	toast.error(error?.response?.data.message ?? "An error occurred");
		// },
	});
}
