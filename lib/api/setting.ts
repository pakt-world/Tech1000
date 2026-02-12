/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
import { useSettingState } from "../store/settings";

export interface SystemSettings {
	maximum_upload_size_site: string;
	pcc_site_url: string;
	stripe_public_key: string;
	token_gating_contract_address_site: string;
	wallet_connect_id: string;
	site_name: string;
	site_logo: string;
	favicon_url: string;
	score_label: string;
	meta_title: string;
	meta_description: string;
	meta_tags: string;
	"allow_sign_on_invite_only": string;
	token_contract_amount: number;
	rpc: {
		rpcChainId: string;
	};
}

async function fetchSystemSettings(): Promise<SystemSettings> {
	const res = await axios.get(`/settings`);
	return res.data.data;
}

export const useGetSetting = ({
	enable = false,
}: {
	enable: boolean;
}): UseQueryResult<SystemSettings, ApiError> => {
	const { setSettings } = useSettingState();
	return useQuery({
		queryFn: async () => {
			const response = await fetchSystemSettings();
			return response;
		},
		queryKey: [`get-system-setting`],
		onSuccess: (data) => {
			setSettings(data);
			return data;
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		enabled: enable,
	});
};
