"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { Spinner } from "@/components/common/loader";
import { useApplyToOpenBounty, useGetBountyById } from "@/lib/api/bounty";
import success from "@/lottiefiles/success.json";
import Lottie from "@/components/common/lottie";

const bountyApplicationSchema = z.object({
	message: z.string().nonempty("Message is required"),
});

type BountyApplicationFormValues = z.infer<typeof bountyApplicationSchema>;

interface TalentBountyApplyModalProps {
	bountyId: string;
	bountyCreator: string;
}

export const TalentBountyApplyModal: FC<TalentBountyApplyModalProps> = ({
	bountyId,
	bountyCreator,
}) => {
	const router = useRouter();
	const bountyQuery = useGetBountyById({ bountyId });
	const applyToOpenBounty = useApplyToOpenBounty({ bountyCreator });
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const form = useForm<BountyApplicationFormValues>({
		resolver: zodResolver(bountyApplicationSchema),
		defaultValues: {
			message: "",
		},
	});

	const onSubmit: SubmitHandler<BountyApplicationFormValues> = ({
		message = "",
	}) => {
		applyToOpenBounty.mutate(
			{
				bountyId,
				message,
			},
			{
				onSuccess: () => {
					setShowSuccessMessage(true);
					bountyQuery.refetch();
					setTimeout(() => {
						router.push(`/overview`);
					}, 1000);
				},
			}
		);
	};

	if (showSuccessMessage) {
		return (
			<div className="container_style relative flex w-full max-w-xl flex-col gap-4 rounded-2xl p-6">
				<div className="absolute inset-0 right-0 !z-0 bg-gradient-piece bg-cover bg-no-repeat" />
				<div className="flex flex-col items-center gap-1">
					<div className="-mt-[4] max-w-[200px]">
						<Lottie animationData={success} loop={false} />
					</div>

					<h2 className="text-2xl font-medium text-white">
						Application Sent
					</h2>
					<span className="text-white">
						You will get a notification if the client sends you a
						message
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="container_style relative flex w-full max-w-xl flex-col gap-4 rounded-2xl p-6">
			<div className="absolute inset-0 right-0 z-0 bg-gradient-piece bg-cover bg-no-repeat" />
			<div className="flex flex-col items-center gap-1">
				<h2 className="text-2xl font-medium text-white">
					Apply for Bounty
				</h2>
			</div>

			<form
				className="z-10 flex flex-col items-center gap-6"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="flex w-full flex-col gap-2">
					<label htmlFor="due" className="text-title">
						Message
					</label>
					<textarea
						rows={5}
						maxLength={200}
						id="due"
						{...form.register("message")}
						placeholder="Describe why you're a good candidate"
						className="input-style w-full resize-none rounded-lg px-4 py-3 !text-white outline-none focus-within:border-secondary hover:border-secondary hover:duration-200"
					/>
					<div className="-mt-1 ml-auto w-fit text-sm text-body">
						{form.watch("message")?.length} / 200 characters
					</div>

					{form.formState.errors.message != null && (
						<span className="text-sm text-red-500">
							{form.formState.errors.message.message}
						</span>
					)}
				</div>
				<Button
					fullWidth
					variant="white"
					disabled={applyToOpenBounty.isLoading}
				>
					{applyToOpenBounty.isLoading ? (
						<Spinner />
					) : (
						"Send Application"
					)}
				</Button>
			</form>
		</div>
	);
};
