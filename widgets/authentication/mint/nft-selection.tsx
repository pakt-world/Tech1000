"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useEffect, useState } from "react";
import { useSignMessage } from "wagmi";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import { AUTH_TOKEN_KEY, createQueryStrings } from "@/lib/utils";
import { useWeb3Request, useWeb3Validate } from "@/lib/api/auth";
import { toast } from "@/components/common/toaster";
import { NFTMetadata } from "@/lib/types";

const ImageSelector = ({
	url,
	selected,
}: {
	url: string;
	selected?: boolean;
}) => {
	return (
		<div>
			<div className="relative flex h-[259px] w-[154px] justify-center overflow-hidden rounded-[18px]">
				<div className="absolute right-2 top-3 cursor-pointer">
					{selected ? (
						<Image
							src={"/icons/nft-select-icon.svg"}
							alt="NFT Select Icon"
						/>
					) : (
						<Image
							src={"/icons/nft-deselect-icon.svg"}
							alt="NFT Deselect Icon"
						/>
					)}
				</div>
				<Image
					src={url || "/images/black-carat-nft.svg"}
					alt="Full View"
					width={154}
					height={259}
					className="w-full object-cover"
				/>
			</div>
		</div>
	);
};

const NFTSelectionForm = ({
	address,
	nftMetaData,
}: {
	address: string;
	nftMetaData: NFTMetadata[] | null;
}): React.JSX.Element => {
	const router = useRouter();
	const [tokenId, setTokenIdd] = useState<string>("");

	const web3RequestMutation = useWeb3Request();
	const web3ValidateMutation = useWeb3Validate();
	// const { connector: activeConnector } = useAccount();

	const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const {
		signMessageAsync,
		isLoading: isSigning,
		error: signError,
	} = useSignMessage();

	const selectNft = (id: string) => {
		setTokenIdd(id);
	};

	const selectWallet = async () => {
		if (address) {
			web3RequestMutation.mutate(
				{ account: address },
				{
					onSuccess: async (response) => {
						const tempToken = response.tempToken.token;
						const message = response.message;

						try {
							const signedMessage = await signMessageAsync({
								message,
							});

							web3ValidateMutation.mutate(
								{
									signedMessage,
									tempToken,
									tokenId,
								},
								{
									onSuccess: (data) => {
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
															value: data?.email as string,
														},
													]
												)}`
											);
											return;
										}
										localStorage.setItem(
											"5n0wf0rt_u53r_71m3z0n3",
											data.timeZone || browserTimeZone
										);
										setCookie(AUTH_TOKEN_KEY, data?.token);
										const params = new URLSearchParams(
											window.location.search
										);
										const redirect =
											params.get("redirect") ??
											"/overview";
										router.push(redirect);
									},
								}
							);
						} catch (error) {
							console.error("Error signing the message:", error);
						}
					},
					onError: (res) => {
						toast.error(
							res?.response?.data?.message ||
								"Sorry an error occurred"
						);
					},
				}
			);
		}
	};

	useEffect(() => {
		if (signError) {
			toast.error(signError?.message);
		}
	}, [signError]);
	return (
		<div className="  flex flex-col gap-6">
			<CardView className="!border-1 flex min-w-[600px] max-w-[600px] flex-col gap-8 !border-lemon-green">
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
						containerClass={`container ${nftMetaData && nftMetaData?.length < 3 ? " justify-center" : ""}`}
						dotListClass=""
						draggable
						focusOnSelect={false}
						infinite={false}
						itemClass=""
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
								partialVisibilityGutter: 30,
							},
							tablet: {
								breakpoint: {
									max: 1024,
									min: 464,
								},
								items: 3,
								partialVisibilityGutter: 30,
							},
						}}
						rewind={false}
						rewindWithAnimation={false}
						rtl={false}
						shouldResetAutoplay
						showDots
						sliderClass=""
						slidesToSlide={1}
						swipeable
					>
						{nftMetaData?.map((item, index) => (
							<div
								key={index}
								onClick={() => selectNft(item?.tokenId)}
							>
								<ImageSelector
									key={index}
									url={item?.image}
									selected={tokenId === item?.tokenId}
								/>
							</div>
						))}
					</Carousel>
				</div>

				<Button
					fullWidth
					className="cursor-pointer touch-manipulation"
					disabled={!tokenId}
					onClick={selectWallet}
				>
					{web3RequestMutation.isLoading
						? "Requesting..."
						: web3ValidateMutation.isLoading
							? "Validating..."
							: isSigning
								? "Signing..."
								: "Sign In"}
				</Button>
			</CardView>
		</div>
	);
};

export default NFTSelectionForm;
