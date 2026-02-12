import React, { ReactElement, useEffect, useState } from "react";
import {
	useAccount,
	useConnect,
	useDisconnect,
	useSwitchChain,
	useSimulateContract,
	useWriteContract,
} from "wagmi";
import erc721ABI from "@/lib/abi/erc721.json";
import { parseEther } from "viem";
import { CircleX } from "lucide-react";

import { Modal } from "@/components/common/modal";
import CardView from "@/components/common/card-view";
import { Button } from "@/components/common/button";
import { toast } from "@/components/common/toaster";
import { WalletConnectorList } from "@/widgets/connector-list";
import { DialogTitle } from "@/components/common/dialog";
import Logger from "@/lib/utils/logger";

interface MintModalProps {
	isOpen: boolean;
	chainId: number;
	quantity: number;
	onOpenChange: (isOpen: boolean) => void;
	contractAddress: string;
	completeMinting: (address: string) => void;
	mintPrice: string;
}

interface ConnectorProps {
	id: string;
	name: string;
	ready: boolean;
}

export default function MintModal({
	isOpen,
	chainId,
	quantity,
	onOpenChange,
	contractAddress,
	completeMinting,
	mintPrice,
}: MintModalProps): ReactElement | null {
	const {
		address,
		connector: activeConnector,
		chain: activeChain,
	} = useAccount();
	const { connect, connectors, isLoading } = useConnect();
	const { disconnect } = useDisconnect();
	const { switchChain } = useSwitchChain();
	const amount = String(parseInt(mintPrice) * quantity);
	const stringQuantity = String(quantity);

	const isWrongChain = activeChain?.id
		? parseInt(activeChain.id) !== chainId
		: false;

	const ReadyConnectors = connectors
		.map((c: any) => ({ ...c, name: String(c.name) }))
		.sort((a: any, b: any) => a.name.localeCompare(b.name));

	const [mintLoading, setMintLoading] = useState<boolean>(false);
	const [selectedConnector, setConnector] = useState<ConnectorProps | null>(
		activeConnector || null
	);

	const closeModal = () => {
		onOpenChange(false);
		setMintLoading(false);
	};

	function getFirstSentence(text: any) {
		const firstPeriodIndex = text.indexOf(".");
		if (firstPeriodIndex !== -1) {
			return text.slice(0, firstPeriodIndex + 1);
		}
		return text;
	}

	const {
		data: contractConfig,
		error: prepareError,
		isError: isPrepareError,
		refetch,
		isLoading: preparingLoading,
	} = useSimulateContract({
		address: contractAddress as `0x${string}`,
		abi: erc721ABI,
		functionName: "mint",
		args: [stringQuantity],
		chainId: Number(chainId),
		value: parseEther(amount),
		query: {
			enabled: !!contractAddress && !!address,
			retry: false,
		},
	});

	const {
		writeContract,
		error: writeError,
		isLoading: writeLoading,
	} = useWriteContract({
		...contractConfig,
		mutation: {
			onSuccess: () => {
				toast.success("Minting successful!");
				completeMinting(address);
				setMintLoading(false);
			},
			onError(error: any) {
				toast.error(getFirstSentence(error?.message));
				setMintLoading(false);
			},
		},
	});

	Logger.info("error-->preparing", {
		message: prepareError?.message
			.toString()
			.includes("Not whitelisted or no mints left"),
		preparingLoading,
		isPrepareError,
	});

	const mintNFT = async () => {
		await refetch();
		if (prepareError) {
			toast.error("You are not whitelisted");
			return;
		}
		if (!activeConnector) {
			toast.error("Please connect a wallet first.");
			return;
		}
		if (!contractConfig) {
			toast.error("Contract configuration is missing.");
			return;
		}

		try {
			setMintLoading(true);
			await writeContract(contractConfig.request);
			setMintLoading(true);
		} catch (error: unknown) {
			setMintLoading(false);
			if (error instanceof Error) {
				toast.error(getFirstSentence(error?.message));
			} else {
				toast.error("An unknown error occurred.");
			}
		}
	};

	const setOriginalConnector = async (
		selected: ConnectorProps
	): Promise<void> => {
		if (activeConnector?.id !== selected?.id) {
			if (address) {
				await disconnect();
			}
			await connect(
				{ connector: selected as any },
				{
					onSuccess: () => {
						setConnector(selected);
					},
				}
			);
		}
	};

	useEffect(() => {
		if (isWrongChain) {
			switchChain({ chainId });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isWrongChain, switchChain]);

	useEffect(() => {
		Logger.info("error--->", { err: writeError?.message?.toString() });
		Logger.info("pre->", {
			msg: prepareError?.message.toString(),
			isWrongChain,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prepareError, writeError]);

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={() => onOpenChange(!isOpen)}
			className="max-w-[450px]"
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
				<CardView className="relative flex w-full flex-col gap-4 !border border-[#E8E8E81A]/10  !bg-ink-darkest !p-6">
					<div className="mb-6 flex w-full justify-between text-white">
						<DialogTitle className="font-sans text-xl font-bold sm:text-2xl">
							Connect wallet
						</DialogTitle>
						<CircleX
							size={24}
							onClick={() => closeModal()}
							className="cursor-pointer"
						/>
					</div>

					{selectedConnector && prepareError && (
						<div className=" flex flex-col items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-500 ">
							<span>
								{getFirstSentence(
									String(
										prepareError?.message
											.toString()
											.includes(
												"Not whitelisted or no mints left"
											)
											? "You are not whitelisted!"
											: prepareError?.message?.toString() ||
													prepareError
									)
								) || "An error occurred while minting."}
							</span>
						</div>
					)}
					<div className="mb-2 w-full">
						<WalletConnectorList
							activeConnector={selectedConnector}
							connectors={ReadyConnectors}
							isLoading={isLoading}
							SelectConnector={setOriginalConnector}
						/>
					</div>
					{selectedConnector && (
						<Button
							fullWidth
							onClick={mintNFT}
							disabled={
								isLoading ||
								writeLoading ||
								isPrepareError ||
								preparingLoading
							}
							className="cursor-pointer touch-manipulation rounded-full "
						>
							{preparingLoading
								? "Preparing"
								: isLoading || writeLoading || mintLoading
									? "Processing..."
									: "Continue"}
						</Button>
					)}
				</CardView>
			</div>
		</Modal>
	);
}
