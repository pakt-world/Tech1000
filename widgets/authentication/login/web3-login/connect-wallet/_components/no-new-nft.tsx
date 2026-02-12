import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import Image from "next/image";
import React from "react";

interface NoNewNftViewProps {
	isLoading: boolean;
	handleRedirect: () => void;
}
const NoNewNftView = ({ isLoading, handleRedirect }: NoNewNftViewProps) => {
	return (
		<CardView className="flex flex-col justify-center gap-6 !border-lemon-green !p-8 text-white sm:max-w-[600px]">
			<div className="flex w-full justify-center">
				<Image
					src="/images/nft-googles.svg"
					alt="buy nft"
					height={82}
					width={180}
					className="rounded-full"
					priority
				/>
			</div>
			<div className="w-full">
				<h3 className="text-center font-sans text-xl font-bold sm:text-2xl">
					Tech1000 NFT not detected <br />
					in your wallet
				</h3>
			</div>

			<Button
				fullWidth
				disabled={isLoading}
				className="cursor-pointer touch-manipulation rounded-full "
				onClick={handleRedirect}
			>
				Buy NFT
			</Button>
		</CardView>
	);
};

export default NoNewNftView;
