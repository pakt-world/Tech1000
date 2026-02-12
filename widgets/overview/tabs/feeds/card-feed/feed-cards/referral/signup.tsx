"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, X } from "lucide-react";
import Link from "next/link";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { SnowProfile } from "@/components/common/snow-profile";
import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";

interface ReferralSignupFeedProps {
	id: string;
	name: string;
	userId: string;
	title?: string;
	description?: string;
	avatar?: string;
	score?: number;
	bookmarkId: string;
	bookmarked: boolean;
	close?: (id: string) => void;
}
export const ReferralSignupFeed = ({
	id,
	title,
	description,
	userId,
	avatar,
	score,
	name,
	bookmarked,
	bookmarkId,
	close,
}: ReferralSignupFeedProps): ReactElement => {
	return (
		<div className="container_style relative z-10 flex h-[174px] w-full gap-4 overflow-hidden rounded-2xl p-4 pl-2">
			<SnowProfile
				src={avatar}
				score={Number(score)}
				size="lg"
				url={`/members/${userId}`}
			/>
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-white">
						{title ?? `${name} just signed up`}
					</h3>
					{close && (
						<X
							size={20}
							className="cursor-pointer text-white"
							onClick={() => {
								close(id);
							}}
						/>
					)}
				</div>

				<p className="text-white">
					{description ??
						`Your referred user just signed up! Thanks for spreading the word and helping us grow. We appreciate your
          support! 🙌`}
				</p>

				<div className="mt-auto flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Link href={`/messages?userId=${userId}`}>
							<Button
								size="sm"
								variant="outline"
								className="w-[120px]"
							>
								Message
							</Button>
						</Link>
					</div>
					<RenderBookMark
						size={20}
						isBookmarked={bookmarked}
						type="feed"
						id={id}
						bookmarkId={bookmarkId}
					/>
				</div>
			</div>

			<div className="absolute right-0 top-16 -z-[1] translate-x-1/3">
				<Briefcase size={200} color="#F2F4F5" className="opacity-20" />
			</div>
		</div>
	);
};
