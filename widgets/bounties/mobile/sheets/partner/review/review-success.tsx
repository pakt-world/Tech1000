"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import success from "@/lottiefiles/success.json";
import Lottie from "@/components/common/lottie";

export const PartnerReviewSuccess4Mobile: FC<{
	closeMobileSheet: () => void;
}> = ({ closeMobileSheet }) => {
	return (
		<div className="flex h-full flex-col items-center justify-center bg-primary px-4">
			<div className="flex h-fit flex-col items-center justify-center gap-20">
				<div className="max-w-[200px]">
					<Lottie animationData={success} loop={false} />
				</div>
				<div className="x-mt-40 flex flex-col items-center  gap-9 text-center">
					<div className="flex flex-col items-center gap-9 text-center">
						<p className="max-w-[80%] text-lg text-sky">
							Your review has been submitted. Payment has been
							released to the ambassador.
						</p>
						<div className="w-full max-w-[200px]">
							<Button
								fullWidth
								variant="white"
								onClick={(e) => {
									e.stopPropagation();
									closeMobileSheet();
								}}
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
