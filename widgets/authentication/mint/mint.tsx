"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { MouseEventHandler, useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import CardView from "../../../components/common/card-view";
import { useProductVariables } from "@/hooks/use-product-variables";
import { Modal } from "../../../components/common/modal";
import MintModal from "./_modal/mint-modal";
import { PageLoading } from "@/components/common/page-loading";
import MintSuccessModal from "./_modal/success-modal";
import { NFTMetadata } from "@/lib/types";
import erc721ABI from "@/lib/abi/erc721.json";
import { useSettingState } from "@/lib/store/settings";

interface MintFormProps {
	completeDataFetch: (data: NFTMetadata[], mintAddress: string) => void;
}

const MintForm = ({ completeDataFetch }: MintFormProps): React.JSX.Element => {
	const { variables } = useProductVariables();

	const [quantity, setQuantity] = useState(1);
	const [url, setUrl] = useState<string>("");
	const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
	const [openMintModal, setOpenMintModal] = useState<boolean>(false);
	const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
	const [mintAddress, setMintAddress] = useState<string>("");
	const [mintRemaining, setMintRemaining] = useState<number>(0);
	const totalMint = 1000;

	const { settings: systemSetting } = useSettingState();

	const contractAddress = String(
		systemSetting?.token_gating_contract_address_site
	);
	const mintPrice = String(systemSetting?.token_contract_amount || "2");

	function checkNumberInRange(value: number, min: number, max: number) {
		if (value >= min && value <= max) {
			return "within";
		} else if (value < min) {
			return "above";
		}
		return "below";
	}

	const increaseQuantity = () => {
		if (mintRemaining === quantity) return;
		setQuantity((prevQuantity) => prevQuantity + 1);
	};

	const decreaseQuantity = () => {
		setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
	};

	const viewImage = (e: string) => {
		setUrl(e);
		setIsImageModalOpen(true);
	};

	const closeImageModal: MouseEventHandler<HTMLButtonElement> = (e) => {
		e?.stopPropagation();
		setIsImageModalOpen(false);
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsImageModalOpen(false);
	};

	const mintToken = () => {
		setOpenMintModal(true);
	};

	const nftOptions = [
		{
			title: "Obsidian Dog Tag",
			options: [
				{
					title: "Onyx (#11 -25)",
					image: "/images/black-obsidian-nft.svg",
					borderColor: "border-[#000000]",
					min: 11,
					max: 25,
				},
				{
					title: "Royal (#26 -50)",
					image: "/images/blue-obsidian-nft.svg",
					borderColor: "border-[#000000]",
					min: 26,
					max: 50,
				},
				{
					title: "Forest (#51 -75)",
					image: "/images/green-obsidian-nft.svg",
					borderColor: "border-[#000000]",
					min: 51,
					max: 75,
				},
				{
					title: "Crimson (#76 -100)",
					image: "/images/wine-obsidian-nft.svg",
					borderColor: "border-[#000000]",
					min: 76,
					max: 100,
				},
			],
		},
		{
			title: "24k Carat Dog Tag",
			options: [
				{
					title: "Onyx (#101 -200)",
					image: "/images/black-carat-nft.svg",
					borderColor: "border-[#B39806]",
					min: 101,
					max: 200,
				},
				{
					title: "Royal (#201 -300)",
					image: "/images/blue-carat-nft.svg",
					borderColor: "border-[#B39806]",
					min: 201,
					max: 300,
				},
				{
					title: "Forest (#301 -400)",
					image: "/images/green-carat-nft.svg",
					borderColor: "border-[#B39806]",
					min: 301,
					max: 400,
				},
				{
					title: "Crimson (#401 -500)",
					image: "/images/wine-carat-nft.svg",
					borderColor: "border-[#B39806]",
					min: 401,
					max: 500,
				},
			],
		},
		{
			title: "Silver Dog Tag",
			options: [
				{
					title: "Onyx (#501 -600)",
					image: "/images/black-dog-nft.svg",
					borderColor: "border-[#C0C0C0]",
					min: 501,
					max: 600,
				},
				{
					title: "Royal (#601 -700)",
					image: "/images/blue-dog-nft.svg",
					borderColor: "border-[#C0C0C0]",
					min: 601,
					max: 700,
				},
				{
					title: "Forest (#701 -800)",
					image: "/images/green-dog-nft.svg",
					borderColor: "border-[#C0C0C0]",
					min: 701,
					max: 800,
				},
				{
					title: "Crimson (#801 -900)",
					image: "/images/wine-dog-nft.svg",
					borderColor: "border-[#C0C0C0]",
					min: 801,
					max: 900,
				},
				{
					title: "Canary (#901 -1000)",
					image: "/images/gold-dog-nft.svg",
					borderColor: "border-[#C0C0C0]",
					min: 901,
					max: 1000,
				},
			],
		},
	];

	const { data, isLoading } = useReadContract({
		address: contractAddress as `0x${string}`,
		abi: erc721ABI,
		functionName: "totalSupply",
		args: [],
		query: {
			enabled: !!contractAddress,
		},
	});

	const completeMinting = (address: string) => {
		setMintAddress(address);
		setOpenMintModal(false);
		setShowSuccessModal(true);
	};

	const completeMintingDataFetch = (data: NFTMetadata[]) => {
		setShowSuccessModal(false);
		completeDataFetch(data, mintAddress);
	};

	useEffect(() => {
		if (data) {
			setMintRemaining(totalMint - parseInt(String(data)));
		}
	}, [data]);
	return (
		<>
			<div className="flex flex-col gap-6 max-sm:w-full">
				<CardView className="!border-1 flex h-full w-full gap-0 !border-lemon-green !p-0 sm:max-w-[883px] md:min-h-[636px] md:min-w-[883px]">
					<div className="h-full w-full justify-center rounded-r-[30px] !p-4">
						{isLoading ? (
							<div className="m-auto flex h-full max-h-[576px] items-center justify-center">
								<PageLoading color="#ffffff" />
							</div>
						) : (
							<>
								<div className="m-auto mt-6 flex w-[258px] flex-col items-center justify-center gap-4">
									<Image
										src={variables?.LOGO || ""}
										alt="Logo"
										width={258}
										height={80}
										priority
									/>
									<p className="text-center font-circular text-sm tracking-widest text-white">
										For builders who believe in Tech
									</p>
								</div>
								<div className="mt-8 flex flex-col items-center justify-center gap-4">
									<h2 className="font-mono text-xl font-semibold text-lemon-green">
										Platform Access NFT
									</h2>
									<div className=" mt-4 flex w-full flex-col gap-4">
										<div className="flex w-full items-center justify-between rounded-[16px] border-[0.5px] border-lemon-green bg-[#FFFFFF1A] p-4 text-white">
											Remaining
											<p className="font-mono text-xl font-medium">
												{mintRemaining}/{totalMint}
											</p>
										</div>
										<div className="flex flex-col gap-4">
											<div className="flex w-full items-center justify-between rounded-[16px] border-[0.5px] border-lemon-green bg-[#FFFFFF1A] p-4 text-white">
												Quantity
												<div className="flex items-center space-x-4 rounded-lg bg-[#FCFCFD1A] px-2 font-mono text-lg font-medium">
													<button
														className=""
														onClick={
															decreaseQuantity
														}
													>
														-
													</button>
													<span>{quantity}</span>
													<button
														className=""
														onClick={
															increaseQuantity
														}
													>
														+
													</button>
												</div>
											</div>
											{/* <div className="">
												<p className="text-center font-circular text-sm font-medium italic text-[#FFFFFFCC]">
													Whitelist addresses can only
													mint a max of 10 NFTs
												</p>
											</div> */}
										</div>
										<div className="flex w-full items-center justify-between rounded-[16px] border-[0.5px] border-lemon-green bg-[#FFFFFF1A] p-4 text-white">
											Price
											<div className="flex rounded-xl bg-[#A4F38233] px-2 py-[2px] font-mono text-sm font-medium">
												{parseInt(mintPrice) * quantity}{" "}
												<Image
													src={
														"/images/avax-logo.svg"
													}
													className="mx-0.5"
													alt="AVAX Logo"
													width={14}
													height={14}
												/>{" "}
												AVAX
											</div>
										</div>
									</div>
									<div className="mt-4">
										<p className="font-circular text-sm text-[#FFFFFFCC]">
											{" "}
											Dog Tags mint in numeric order.{" "}
											<br />
											Minted tranches are greyed out.
										</p>
									</div>
									<div className="mt-4 w-full">
										<Button
											fullWidth
											className="w-full cursor-pointer touch-manipulation"
											onClick={mintToken}
											disabled={
												isLoading || mintRemaining === 0
											}
										>
											Mint
										</Button>
									</div>
								</div>
							</>
						)}
					</div>
					<div className="hidden h-full min-w-[492px] flex-col gap-8 rounded-r-[30px] bg-[#00000066] !p-4 text-white md:flex">
						{nftOptions.map((item, index) => (
							<div className="flex flex-col gap-3" key={index}>
								<div className="flex items-center justify-between">
									<h2 className="text-lg font-medium">
										{item.title}
									</h2>

									{index === 0 && (
										<p className="font-circular text-xs text-[#FFFFFFCC]">
											{" "}
											Click images to preview
										</p>
									)}
								</div>
								<div className="grid grid-cols-2 gap-4">
									{item.options.map((itm, index) => {
										const currentNumber =
											totalMint - mintRemaining + 1;
										const type = checkNumberInRange(
											currentNumber,
											itm?.min,
											itm?.max
										);
										return (
											<div
												className={`col-span-1 flex h-[45px] w-full cursor-pointer rounded-full border bg-[#FCFCFD1A] ${type === "within" ? "border-lemon-green" : type === "below" ? `${itm?.borderColor} cursor-not-allowed opacity-40` : itm?.borderColor}`}
												key={index}
												onClick={() =>
													type === "below"
														? {}
														: viewImage(itm?.image)
												}
											>
												<Image
													src={itm?.image}
													alt="Logo"
													width={31}
													height={41}
													className="ml-5"
													priority
												/>
												<p className="ml-2 flex items-center text-base">
													{itm?.title}
												</p>
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>
				</CardView>
			</div>
			<Modal
				isOpen={isImageModalOpen}
				//@ts-ignore
				onOpenChange={closeImageModal}
				className="md:min-w-[806px]"
				handleOverlayClick={handleOverlayClick}
			>
				<CardView className="relative flex w-full flex-col gap-4 !border border-[#E8E8E81A]/10 !bg-ink-darkest/90 !p-6  ">
					<div className=" flex w-full cursor-pointer justify-between">
						<h3 className="text-2xl font-bold text-white">
							Nft Preview
						</h3>
						<Button
							type="button"
							variant={"outline"}
							onClick={(e) => closeImageModal(e)}
							className="rounded-full !py-1"
						>
							Close
						</Button>
					</div>
					<div className="flex h-[500px] w-[300px] justify-center overflow-hidden rounded-[31px]">
						<Image
							src={url}
							alt="Full View"
							width={750}
							height={400}
							className="w-full object-cover"
						/>
					</div>
				</CardView>
			</Modal>
			<MintModal
				isOpen={openMintModal}
				mintPrice={mintPrice}
				chainId={parseInt(String(systemSetting?.rpc?.rpcChainId))}
				quantity={quantity}
				contractAddress={String(
					systemSetting?.token_gating_contract_address_site
				)}
				onOpenChange={(e) => setOpenMintModal(e)}
				completeMinting={completeMinting}
			/>
			<MintSuccessModal
				isOpen={showSuccessModal}
				contractAddress={contractAddress}
				ownerAddress={mintAddress}
				onOpenChange={(e) => setShowSuccessModal(e)}
				completeMintingDataFetch={completeMintingDataFetch}
			/>
		</>
	);
};

export default MintForm;
