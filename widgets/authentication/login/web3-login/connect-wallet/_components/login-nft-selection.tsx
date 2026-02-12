"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { NFTMetadata } from "@/lib/types";
import { utilityUpdateAccount } from "@/lib/api/account";
import { toast } from "../../../../../../components/common/toaster";
import { useMediaQuery } from "usehooks-ts";

const ImageSelector = ({
	url,
	selected,
	isMobile,
}: {
	url: string;
	selected?: boolean;
	isMobile: boolean;
}) => {
	return (
		<div
			className={`relative flex h-[200px] w-[120px] justify-center overflow-hidden rounded-[18px] md:h-[259px] md:w-[154px]`}
		>
			<div className="absolute right-2 top-3 cursor-pointer">
				{selected ? (
					<Image
						src={"/icons/nft-select-icon.svg"}
						alt="NFT Select Icon"
						width={24}
						height={24}
					/>
				) : (
					<Image
						src={"/icons/nft-deselect-icon.svg"}
						alt="NFT Deselect Icon"
						width={24}
						height={24}
					/>
				)}
			</div>
			<Image
				src={url || "/images/black-carat-nft.svg"}
				alt="Full View"
				width={isMobile ? 120 : 154}
				height={isMobile ? 200 : 259}
				className="w-full object-cover"
			/>
		</div>
	);
};

const LoginNFTSelectionForm = ({
	sessionData,
	nftMetaData,
}: {
	sessionData: { token: string; timeZone: string } | null;
	nftMetaData: NFTMetadata[] | null;
}): React.JSX.Element => {
	const router = useRouter();
	const [nftDetails, setNftDetails] = useState<NFTMetadata>();
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const isMobile = useMediaQuery("(max-width: 640px)");

	const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const handleUserSession = (): void => {
		localStorage.setItem(
			"5n0wf0rt_u53r_71m3z0n3",
			sessionData?.timeZone || browserTimeZone
		);

		setCookie(AUTH_TOKEN_KEY, sessionData?.token);
		const params = new URLSearchParams(window.location.search);
		const redirect = params.get("redirect") ?? "/overview";
		router.push(redirect);
	};

	const updateAccountMetaDetails = async () => {
		try {
			setIsFetching(true);

			await utilityUpdateAccount(
				{
					meta: {
						tokenId: nftDetails?.tokenId,
						imageUrl: nftDetails?.image,
					},
				},
				sessionData?.token as string
			);

			toast.success("Account meta details updated successfully:");
			handleUserSession();
		} catch (error) {
			toast.error("Error updating account meta details");
		} finally {
			setIsFetching(false);
		}
	};

	const selectNft = (nftDetails: NFTMetadata) => {
		setNftDetails(nftDetails);
	};

	const selectWallet = () => {
		updateAccountMetaDetails();
	};

	return (
		<div className="  flex flex-col gap-6">
			<CardView className="!border-1 flex min-w-[370px] max-w-[370px] flex-col gap-8 !border-lemon-green md:min-w-[600px] md:max-w-[600px]">
				<h5 className="text-center text-2xl font-medium text-white">
					Choose NFT
				</h5>
				<div className="relative w-full max-w-[500px] pb-[30px]">
					<Carousel
						additionalTransfrom={0}
						arrows
						autoPlaySpeed={3000}
						centerMode={false}
						className=""
						containerClass={`container ${nftMetaData && nftMetaData?.length < 3 && !isMobile ? " justify-center" : ""}`}
						dotListClass=""
						draggable
						focusOnSelect={false}
						infinite={false}
						itemClass={isMobile ? " justify-center flex" : ""}
						keyBoardControl
						minimumTouchDrag={80}
						pauseOnHover
						renderArrowsWhenDisabled={false}
						renderButtonGroupOutside={false}
						renderDotsOutside
						responsive={{
							desktop: {
								breakpoint: {
									max: 3000,
									min: 1024,
								},
								items: 3,
								partialVisibilityGutter: 40,
							},
							mobile: {
								breakpoint: {
									max: 464,
									min: 0,
								},
								items: 1,
								partialVisibilityGutter: 0,
							},
							tablet: {
								breakpoint: {
									max: 1024,
									min: 464,
								},
								items: 1,
								partialVisibilityGutter: 0,
							},
						}}
						rewind={false}
						rewindWithAnimation={false}
						rtl={false}
						shouldResetAutoplay
						showDots
						sliderClass="gap-0 md:gap-0 flex"
						slidesToSlide={1}
						swipeable
					>
						{nftMetaData?.map((item, index) => (
							<div
								key={index}
								onClick={() => selectNft(item)}
								className="w-fit"
							>
								<ImageSelector
									url={item?.image}
									selected={
										nftDetails?.tokenId === item?.tokenId
									}
									isMobile={isMobile}
								/>
							</div>
						))}
					</Carousel>
				</div>

				<Button
					fullWidth
					className="cursor-pointer touch-manipulation"
					disabled={!nftDetails?.tokenId || isFetching}
					onClick={selectWallet}
				>
					{isFetching ? "Updating..." : "Continue"}
				</Button>
			</CardView>
		</div>
	);
};

export default LoginNFTSelectionForm;
