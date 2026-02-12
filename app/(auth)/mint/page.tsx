"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import MintForm from "@/widgets/authentication/mint/mint";
import NFTSelectionForm from "@/widgets/authentication/mint/nft-selection";
import { NFTMetadata } from "@/lib/types";

export default function MintPage(): JSX.Element {
	const [showMintForm, setShowMintForm] = useState<boolean>(true);
	const [address, setAddress] = useState<string>("");
	const [nftMetaData, setNftMetaData] = useState<NFTMetadata[] | null>(null);
	const completeDataFetch = (data: NFTMetadata[], mintAddress: string) => {
		setShowMintForm(false);
		setAddress(mintAddress);
		setNftMetaData(data);
	};
	return (
		<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
			{showMintForm ? (
				<MintForm completeDataFetch={completeDataFetch} />
			) : (
				<NFTSelectionForm address={address} nftMetaData={nftMetaData} />
			)}
		</div>
	);
}
