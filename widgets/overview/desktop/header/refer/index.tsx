"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { type z } from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { useGetReferral, useSendReferralInvite } from "@/lib/api/referral";
import { CopyText, formatDateHandler } from "@/lib/utils";
import { referralSchema } from "@/lib/validations";
import email from "@/lottiefiles/email.json";

import { Spinner } from "../../../../../components/common/loader";
import { TagInput2 } from "../../../../../components/common/tag-input";
import { DesktopSheetWrapper } from "../../../../bounties/desktop/sheets/wrapper";
import RecentReferral from "./recent-referrals";
import { useProductVariables } from "@/hooks/use-product-variables";
import Lottie from "@/components/common/lottie";

interface ReferralModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

interface ReferralDataProps {
	referral: {
		_id: string;
		firstName: string;
		lastName: string;
		profile: { bio: { title: string } };
		score: number;
		profileImage: { url: string };
	};
	createdAt: string;
}

type LoginFormValues = z.infer<typeof referralSchema>;

export function ReferralSideModal({
	isOpen,
	onOpenChange,
}: ReferralModalProps): React.ReactElement {
	const [isSentEmail, setIsSentEmail] = useState(false);
	const { data } = useGetReferral({ page: 1, limit: 5, filter: {} });
	const sendInvite = useSendReferralInvite();

	const { variables } = useProductVariables();

	const referralLink = data?.stats.referralLink;
	const recentReferrals = useMemo(
		() =>
			(data?.referrals?.data ?? []).map((u: ReferralDataProps) => ({
				_id: u?.referral?._id ?? "",
				name: `${u?.referral?.firstName} ${u?.referral?.lastName}`,
				title: u?.referral?.profile?.bio?.title ?? "",
				score: u?.referral?.score,
				image: u?.referral?.profileImage?.url,
				dated: formatDateHandler(u?.createdAt, "DD/MM/YYYY"),
			})),
		[data]
	);

	const rm = data?.referrals?.referralMessage as string;

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(referralSchema),
	});

	const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
		const d = await sendInvite.mutateAsync(values);
		if (d) {
			setIsSentEmail(true);
		}
		form.resetField("emails");
	};

	const copyLink = async (): Promise<void> => CopyText(String(referralLink));

	return (
		<DesktopSheetWrapper
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			className="flex flex-col"
		>
			<h3 className="flex flex-row gap-4 bg-hover-gradient p-6 text-2xl font-bold text-white">
				Refer User
			</h3>
			{!isSentEmail ? (
				<div className="container_style flex h-full flex-col gap-2 p-6">
					<h3 className="text-2xl font-semibold text-white">
						Invite your friends, increase your{" "}
						{variables?.SCORE_LABEL}
					</h3>
					<p className="text-base text-sky">{rm}</p>
					<div className="container_style my-4 w-full rounded-2xl p-4">
						<h3 className="text-lg font-bold text-white">
							Email Invite
						</h3>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="relative my-4 flex w-full flex-col"
						>
							<div className="input-style rounded-2xl p-1 !text-white">
								<Controller
									name="emails"
									control={form.control}
									render={({
										field: { onChange, value = [] },
									}) => (
										<TagInput2
											tags={value}
											setTags={onChange}
											className="items-start border-none !bg-transparent"
											placeholder="Send invite email to friends"
										/>
									)}
								/>
							</div>
							<div className="mr-0 mt-4 flex w-full ">
								<Button
									className="min-h-[50px]"
									variant="white"
									disabled={
										!form.formState.isValid ||
										sendInvite.isLoading
									}
									fullWidth
								>
									{sendInvite.isLoading ? (
										<Spinner />
									) : (
										"Send"
									)}
								</Button>
							</div>
						</form>
					</div>
					<div className="relative w-full">
						<p className="z-20 mx-auto w-24 text-center font-bold text-white">
							OR
						</p>
					</div>
					<div className="my-4">
						<h3 className="text-lg font-bold text-white">
							Referral Link
						</h3>
						<div className="relative my-4 w-full">
							<div className="input-style my-auto min-h-[51px] items-center rounded-xl p-4 text-sm text-white">
								{referralLink}
							</div>
							<div className="absolute right-1 top-2 h-full">
								<Button
									size="sm"
									className="!border-primary-darker !h-[40px] items-center text-sm"
									variant="white"
									onClick={copyLink}
								>
									<span className="flex flex-row gap-2">
										<CopyIcon size={15} /> Copy
									</span>
								</Button>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="text-2xl font-bold text-white">
							Recently Referred
						</h3>
						<p className="text-base font-thin text-sky">
							Your referrals that joined {variables?.NAME}
						</p>
						<div className="input-style my-4 flex flex-col gap-2 p-2">
							{recentReferrals.length > 0 &&
								recentReferrals.map(
									(
										r: {
											_id: string;
											name: string;
											title: string;
											score: number;
											image: string;
											dated: string;
										},
										i: number
									) => <RecentReferral key={i} referral={r} />
								)}
							{recentReferrals.length === 0 && (
								<div className="input-style flex min-h-[139px] items-center rounded-2xl p-4">
									<p className="m-auto text-base text-sky-dark">
										People you refer will appear here
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="container_style flex h-full flex-col p-10 text-center">
					<Lottie animationData={email} loop={false} />
					<p className="mb-8 text-base text-white">
						Your Invite has been sent. You’ll be notified when a
						user signs up with your referral link
					</p>
					<div className="mx-auto w-1/2">
						<Button
							variant="white"
							onClick={() => {
								setIsSentEmail(false);
							}}
							fullWidth
						>
							Done
						</Button>
					</div>
				</div>
			)}
		</DesktopSheetWrapper>
	);
}
