"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import { useIsClient } from "usehooks-ts";
import { avalanche, avalancheFuji } from "@wagmi/core/chains";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useProductVariables } from "@/hooks/use-product-variables";
import LoginWeb3Connector from "@/widgets/authentication/login/web3-login/login-wallet-connector";
import { ENVS } from "@/config";
import Web3LoginForm from "@/widgets/authentication/login/web3-login/login-web3";

export default function LoginPage(): JSX.Element {
	const { variables } = useProductVariables();
	const [showConnector, setShowConnector] = useState<boolean>(false);
	const [noNFT, setNoNFT] = useState<boolean>(false);
	const isClient = useIsClient();

	const chainId = ENVS?.isProduction
		? String(avalanche?.id)
		: String(avalancheFuji?.id);

	return (
		isClient && (
			<div className="z-[2] mt-8 flex size-full flex-col items-center gap-6 md:mt-0 md:justify-center">
				{!noNFT && (
					<div className="flex flex-col items-center gap-2 text-center text-white">
						<h3 className="font-sans text-2xl font-bold sm:text-3xl">
							Login to your account
						</h3>
						<p className="font-sans text-base">
							{variables?.LOGIN_SUBTEXT}
						</p>
					</div>
				)}

				{showConnector ? (
					<LoginWeb3Connector
						goBack={() => setShowConnector(false)}
						handleNoNFT={(e: boolean) => setNoNFT(e)}
						chainId={Number(chainId)}
					/>
				) : (
					<Web3LoginForm
						onFormSubmit={() => setShowConnector(true)}
					/>
				)}
			</div>
		)
	);
}
