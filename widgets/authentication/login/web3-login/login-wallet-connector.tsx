"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState, useEffect } from "react";
import {
	useAccount,
	useConnect,
	useDisconnect,
	useSignMessage,
	useSwitchChain,
} from "wagmi";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { CircleX } from "lucide-react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import CardView from "../../../../components/common/card-view";
import { AUTH_TOKEN_KEY, createQueryStrings } from "@/lib/utils";
import { WalletConnectorList } from "@/widgets/connector-list";
import { useWeb3Request, useWeb3Validate } from "@/lib/api/auth";
import { FormValues } from "../../signup/web3-login/signup-web3";
import { toast } from "../../../../components/common/toaster";
import { Button } from "../../../../components/common/button";
import {
	utilityfetchUserAccount,
	utilityUpdateAccount,
} from "@/lib/api/account";
import { fetchNFTData } from "../../mint/mint-utility";
// import { PageLoading } from "../common/page-loading";
import { NFTMetadata } from "@/lib/types";
import LoginNFTSelectionForm from "./connect-wallet/_components/login-nft-selection";
import { useSettingState } from "@/lib/store/settings";
import Logger from "@/lib/utils/logger";
import NoNewNftView from "./connect-wallet/_components/no-new-nft";
import { useMediaQuery } from "usehooks-ts";

interface ConnectorProps {
	id: string;
	name: string;
	ready: boolean;
}

interface LoginWeb3ConnectorProps {
	formData?: FormValues | null;
	goBack: () => void;
	handleNoNFT: (e: boolean) => void;
	chainId: number;
}

const LoginWeb3Connector = ({
	formData,
	goBack,
	handleNoNFT,
	chainId,
}: LoginWeb3ConnectorProps): React.JSX.Element => {
	const router = useRouter();
	const {
		isConnected,
		address,
		connector: activeConnector,
		chain,
	} = useAccount();
	const { connect, connectors, isLoading } = useConnect();
	const { disconnect } = useDisconnect();
	const { switchChain } = useSwitchChain();
	const isMobile = useMediaQuery("(max-width: 640px)");

	const isWrongChain = chain?.id !== chainId;

	const [selectedConnector, setConnector] = useState<ConnectorProps | null>(
		activeConnector || null
	);
	const [noNFTView, setNoNFTView] = useState<boolean>(false);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [sessionData, setSessionData] = useState<{
		token: string;
		timeZone: string;
	} | null>(null);
	const [nftMetaData, setNftMetaData] = useState<NFTMetadata[] | null>(null);

	// const ReadyConnectors = connectors.filter((r) => r.ready);
	const ReadyConnectors = connectors
		.map((c: any) => ({ ...c, name: String(c.name) }))
		.sort((a: any, b: any) => a.name.localeCompare(b.name));

	const web3RequestMutation = useWeb3Request();
	const web3ValidateMutation = useWeb3Validate();
	const { settings: systemSetting } = useSettingState();

	useEffect(() => {
		if (isWrongChain) {
			switchChain({ chainId });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isConnected, isWrongChain, switchChain]);

	const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const {
		signMessageAsync,
		isLoading: isSigning,
		error: signError,
	} = useSignMessage();

	const handleUserSession = (token: string, timeZone: string): void => {
		localStorage.setItem(
			"5n0wf0rt_u53r_71m3z0n3",
			timeZone || browserTimeZone
		);

		setCookie(AUTH_TOKEN_KEY, token);
		const params = new URLSearchParams(window.location.search);
		const redirect = params.get("redirect") ?? "/overview";
		router.push(redirect);
	};

	const updateAccountMetaDetails = async (
		tokenId: string,
		authToken: string,
		imageUrl: string
	): Promise<boolean> => {
		try {
			setIsFetching(true);
			await utilityUpdateAccount(
				{ meta: { tokenId, imageUrl } },
				authToken
			);
			toast.success("Account meta details updated successfully:");
			return true;
		} catch (error) {
			toast.error("Error updating account meta details:");
			return false;
		} finally {
			setIsFetching(false);
		}
	};

	const handleNftPreview = async (data: any, address: string) => {
		if (
			systemSetting?.token_gating_contract_address_site &&
			address &&
			data?.token
		) {
			try {
				setIsFetching(true);
				const userAccount = await utilityfetchUserAccount(
					data?.token as string
				);

				const nftData = await fetchNFTData(
					systemSetting?.token_gating_contract_address_site,
					address,
					systemSetting?.wallet_connect_id
				);

				// check for if they have nft (aka the pass)
				if (!nftData || nftData?.length < 1) {
					setNoNFTView(true);
					return;
				}

				if (nftData?.length > 0) {
					const tokenExists = nftData.some(
						(nft) => nft.tokenId === userAccount?.meta?.tokenId
					);

					// if theres just one nft in the address
					if (nftData?.length === 1) {
						// if the nft in the address matches the nft on our db
						if (tokenExists) {
							handleUserSession(
								data?.token as string,
								data?.timeZone as string
							);
							return;
						} else {
							const response = await updateAccountMetaDetails(
								nftData?.[0]?.tokenId as string,
								data?.token,
								nftData?.[0]?.image as string
							);

							if (response) {
								handleUserSession(
									data?.token as string,
									data?.timeZone as string
								);
								return;
							}
							return;
						}
					} else {
						setSessionData({
							token: data?.token,
							timeZone: data?.timeZone,
						});
						setNftMetaData(nftData);
						return;
					}
				}
			} catch (error) {
				Logger.error("", { error });
			} finally {
				setIsFetching(false);
			}
		}
	};

	const selectWallet = async (
		selectedConnector: ConnectorProps,
		address: string
	) => {
		if (selectedConnector && address) {
			web3RequestMutation.mutate(
				{ account: address },
				{
					onSuccess: async (response) => {
						const tempToken = response.tempToken.token;
						const message = response.message;

						try {
							const signedMessage = await signMessageAsync({
								message,
								connector: selectedConnector as any,
								account: address as `0x${string}`,
							});

							web3ValidateMutation.mutate(
								{
									signedMessage,
									tempToken,
								},
								{
									onSuccess: async (data) => {
										if (!data.isVerified) {
											if (data?.email) {
												router.push(
													`/signup/verify?${createQueryStrings(
														[
															{
																name: "email",
																value: data?.email,
															},
															{
																name: "token",
																value:
																	data
																		?.tempToken
																		?.token ??
																	"",
															},
															{
																name: "verifyType",
																value: "email",
															},
														]
													)}`
												);
												return;
											}
											router.push(
												`/signup?${createQueryStrings([
													{
														name: "token",
														value:
															data.tempToken
																?.token ?? "",
													},
												])}`
											);
											return;
										}
										if (data.twoFa?.status) {
											router.push(
												`/login/verify?${createQueryStrings(
													[
														{
															name: "token",
															value:
																data?.tempToken
																	?.token ??
																"",
														},
														{
															name: "verifyType",
															value: "2fa",
														},
														{
															name: "type",
															value: data?.twoFa
																.type,
														},
														{
															name: "email",
															value: formData?.email as string,
														},
													]
												)}`
											);
											return;
										}
										handleNftPreview(data, address);
									},
								}
							);
						} catch (error) {
							Logger.error("Error signing the message:", {
								error,
							});
						}
					},
					onError: (res) => {
						if (
							res?.response?.data?.message ===
							"Token required access denied"
						) {
							setNoNFTView(true);
							handleNoNFT(true);
							return;
						}
					},
				}
			);
		}
	};

	const setOriginalConnector = async (
		selected: ConnectorProps
	): Promise<void> => {
		if (activeConnector?.id !== selected?.id) {
			// if (address) {
			await disconnect();
			// }
			setConnector(selected);
			connect(
				{ connector: selected as any },
				{
					onSuccess: (data) => {
						return selectWallet(selected, data.accounts[0]);
					},
					// onSettled:(data) =>{
					// 	return selectWallet(selected, data.accounts[0])
					// }
				}
			);
		} else {
			selectWallet(selected, address);
		}
	};

	const handleRedirect = () => {
		router.push(`/mint`);
	};

	const actionLoading =
		isLoading ||
		web3RequestMutation.isLoading ||
		web3ValidateMutation.isLoading ||
		isSigning ||
		isFetching;

	useEffect(() => {
		if (signError) {
			toast.error(signError?.message);
		}
	}, [signError]);

	// useEffect(() => {
	// 	refetch();
	// }, []);

	// if (settingsLoading) {
	// 	return (
	// 		<CardView className="flex max-h-[348px] flex-col gap-6 !border-lemon-green !p-8 text-white sm:max-w-[448px]">
	// 			<PageLoading color="#ffffff" />
	// 		</CardView>
	// 	);
	// }

	return (
		<>
			{noNFTView ? (
				<NoNewNftView
					isLoading={isLoading || isSigning}
					handleRedirect={handleRedirect}
				/>
			) : nftMetaData && nftMetaData?.length > 0 ? (
				<LoginNFTSelectionForm
					sessionData={sessionData}
					nftMetaData={nftMetaData}
				/>
			) : (
				<CardView className="flex flex-col gap-6 !border-lemon-green !p-4 text-white sm:max-w-[448px] md:!p-8">
					<div className="flex w-full justify-between">
						<h3 className="font-sans text-xl font-bold sm:text-2xl">
							Connect wallet
						</h3>
						<CircleX
							size={24}
							onClick={goBack}
							className="cursor-pointer"
						/>
					</div>
					<div className="w-full">
						{isMobile ? (
							<p className="text-center text-sm">
								By connecting a wallet, you agree to <br />
								<span className="text-lemon-green">
									Terms of Service
								</span>{" "}
								{""}
								and acknowledge that you
								<br /> have read and understand the{" "}
								<span className="text-lemon-green">
									disclaimer
								</span>
								.
							</p>
						) : (
							<p className="text-center text-sm">
								By connecting a wallet, you agree to{" "}
								<span className="text-lemon-green">
									Terms of Service
								</span>{" "}
								{""}
								<br /> and acknowledge that you have read and
								understand <br />
								the{" "}
								<span className="text-lemon-green">
									disclaimer
								</span>
								.
							</p>
						)}
					</div>
					<div className="w-full">
						<WalletConnectorList
							activeConnector={selectedConnector}
							connectors={ReadyConnectors}
							isLoading={actionLoading}
							SelectConnector={setOriginalConnector}
						/>
					</div>

					{selectedConnector && (
						<Button
							fullWidth
							onClick={() =>
								selectWallet(selectedConnector, address)
							}
							disabled={actionLoading}
							className="cursor-pointer touch-manipulation rounded-full "
						>
							{isLoading
								? "Connecting..."
								: web3RequestMutation.isLoading
									? "Requesting..."
									: web3ValidateMutation.isLoading
										? "Validating..."
										: isSigning || isFetching
											? "Signing..."
											: "Continue"}
						</Button>
					)}
				</CardView>
			)}
		</>
	);
};

export default LoginWeb3Connector;
