"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type SlideItemProps } from "@/components/common/slider";
import { UploadProfileImage } from "@/components/common/upload-profile-image";

export function UploadImage({
	goToPreviousSlide,
}: SlideItemProps): JSX.Element {
	return (
		<UploadProfileImage
			isOnboarding
			goToPreviousSlide={goToPreviousSlide}
		/>
	);
}
