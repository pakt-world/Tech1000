/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { toast } from "@/components/common/toaster";
import { ENVS } from "@/config";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ApiError, axios } from "@/lib/axios";

interface KycProps {
	status: string;
	verification: {
		id: string;
		url: string;
		vendorData: string;
		host: string;
		status: string;
		sessionToken: string;
	};
}

async function postKycSession(): Promise<KycProps> {
	const res = await axios.post(`/user-verification/veriff/session/new`, {
		callBackUrl: ENVS.NEXT_PUBLIC_APP_BASE_URL,
	});
	return res.data.data;
}

export function useCreateKycSession(): UseMutationResult<
	KycProps,
	ApiError,
	unknown,
	unknown
> {
	return useMutation({
		mutationFn: postKycSession,
		mutationKey: ["kyc"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
