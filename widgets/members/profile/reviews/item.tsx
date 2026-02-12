"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { format } from "date-fns";
import { Star } from "lucide-react";
import { type ReactElement } from "react";
import Rating from "react-rating";

import { useUserState } from "@/lib/store/account";
import { sentenceCase } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { SnowProfile } from "../../../../components/common/snow-profile";
import { type ReviewProps } from "./types";

interface Props extends ReviewProps {
	tab?: boolean;
}

export const Review = ({
	body,
	title,
	rating,
	user,
	date,
	index,
	tab,
}: Props): ReactElement => {
	const { _id: loggedInUser } = useUserState();
	const MAX_LEN = 150;
	const navigateUrl =
		loggedInUser === user._id ? "/profile" : `/members/${user?._id}`;
	return (
		<div
			className="flex min-h-full w-full cursor-grab select-none flex-col rounded-2xl border border-gray-200 border-opacity-20 bg-stone-800 p-4 sm:p-6"
			style={{ maxWidth: tab ? "50%" : "100%" }}
		>
			<div
				className="flex max-w-[100%] flex-1 flex-col gap-4 break-all"
				style={{
					wordWrap: "break-word",
					overflowWrap: "break-word",
					wordBreak: "break-word",
				}}
			>
				<div className="flex w-full items-center justify-between">
					<p className="text-xs leading-[18px] tracking-wide text-white">
						{date && format(new Date(date), "MMM dd, yyyy")}
					</p>
					<p className="text-xs leading-[18px] tracking-wide text-body">
						{index}
					</p>
				</div>
				<h3 className="text-xl font-medium text-white">{title}</h3>
				<p className="max-w-fit text-base font-thin text-white">
					{body.length > MAX_LEN ? `${body.slice(0, 150)}...` : body}
				</p>
			</div>

			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<SnowProfile
						size="sm"
						score={user.afroScore as number}
						src={user?.avatar}
						url={navigateUrl}
						isPartner
						className="relative -left-2"
					/>

					<div className="col-span-2 my-auto flex flex-col">
						<span className="text-sm font-medium text-white">
							{user.name}
						</span>
						<span className="text-xs text-neutral-300">
							{sentenceCase(user.title)}
						</span>
					</div>
				</div>
				{/* @ts-expect-error --- Types Error */}
				<Rating
					initialRating={rating}
					fullSymbol={<Star fill="#15D28E" color="#15D28E" />}
					emptySymbol={<Star fill="transparent" color="#15D28E" />}
					readonly
				/>
			</div>
		</div>
	);
};
