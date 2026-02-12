import { http, createConfig } from "wagmi";
import { avalanche, avalancheFuji, Chain } from "wagmi/chains";
import { metaMask, walletConnect, coinbaseWallet } from "wagmi/connectors";
import { ENVS } from ".";

const transports = {
	[avalanche.id]: http(),
	[avalancheFuji.id]: http(),
};

const supportedChains: Chain[] = !ENVS?.isProduction
	? [avalancheFuji]
	: [avalanche];
const wagmiConfig = (projectId: string) => {
	if (!projectId) return null;

	return createConfig({
		chains: supportedChains,
		connectors: [
			walletConnect({
				customStoragePrefix: "tech1000-wallet",
				projectId: String(projectId),
				relayUrl: "wss://relay.walletconnect.org",
			}),
			metaMask({
				logging: { developerMode: true, sdk: true },
			}),
			coinbaseWallet(),
		],
		multiInjectedProviderDiscovery: true,
		transports,
	});
};

export { wagmiConfig };
