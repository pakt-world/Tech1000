import { readContracts } from "@wagmi/core";
import erc721ABI from "@/lib/abi/erc721.json";
import { wagmiConfig } from "@/config/wagmi";
import { NFTMetadata } from "@/lib/types";
import Logger from "@/lib/utils/logger";

export const fetchNFTData = async (
	contractAddress: string,
	ownerAddress: string,
	walletConnectId: string
): Promise<NFTMetadata[]> => {
	const wagmiConfigP = wagmiConfig(String(walletConnectId));

	try {
		// Fetch balance of NFTs
		const balanceResult = await readContracts(wagmiConfigP, {
			contracts: [
				{
					address: contractAddress as `0x${string}`,
					abi: erc721ABI,
					functionName: "balanceOf",
					args: [ownerAddress],
				},
			],
		});

		const balance = Number(balanceResult[0]?.result);

		// If no NFTs, return empty array
		if (balance < 1) {
			return [];
		}

		// Fetch token IDs
		let tokenIds: any = [];
		const tokenIdContracts = Array.from({ length: balance }, (_, i) => ({
			address: contractAddress as `0x${string}`,
			abi: erc721ABI,
			functionName: "tokenOfOwnerByIndex",
			args: [ownerAddress, i],
		}));

		const tokenIdResults = await readContracts(wagmiConfigP, {
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
			return [];
		}

		// Fetch token URIs
		const tokenURIContracts = tokenIds.map((tokenId: string) => ({
			address: contractAddress as `0x${string}`,
			abi: erc721ABI,
			functionName: "tokenURI",
			args: [tokenId],
		}));

		const tokenURIResults = await readContracts(wagmiConfigP, {
			contracts: tokenURIContracts,
		});

		// Fetch metadata for each NFT and extract image
		const fetchedNFTs = await Promise.all(
			tokenURIResults.map(async (tokenURIDetails: any, index: number) => {
				if (tokenURIDetails?.result) {
					try {
						const ipfsUrl = tokenURIDetails.result.replace(
							"ipfs://",
							"https://gateway.pinata.cloud/ipfs/"
						);

						const response = await fetch(ipfsUrl);
						const metadata = await response.json();

						// Handle IPFS image links
						const imageURL = metadata?.image;
						let imageSrc: string | null = null;
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
			})
		);

		// Filter out any null values and return the final data
		return fetchedNFTs.filter((nft): nft is NFTMetadata => nft !== null);
	} catch (error) {
		Logger.error("Error fetching NFTs:", { error });
		return [];
	}
};
