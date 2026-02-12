"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import success from "@/lottiefiles/success.json";
import Lottie from "@/components/common/lottie";

export const ReviewSuccess: FC<{
	closeModal: () => void;
}> = ({ closeModal }) => {
	const router = useRouter();

	return (
		<div className="container_style flex h-full flex-col items-center justify-center px-4">
			<div className="flex h-fit flex-col items-center justify-center gap-20">
				<div className="max-w-[200px]">
					<Lottie animationData={success} loop={false} />
				</div>
				<div className="x-mt-40 flex flex-col items-center  gap-9 text-center">
					<div className="flex flex-col items-center gap-9 text-center">
						<p className="max-w-[80%] text-lg text-white">
							Congratulations! The partner will now review your
							work. Once their review is complete you will receive
							your payment.
						</p>
						<div className="w-full max-w-[200px]">
							<Button
								fullWidth
								size="lg"
								onClick={() => {
									closeModal();
									router.push("/overview");
								}}
								variant="white"
							>
								Go To Dashboard
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
