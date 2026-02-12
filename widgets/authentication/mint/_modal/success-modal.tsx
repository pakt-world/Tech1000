import React, { ReactElement, useState } from "react";
import Image from "next/image";
import { readContracts } from "@wagmi/core";
import erc721ABI from "@/lib/abi/erc721.json";

import { Modal } from "@/components/common/modal";
import CardView from "@/components/common/card-view";
import { Button } from "@/components/common/button";
import { DialogTitle } from "@/components/common/dialog";
import { NFTMetadata } from "@/lib/types";
import { wagmiConfig } from "@/config/wagmi";
import { useSettingState } from "@/lib/store/settings";
import Logger from "@/lib/utils/logger";

interface MintSuccessModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	contractAddress: string;
	ownerAddress: string;
	completeMintingDataFetch: (data: NFTMetadata[]) => void;
}

export default function MintSuccessModal({
	isOpen,
	onOpenChange,
	contractAddress,
	ownerAddress,
	completeMintingDataFetch,
}: MintSuccessModalProps): ReactElement | null {
	const [isLoading, setIsLoading] = useState(false);
	const { settings } = useSettingState();
	const wagmiConfT = wagmiConfig(String(settings?.wallet_connect_id));

	const fetchNFTData = async () => {
		setIsLoading(true);

		try {
			const balanceResult = await readContracts(wagmiConfT, {
				contracts: [
					{
						address: contractAddress,
						abi: erc721ABI,
						functionName: "balanceOf",
						args: [ownerAddress],
					},
				],
			});

			const balance = Number(balanceResult[0]?.result);

			if (balance < 1) {
				setIsLoading(false);
				return;
			}

			const tokenIds: any = [];

			const tokenIdContracts = Array.from(
				{ length: balance },
				(_, i) => ({
					address: contractAddress,
					abi: erc721ABI,
					functionName: "tokenOfOwnerByIndex",
					args: [ownerAddress, i],
				})
			);

			const tokenIdResults = await readContracts(wagmiConfT, {
				contracts: tokenIdContracts,
			});

			tokenIdResults.forEach((tokenDetail: any, index: number) => {
				if (tokenDetail?.result) {
					tokenIds.push(String(tokenDetail?.result));
				} else {
					Logger.warn(`No token found for index ${index}.`);
				}
			});

			if (tokenIds.length === 0) {
				setIsLoading(false);
				return;
			}

			const tokenURIContracts = tokenIds.map((tokenId: string) => ({
				address: contractAddress,
				abi: erc721ABI,
				functionName: "tokenURI",
				args: [tokenId],
			}));

			const tokenURIResults = await readContracts(wagmiConfT, {
				contracts: tokenURIContracts,
			});

			const fetchedNFTs = await Promise.all(
				tokenURIResults.map(
					async (tokenURIDetails: any, index: number) => {
						if (tokenURIDetails?.result) {
							try {
								const ipfsUrl = tokenURIDetails.result.replace(
									"ipfs://",
									"https://gateway.pinata.cloud/ipfs/"
								);

								const response = await fetch(ipfsUrl);
								const metadata = await response.json();

								const imageURL = metadata?.image;
								let imageSrc = null;
								if (imageURL?.startsWith("ipfs://")) {
									imageSrc = imageURL.replace(
										"ipfs://",
										"https://gateway.pinata.cloud/ipfs/"
									);
								} else {
									imageSrc = imageURL;
								}

								return {
									...metadata,
									tokenId: tokenIds[index],
									image: imageSrc,
								};
							} catch (error) {
								Logger.error(
									`Error fetching metadata for token ${tokenIds[index]}:`,
									{ error }
								);
							}
						}
						return null;
					}
				)
			);
			const finalData = fetchedNFTs.filter((nft) => nft !== null);
			completeMintingDataFetch(finalData);
		} catch (error) {
			Logger.error("Error fetching NFTs:", { error });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={() => onOpenChange(!isOpen)}
			className="max-w-[550px]"
		>
			<div className="relative p-0.5">
				<div className="absolute inset-0 rounded-2xl">
					<div
						className="absolute inset-0 overflow-hidden rounded-[30px] border border-transparent
            before:absolute before:inset-0 before:z-[-1]
            before:rounded-lg before:border-none before:bg-gradient-to-br
            before:from-[#D02D3D] before:via-[#F2C650] before:to-[#D02D3D] before:content-['']"
					/>
				</div>
				<CardView className="relative flex w-full flex-col gap-4 !border border-[#E8E8E81A]/10  !bg-ink-darkest !px-6 !py-8 ">
					<Image
						src={"/icons/success-icon.svg"}
						alt="success icon"
						width={180}
						height={100}
					/>
					<DialogTitle className="font-sans text-sm font-bold text-white sm:text-2xl">
						Mint Successful
					</DialogTitle>

					<Button
						fullWidth
						onClick={fetchNFTData}
						disabled={isLoading}
						className="mt-10 cursor-pointer touch-manipulation rounded-full"
					>
						{isLoading ? "Loading..." : "Continue"}
					</Button>
				</CardView>
			</div>
		</Modal>
	);
}
