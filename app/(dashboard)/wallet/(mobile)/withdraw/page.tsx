"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "pakt-ui";
import { useMemo, useRef, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useIsClient, useMediaQuery, useOnClickOutside } from "usehooks-ts";
import type * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Checkbox } from "@/components/common/checkbox";
import { InputErrorMessage } from "@/components/common/InputErrorMessage";
import { Spinner } from "@/components/common/loader";
import { toast } from "@/components/common/toaster";
import { useInitiate2FAEmail } from "@/lib/api/2fa";
import { useGetWalletDetails, type WalletProps } from "@/lib/api/wallet";
import { useWithdraw } from "@/lib/api/withdraw";
import { TwoFactorAuthEnums } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { useExchangeRateStore } from "@/lib/store/misc";
import { cn, formatNumberWithCommas, isValidInteger } from "@/lib/utils";
import { withdrawFormSchema } from "@/lib/validations";
import { AllTokensModal } from "@/widgets/wallet/view-tokens";
import { TwoFAInput } from "@/widgets/wallet/withdrawal-modal/2fa-input";
import * as Dialog from "@radix-ui/react-dialog";

type withdrawFormValues = z.infer<typeof withdrawFormSchema>;

export default function WalletWithdrawalPage(): JSX.Element {
	const ref = useRef<HTMLDivElement | null>(null);
	const [is2FA, _setIs2FA] = useState(false);
	const [selectedToken, setSelectedToken] = useState<WalletProps | null>(
		null
	);
	const [viewTokens, setViewTokens] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const tab = useMediaQuery("(min-width: 640px)");
	const isClient = useIsClient();
	const router = useRouter();

	const { twoFa } = useUserState();

	const { data: walletData, refetch: refetchWalletData } =
		useGetWalletDetails();

	const wallets: WalletProps[] = useMemo(
		() => walletData?.data.data.wallets ?? [],
		[walletData]
	);

	const withdraw = useWithdraw();
	const { mutateAsync, isLoading: is2FAEmailInitiateLoading } =
		useInitiate2FAEmail();

	const handleInitiateOtp = async (): Promise<void> => {
		try {
			await mutateAsync();
			// This line will only be reached if mutateAsync succeeds
			_setIs2FA(true);
		} catch (error) {
			// Handle any errors that occur during the mutation
			toast.error(`Error initiating OTP: ${error as string}`);
		}
	};

	const { data: rates } = useExchangeRateStore();

	const coinRate =
		selectedToken?.id &&
		rates?.[selectedToken.id.toLowerCase()] !== undefined
			? rates[selectedToken.id.toLowerCase()]
			: 0;

	const form = useForm<withdrawFormValues>({
		resolver: zodResolver(withdrawFormSchema),
	});

	const clearForm = (): void => {
		form.reset({
			coin: "",
			amount: "",
			address: "",
			password: "",
			confirm: false,
		});
		setSelectedToken(null);
		router.back();
		_setIs2FA(false);
	};

	const finalSubmit = (otp?: string): void => {
		const values = form.getValues();
		const payload = {
			address: values.address,
			amount: Number(values.amount),
			coin: values.coin,
			password: values.password,
			otp,
		};
		withdraw.mutate(payload, {
			onSuccess: () => {
				clearForm();
				setTimeout(() => {
					refetchWalletData();
				}, 2000);
			},
		});
	};

	const onSubmit: SubmitHandler<
		withdrawFormValues
	> = async (): Promise<void> => {
		if (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.AUTHENTICATOR) {
			_setIs2FA(true);
			return;
		}
		if (twoFa?.status && twoFa?.type === TwoFactorAuthEnums.EMAIL) {
			await handleInitiateOtp();
			return;
		}

		finalSubmit();
	};

	const getWalletIcon = (wallet: { icon?: string }): string => {
		return wallet.icon ?? "/icons/usdc-logo.svg";
	};

	const handleClickOutside = (): void => {
		setViewTokens(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	const withdrawalContent = (): JSX.Element => (
		<>
			<div className="flex items-center gap-2 bg-hover-gradient p-4 text-white max-sm:sticky max-sm:top-0 max-sm:z-50 sm:px-4 sm:py-6">
				<button
					className="flex h-10 w-10 items-center justify-center sm:absolute sm:left-[5%] sm:rounded-lg sm:border sm:border-white sm:border-opacity-25 sm:bg-white sm:bg-opacity-90"
					onClick={() => {
						clearForm();
					}}
					type="button"
					aria-label="Close Modal"
				>
					<ChevronLeft
						size={24}
						className="cursor-pointer text-white sm:text-primary"
					/>
				</button>
				<div className="hidden grow flex-col text-center sm:flex">
					<Dialog.Title className="text-2xl font-bold">
						Withdrawal
					</Dialog.Title>
					<p>Withdraw funds to another wallet</p>
				</div>
				<h3 className="text-lg font-bold sm:hidden">Withdrawal</h3>
			</div>
			{!is2FA ? (
				<form
					className="flex flex-col gap-6 px-6 max-sm:pb-8 max-sm:pt-4"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="relative" ref={ref}>
						<span className="text-white">Select Asset</span>
						<div
							className="mt-3 inline-flex h-14 w-full cursor-pointer items-center justify-between rounded-2xl border-2 border-gray-200 border-opacity-20 p-4 pr-0"
							onMouseDown={() => {
								setViewTokens(!viewTokens);
							}}
							tabIndex={0}
							role="button"
						>
							{selectedToken ? (
								<div className="flex h-[39px] shrink grow basis-0 items-center justify-between pr-2">
									<div className="flex items-center justify-center gap-4">
										<Image
											className="h-6 w-[26px] rounded-[100px]"
											src={getWalletIcon(selectedToken)}
											height={26}
											width={26}
											alt={selectedToken?.coin}
										/>
										<p className="text-base leading-normal tracking-tight text-gray-100">
											{selectedToken?.coin?.toUpperCase()}
										</p>
									</div>
									<div className="inline-flex flex-col items-end justify-start">
										<p className="text-md leading-[21px] tracking-tight text-gray-100 text-opacity-70">
											{formatNumberWithCommas(
												selectedToken?.amount
											) ?? "0"}
										</p>
										<p className="text-sm leading-[18px] tracking-tight text-gray-100 text-opacity-50">
											$
											{formatNumberWithCommas(
												selectedToken?.usdValue.toFixed(
													2
												)
											) ?? "0.00"}
										</p>
									</div>
								</div>
							) : (
								<span className="w-full grow text-white opacity-30">
									Choose Asset...
								</span>
							)}
							<div className="h-[52px] w-px bg-gray-200 bg-opacity-20" />
							<Button
								type="button"
								variant="ghost"
								className="flex !w-[67px] items-center justify-center !border-none !bg-transparent p-4 text-white"
								onClick={() => {}}
							>
								<ChevronDown className="h-6 w-6 shrink-0 text-white opacity-50" />
							</Button>
						</div>
						<div
							className={`absolute left-0 top-0 z-[100] w-full translate-y-[20%] ${cn(
								viewTokens ? "block" : "hidden"
							)}`}
						>
							<AllTokensModal
								wallets={wallets}
								setSelectedToken={(wlt) => {
									setSelectedToken(wlt);
									form.setValue("coin", wlt.id as string);
									form.setValue("amount", "");
								}}
								close={() => {
									setViewTokens(false);
								}}
								className="max-w-full"
								noClose
								noTitle
							/>
						</div>
					</div>

					<div className="relative">
						<Controller
							name="amount"
							control={form.control}
							render={({ field: { onChange: onC, value } }) => {
								const valueInUsd =
									Number(value ?? 0) * (coinRate ?? 0); // Provide a default value of 0 if coinRate is undefined
								const handleMax = (): void => {
									const max = selectedToken?.amount ?? 0;
									onC(max);
								};
								return (
									<div className="input-style relative flex items-center pl-4">
										<div className="flex grow items-center pr-2">
											{selectedToken && (
												<Image
													className="h-6 w-[26px] rounded-[100px]"
													src={getWalletIcon(
														selectedToken
													)}
													height={26}
													width={26}
													alt={selectedToken?.coin}
												/>
											)}
											<input
												type="text"
												value={value}
												onChange={(e) => {
													// Update the value only if the input is a number
													const v = e.target.value;
													if (
														// @ts-expect-error --- This is meant to be a number by default
														// eslint-disable-next-line no-restricted-globals
														!isNaN(v) &&
														v.trim() !== ""
													) {
														onC(v);
													} else {
														onC("");
													}
													if (
														Number(
															selectedToken?.amount
														) <
														Number(
															form.getValues()
																.amount
														)
													) {
														setDisabled(true);
													} else {
														setDisabled(false);
													}
													if (
														isValidInteger(v) ||
														v === ""
													) {
														setDisabled(true);
													} else {
														setDisabled(false);
													}
												}}
												placeholder="Enter amount to withdraw"
												className="w-full grow !border-none bg-transparent px-4 text-white focus:outline-none"
												autoCorrect="off"
												autoComplete="off"
												spellCheck="false"
											/>
											<p className="text-[15px] font-medium tracking-tight text-gray-500">
												$
												{formatNumberWithCommas(
													valueInUsd
												)}
											</p>
										</div>
										<div className="h-[52px] w-px bg-gray-200 bg-opacity-20" />
										<Button
											type="button"
											variant="ghost"
											className="justsify-center flex !w-[67px] items-center !border-none !bg-transparent p-4 text-white"
											onClick={() => {
												handleMax();
											}}
										>
											MAX
										</Button>
									</div>
								);
							}}
						/>
						<InputErrorMessage
							message={form.formState.errors.amount?.message}
						/>
						{disabled && (
							<InputErrorMessage message="Insufficient balance" />
						)}
						<p className="mt-4 text-left text-sm text-info">
							Dollar value amount of tokens is representative of
							the conversion rate at this moment.
						</p>
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<span className="text-white">
								Recipient Wallet Address
							</span>
						</div>

						<div className="relative">
							<Input
								type="text"
								{...form.register("address")}
								className="input-style !text-white placeholder:opacity-30"
								placeholder="Enter address you're sending to"
							/>
							<InputErrorMessage
								message={form.formState.errors.address?.message}
							/>
						</div>

						<span className="text-left text-sm text-info">
							Ensure you’re sending to Avax C-Chain. Sending to a
							wrong network would result in loss of funds
						</span>
					</div>

					<div className="relative">
						<Input
							type="password"
							label="Password"
							className="input-style !text-white placeholder:opacity-30"
							placeholder="Enter account Password"
							{...form.register("password")}
						/>
						<InputErrorMessage
							message={form.formState.errors.password?.message}
						/>
					</div>

					<div className="relative my-2 flex cursor-pointer flex-col">
						<div className="flex flex-row gap-2">
							<Controller
								name="confirm"
								control={form.control}
								render={({
									field: { onChange: change, value },
								}) => (
									<Checkbox
										id="confirm-withdrawal"
										{...form.register("confirm")}
										checked={value}
										onCheckedChange={change}
										className="checkbox_style"
									/>
								)}
							/>
							<label
								htmlFor="confirm-withdrawal"
								className="cursor-pointer text-sm"
							>
								I confirm that all the above details are
								correct.
							</label>
						</div>

						<InputErrorMessage
							message={form.formState.errors.confirm?.message}
						/>
					</div>

					<Button
						disabled={
							withdraw.isLoading ||
							!form.formState.isValid ||
							disabled
						}
						fullWidth
						variant="white"
					>
						{withdraw.isLoading || is2FAEmailInitiateLoading ? (
							<Spinner />
						) : (
							"Withdraw Funds"
						)}
					</Button>
				</form>
			) : (
				<TwoFAInput
					isLoading={withdraw.isLoading}
					onComplete={finalSubmit}
					type={twoFa?.type}
					close={() => {
						_setIs2FA(false);
					}}
				/>
			)}
		</>
	);

	return (
		isClient &&
		!tab && (
			<div className="z-[999] h-full gap-6 overflow-y-auto bg-primary">
				{withdrawalContent()}
			</div>
		)
	);
}
