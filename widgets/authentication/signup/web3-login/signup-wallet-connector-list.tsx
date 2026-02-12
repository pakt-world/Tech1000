"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { type FC } from "react";

const WALLET_LOGO: Record<string, string> = {
	MetaMask: "/icons/metamask.svg",
	"Core Wallet": "/icons/core-wallet.svg",
	WalletConnect: "/icons/wallet-connect.svg",
	"Coinbase Wallet": "/icons/coinbase-wallet.svg",
};

interface Connector {
	id: string;
	name: string;
	ready: boolean;
}
interface SignupWalletConnectListType {
	connectors: Connector[];
	isLoading: boolean;
	activeConnector: Connector | null;
	pendingConnector: Connector;
	SelectConnector: (connector: Connector) => void;
}

export const SignupWalletConnectList: FC<SignupWalletConnectListType> = ({
	connectors,
	activeConnector,
	pendingConnector,
	isLoading,
	SelectConnector,
}) => {
	return (
		<div className="flex flex-col gap-6">
			{connectors.map((connector: Connector) => {
				const isActive = activeConnector?.id === connector.id;
				const logo = WALLET_LOGO[connector.name];

				return (
					<button
						key={connector.name}
						type="button"
						disabled={!connector.ready}
						onClick={() => {
							SelectConnector(connector);
						}}
						className={`flex w-full cursor-pointer items-center justify-between rounded-full !border !bg-[#FCFCFD1A]/25 p-1 px-6 py-4 text-left text-white duration-300 hover:border-white ${
							isActive ? "border-white" : "border-[#E8E8E833]"
						}`}
					>
						<span className="flex w-full items-center gap-2">
							<span>{connector.name}</span>
							{isLoading &&
								pendingConnector?.id === connector.id && (
									<span className="animate-spin">
										<Loader2 size={16} />
									</span>
								)}
						</span>

						<span>
							{logo != null && (
								<Image
									src={logo}
									width={20}
									height={20}
									alt=""
								/>
							)}
						</span>
					</button>
				);
			})}
		</div>
	);
};
