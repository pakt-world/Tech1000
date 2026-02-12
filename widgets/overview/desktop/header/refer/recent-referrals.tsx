"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Calendar } from "lucide-react";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { SnowProfile } from "../../../../../components/common/snow-profile";

interface RecentReferralProps {
	referral: {
		_id: string;
		name: string;
		title: string;
		score: number;
		image: string;
		dated: string;
	};
}

const RecentReferral = ({ referral }: RecentReferralProps): ReactElement => {
	return (
		<div className="container_style flex w-full flex-row justify-between rounded-2xl px-4 py-2">
			<div className="flex flex-row gap-2">
				<SnowProfile
					score={referral.score}
					src={referral.image}
					size="sm"
					url={`members/${referral._id}`}
				/>
				<span className="my-auto items-center">
					<h3 className="text-lg text-white">{referral.name}</h3>
					<p className="text-sm text-sky">{referral.title}</p>
				</span>
			</div>
			<div className="my-auto flex flex-row gap-2 text-sky">
				<Calendar size={24} /> {referral.dated}
			</div>
		</div>
	);
};

export default RecentReferral;
