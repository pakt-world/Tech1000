"use client";

import dynamic from "next/dynamic";
import React, { memo } from "react";

const NOSSRLottie = dynamic(() => import("lottie-react"), {
	ssr: false,
});

const Lottie = ({
	animationData,
	loop = false,
}: {
	animationData: unknown;
	loop?: boolean;
}) => <NOSSRLottie animationData={animationData} loop={loop} />;

export default memo(Lottie);
