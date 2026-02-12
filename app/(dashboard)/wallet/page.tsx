"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/headless-modal";
import Kyc from "@/components/kyc";
import { useGetWalletDetails, type WalletProps } from "@/lib/api/wallet";
import { formatNumber, formatUsd, getWalletIcon } from "@/lib/utils";
import { WalletBalanceChart } from "@/widgets/wallet/chart";
import { WalletTransactions } from "@/widgets/wallet/transactions/desktop";
import { MobileWalletTransactions } from "@/widgets/wallet/transactions/mobile";
import { AllTokensModal } from "@/widgets/wallet/view-tokens";
import { WithdrawalModal } from "@/widgets/wallet/withdrawal-modal";

export default function WalletPage(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const mobile = useMediaQuery("(max-width: 640px)");
	const router = useRouter();

	const [selectedToken, setSelectedToken] = useState<
		WalletProps | null | undefined
	>(null);
	const [viewTokens, setViewTokens] = useState(false);

	const { data: walletData, refetch: refetchWalletData } =
		useGetWalletDetails();

	const wallets: WalletProps[] = useMemo(
		() => walletData?.data.data.wallets ?? [],
		[walletData]
	);

	const totalWalletBalance: string | number =
		walletData?.data.data.totalBalance ?? 0.0;

	// const { data: rpcData } = useGetActiveRPC();

	// const chainName = rpcData?.rpcName ?? "";

	const loadPage = async (): Promise<void> => {
		await Promise.all([refetchWalletData()]);
	};

	useEffect(() => {
		loadPage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (wallets.length > 0) {
			const sortedCoins = wallets.sort((a, b) => b.usdValue - a.usdValue);
			setSelectedToken(sortedCoins[0]);
		}
	}, [setSelectedToken, wallets]);

	return (
		<div className="flex size-full flex-col overflow-y-auto overflow-x-hidden sm:gap-6">
			<div className="p-4 text-2xl font-bold leading-[31.20px] tracking-wide text-white sm:hidden">
				Earnings
			</div>
			<Kyc />
			<div className="flex h-full flex-col gap-6">
				<div className="flex flex-col max-sm:px-4 sm:grid sm:grid-cols-2 sm:gap-6">
					<div className="flex flex-col items-center gap-4 max-sm:mb-4 sm:grid sm:grid-rows-2 sm:gap-6">
						<div className="flex w-full items-center justify-between gap-2 rounded-lg border border-primary-lighter bg-hover-gradient p-4 text-white sm:px-6 sm:py-8">
							<div className="flex flex-col gap-2">
								<span className="text-sm">
									Total Wallet Balance
								</span>
								<span className="text-2xl font-semibold sm:text-3xl">
									{formatUsd(
										parseFloat(
											totalWalletBalance as string
										) ?? 0.0
									)}
								</span>
							</div>
							<Button
								variant="white"
								onClick={() => {
									if (mobile) {
										router.push("/wallet/withdraw");
									} else {
										setIsOpen(true);
									}
								}}
							>
								Withdraw
							</Button>
							<WithdrawalModal
								isOpen={isOpen}
								onChange={setIsOpen}
								wallets={wallets}
								refetch={() => {
									refetchWalletData();
								}}
							/>
						</div>
						<div className="flex size-full items-center justify-between gap-2 rounded-lg border border-[#A05E03] bg-[#00000099] p-4">
							<div className="flex items-center gap-[22px]">
								<div className="flex flex-col items-center gap-1">
									<Image
										src={getWalletIcon(selectedToken)}
										width={75}
										height={75}
										alt=""
										className="size-[40px] rounded-full sm:size-[75px]"
									/>
									<span className="text-sm text-body">
										{selectedToken?.coin?.toUpperCase()}{" "}
									</span>
								</div>
								<div className="flex flex-col gap-1">
									<div className="flex flex-col gap-1">
										<span className="text-sm text-body">
											Top Token
										</span>
										<span className="text-xl font-semibold text-white sm:text-2xl">
											{formatNumber(
												Number(
													selectedToken?.amount ?? 0
												)
											) ?? "0.00"}
										</span>
									</div>

									<span className="mt-auto text-sm text-white">
										{formatUsd(
											selectedToken?.usdValue ?? 0.0
										)}
									</span>
								</div>
							</div>
							<Button
								className="inline-flex items-center justify-center gap-2 rounded-[10.12px] !border-none !bg-zinc-500 !bg-opacity-50 p-2 text-sm leading-normal tracking-wide text-white hover:!bg-zinc-500 hover:!bg-opacity-100 sm:text-base"
								onClick={() => {
									setViewTokens(true);
								}}
							>
								View all tokens
								<ChevronRight className="relative size-4 sm:size-6" />
							</Button>
						</div>
						<Modal
							isOpen={viewTokens}
							closeModal={() => {
								setViewTokens(false);
							}}
							// disableClickOutside
						>
							<AllTokensModal
								wallets={wallets}
								setSelectedToken={setSelectedToken}
								close={() => {
									setViewTokens(false);
								}}
							/>
						</Modal>
					</div>
					{!mobile && <WalletBalanceChart />}
				</div>
			</div>
			<div className="mt-4 h-auto">
				{mobile ? <MobileWalletTransactions /> : <WalletTransactions />}
			</div>
		</div>
	);
}
