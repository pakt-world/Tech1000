/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	useMutation,
	type UseMutationResult,
	useQueryClient,
} from "@tanstack/react-query";

import { toast } from "@/components/common/toaster";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ApiError, axios } from "@/lib/axios";

import { useGetWalletDetails } from "./wallet";

interface WithdrawalParams {
	address: string;
	coin: string;
	amount: number;
	password: string;
	otp?: string;
}

async function postWithdrawalRequest(
	payload: WithdrawalParams
): Promise<WithdrawalParams> {
	const res = await axios.post(`/withdrawals`, payload);
	return res.data.data;
}

export function useWithdraw(): UseMutationResult<
	WithdrawalParams,
	ApiError,
	WithdrawalParams,
	unknown
> {
	const queryClient = useQueryClient();
	const { refetch } = useGetWalletDetails();
	return useMutation({
		mutationFn: postWithdrawalRequest,
		mutationKey: ["withdraw_referral_invite"],
		onSuccess: async (data) => {
			await queryClient.refetchQueries({
				queryKey: ["wallet-tx-q", "10", "1"],
			});
			await queryClient.refetchQueries({
				queryKey: ["wallet-data-fetch"],
			});
			await refetch();
			toast.success("Withdrawal Request Processing");
			return data;
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
