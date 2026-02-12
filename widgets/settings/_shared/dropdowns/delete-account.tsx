"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { ChevronDown, ChevronLeft, ChevronRight, InfoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "pakt-ui";
import { type ReactElement, useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Checkbox } from "@/components/common/checkbox";
import { Spinner } from "@/components/common/loader";
import { Modal } from "@/components/common/modal";
import { useDeleteAccount } from "@/lib/api/account";
import { useGetWalletDetails } from "@/lib/api/wallet";
import { AUTH_TOKEN_KEY, formatNumberWithCommas } from "@/lib/utils";
import { deleteAccountSchema } from "@/lib/validations";
import CardView from "@/components/common/card-view";

type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

const DeleteAccount = (): ReactElement => {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 640px)");

	const [showDelete, setShowDelete] = useState(false);
	const [passwordModal, setPasswordModal] = useState(false);
	const [showBackupModal, setShowBackupModal] = useState(false);

	const { data: walletData } = useGetWalletDetails();

	const totalWalletBalance: number | string =
		walletData?.data.data.totalBalance ?? 0.0;

	const deleteAccount = useDeleteAccount();

	const queryClient = useQueryClient();

	const form = useForm<DeleteAccountFormValues>({
		resolver: zodResolver(deleteAccountSchema),
		reValidateMode: "onBlur",
		defaultValues: {
			confirm: false,
			password: "",
			irreversible: false,
		},
	});

	const onSubmit: SubmitHandler<DeleteAccountFormValues> = (values) => {
		deleteAccount.mutate(
			{
				password: values.password,
			},
			{
				onSuccess: () => {
					form.reset({
						confirm: false,
						password: "",
						irreversible: false,
					});
					setPasswordModal(false);
					deleteCookie(AUTH_TOKEN_KEY);
					queryClient.clear();
					router.push("/login");
				},
			}
		);
	};

	useEffect(() => {
		if (isMobile) setShowDelete(true);
	}, [isMobile]);
	return (
		<>
			<form className="" onSubmit={form.handleSubmit(onSubmit)}>
				<div
					className={`relative overflow-hidden sm:rounded-lg ${showDelete ? "h-[400px] sm:h-[350px]" : "h-[86px]"} transition-all duration-300`}
				>
					<CardView className="flex !h-fit flex-col gap-6 !p-6 ">
						<div
							className="relative z-50 flex w-full cursor-pointer flex-row items-center justify-between"
							onClick={() => {
								if (!isMobile) {
									setShowDelete(!showDelete);
								} else {
									router.back();
								}
							}}
							role="button"
							onKeyDown={(e) => {
								if (!isMobile) {
									if (e.key === "Enter" || e.key === " ") {
										setShowDelete(!showDelete);
									}
								} else {
									router.back();
								}
							}}
							tabIndex={0}
						>
							{isMobile && <ChevronLeft className="text-white" />}
							<p className="text-lg font-bold text-white">
								Delete Account
							</p>
							{!isMobile &&
								(showDelete ? (
									<ChevronDown className="text-white" />
								) : (
									<ChevronRight className="text-white" />
								))}
						</div>

						<CardView
							className={` ${showDelete ? "flex" : "hidden"} my-4 flex w-full flex-col gap-4 sm:!p-4`}
						>
							<div className="bg-yellow/200 flex w-full flex-row gap-4 rounded-lg sm:p-4">
								<InfoIcon
									size={40}
									className="text-red-700 max-sm:w-[9%]"
								/>
								<div className="max-sm:w-[90%]">
									<p className="text-base font-bold text-white">
										You’re Deleting Your Account
									</p>
									<p className="text-sm font-thin leading-5 text-white">
										Deleting your account will permanently
										remove all data associated with it,
										including projects, APIs, and analytics.
										This action cannot be undone. Please
										make sure you have downloaded any
										necessary data or backups before
										proceeding with account deletion.
									</p>
								</div>
							</div>
							<div className="flex w-full flex-row items-center justify-between gap-4 px-4">
								<div className="flex items-center gap-4 text-sm text-white sm:text-base">
									<Controller
										name="confirm"
										control={form.control}
										render={({
											field: { onChange: change, value },
										}) => (
											<Checkbox
												id="confirm"
												{...form.register("confirm")}
												checked={value}
												onCheckedChange={change}
												className="checkbox_style"
											/>
										)}
									/>
									I confirm my account deletion
								</div>
								<Button
									variant="destructive"
									disabled={!form.watch("confirm")}
									onClick={() => {
										if (
											(totalWalletBalance as number) > 0
										) {
											setShowBackupModal(true);
										} else {
											setPasswordModal(true);
										}
									}}
									type="button"
								>
									Delete
								</Button>
							</div>
						</CardView>
					</CardView>
				</div>
				<Modal
					isOpen={passwordModal}
					onOpenChange={() => {
						setPasswordModal(!passwordModal);
						form.reset({
							confirm: false,
							password: "",
							irreversible: false,
						});
					}}
					className=" h-fit !overflow-hidden rounded-2xl p-6"
					// disableClickOutside
				>
					<CardView className="w-full !bg-ink-dark !p-6">
						<div className="flex w-full flex-col items-center justify-center">
							<div className="flex w-full flex-col items-center justify-center gap-2">
								<Dialog.Title className="text-center text-2xl font-bold leading-loose tracking-wide text-white">
									Delete Account
								</Dialog.Title>
								<p className="text-center text-base leading-normal tracking-tight text-neutral-200">
									Please enter your password to confirm
									account deletion.
								</p>
							</div>
							<Input
								{...form.register("password")}
								type="password"
								className="input-style my-6 w-full"
								placeholder="Enter password"
							/>
							<div className="flex items-center gap-4 text-sm text-white">
								<Controller
									name="irreversible"
									control={form.control}
									render={({
										field: { onChange: change, value },
									}) => (
										<Checkbox
											id="irreversible"
											{...form.register("irreversible")}
											checked={value}
											onCheckedChange={change}
											className="checkbox_style"
										/>
									)}
								/>
								I understand that this action is irreversible
							</div>
							<div className="mt-8 flex items-center gap-4">
								<Button
									className="rounded-3xl"
									variant="outline"
									size="sm"
									onClick={() => {
										setPasswordModal(false);
										form.reset({
											confirm: false,
											password: "",
											irreversible: false,
										});
									}}
									type="button"
								>
									No, Cancel
								</Button>
								<Button
									className="text-md rounded-3xl"
									variant="default"
									size="sm"
									type="submit"
									disabled={
										form.formState.isSubmitting ||
										!form.formState.isValid ||
										deleteAccount.isLoading
									}
									onClick={() => {
										onSubmit(form.getValues());
									}}
								>
									{deleteAccount.isLoading ? (
										<Spinner size={18} />
									) : (
										"Yes, Delete"
									)}
								</Button>
							</div>
						</div>
					</CardView>
				</Modal>
			</form>
			<Modal
				isOpen={showBackupModal}
				onOpenChange={() => {
					setShowBackupModal(!showBackupModal);
				}}
				className="h-fit !overflow-hidden rounded-2xl p-6"
				// disableClickOutside
			>
				<CardView className="w-full !bg-ink-dark p-8">
					<div className="flex w-full flex-col items-center justify-center gap-6">
						<div className="flex w-full flex-col items-center justify-center gap-2">
							<h3 className="text-center text-2xl font-bold leading-loose tracking-wide text-white">
								Withdraw Funds!
							</h3>
							<p className="text-center text-base leading-normal tracking-tight text-neutral-200">
								You still have tokens in your wallet. Please
								withdraw all value <br />
								before deleting your account.
							</p>
						</div>
						<div className="inline-flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-[#a05e03] bg-black bg-opacity-60 p-4">
							<h3 className="text-2xl font-bold leading-loose tracking-wide text-white">
								$
								{formatNumberWithCommas(
									(totalWalletBalance as number).toFixed(2)
								)}
							</h3>

							<p className="text-lg leading-relaxed tracking-wide text-neutral-200">
								Total Wallet Balance
							</p>
						</div>

						<Button
							variant="default"
							type="submit"
							className="w-full rounded-3xl"
							size="sm"
							onClick={() => {
								setShowBackupModal(false);
							}}
							asChild
						>
							<Link href="/wallet">Go To Wallet</Link>
						</Button>
					</div>
				</CardView>
			</Modal>
		</>
	);
};

export default DeleteAccount;
