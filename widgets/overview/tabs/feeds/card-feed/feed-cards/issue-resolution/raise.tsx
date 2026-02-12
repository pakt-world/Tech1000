"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Bookmark, Gavel, X } from "lucide-react";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import alert from "@/lottiefiles/alert.json";
import Lottie from "@/components/common/lottie";

export const IssueResolutionRaiseFeed = (): ReactElement => {
	return (
		<div className="relative z-10 flex w-full gap-4 overflow-hidden rounded-2xl border border-[#FF9898] bg-[#FFF4F4] p-4">
			<div className="flex w-[148px] items-center justify-center">
				<Lottie animationData={alert} loop />
			</div>

			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-title">
						Jane Cooper Has Raised An Issue
					</h3>

					<X size={20} />
				</div>

				<p className="text-base text-body">
					Your bounty “Design of landing page” has been submitted for
					Issue Resolution arbitration. You have 48 hours to submit
					materials to defend your case to the 5-person jury.
				</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button size="sm" variant="white">
							See Details
						</Button>
					</div>
					<Bookmark size={20} />
				</div>
			</div>

			<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
				<Gavel size={200} color="#FFE5E5" />
			</div>
		</div>
	);
};
