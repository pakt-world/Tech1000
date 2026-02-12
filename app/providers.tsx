"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WagmiProvider } from "wagmi";
import { useIsClient } from "usehooks-ts";
import { wagmiConfig } from "@/config/wagmi";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useDynamicTitleAndFavicon } from "@/hooks/use-dynamic-title-and-favicon";
import { useProductVariables } from "@/hooks/use-product-variables";
import { useSettingState } from "@/lib/store/settings";
import { SettingsProvider } from "@/providers/setting-provider";
// import { MobileInProgress } from "@/components/common/mobile-in-progress";
// import { isProductionEnvironment } from "@/lib/utils";
import { useViewportHeight } from "@/hooks/use-viewport-height";
interface Props {
	children: ReactNode;
}

export function Providers({ children }: Props): JSX.Element | null {
	// const isMatches = useMediaQuery("(max-width: 1280px)");
	const isClient = useIsClient();
	const { variables } = useProductVariables();
	const { settings } = useSettingState();

	const pageTitle = settings?.site_name ?? variables?.NAME ?? "";

	useDynamicTitleAndFavicon(pageTitle, {
		favicon: settings?.favicon_url ?? (variables?.FAVICON as string),
		description:
			settings?.meta_description ?? (variables?.DESCRIPTION as string),
	});

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// refetchInterval: 10000,
						// refetchOnWindowFocus: false,
						retry: 1,
						retryDelay: 10000,
					},
				},
			})
	);

	useViewportHeight();

	// if (isMatches && isProductionEnvironment) {
	// 	return (
	// 		<div className="flex h-full w-screen max-w-full overflow-y-hidden">
	// 			<MobileInProgress />
	// 		</div>
	// 	);
	// }

	if (isClient) {
		return (
			<QueryClientProvider client={queryClient}>
				<SettingsProvider>
					<WagmiProvider
						config={wagmiConfig(
							String(settings?.wallet_connect_id)
						)}
					>
						{children}
						<ReactQueryDevtools
							initialIsOpen={false}
							position="bottom-left"
						/>
					</WagmiProvider>
				</SettingsProvider>
			</QueryClientProvider>
		);
	}
	return null;
}
