"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Slider } from "@/components/common/slider";
import CardView from "@/components/common/card-view";
import { Skills } from "@/widgets/onboarding/skills";
import { UploadImage } from "@/widgets/onboarding/upload-image";

export default function OnBoardingPage(): JSX.Element {
	return (
		<div className="z-[2] flex w-full flex-col items-center justify-center gap-6">
			<CardView className="!max-sm:p-4  border-none bg-ink-darkest/0 !p-0 !backdrop-blur-none max-sm:w-full md:max-w-4xl md:!border-2 md:!bg-ink-darkest/40 md:!px-12 md:!py-12 md:!backdrop-blur-sm">
				<Slider
					items={[{ SlideItem: Skills }, { SlideItem: UploadImage }]}
				/>
			</CardView>
		</div>
	);
}
