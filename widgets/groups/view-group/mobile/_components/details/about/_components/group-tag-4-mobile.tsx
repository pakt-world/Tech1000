"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement } from "react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import CardView from "@/components/common/card-view";
import { Tag } from "@/lib/types/groups";
import { PageEmpty } from "@/components/common/page-empty";
import { getRandomReadableBgColor } from "@/lib/utils";

interface TagViewType {
	tags: Tag[];
}

export default function GroupsTagView4Mobile({
	tags,
}: TagViewType): ReactElement | null {
	return (
		<CardView className="flex-col  gap-4 rounded-none !bg-transparent !p-3 !backdrop-blur-none">
			<h2 className="w-full text-left text-xl font-bold text-white">
				Group Interests
			</h2>
			<div className="flex w-full flex-col gap-4">
				{tags?.length > 0 ? (
					<>
						{tags.slice(0, 3).map((item, index) => (
							<div
								key={index}
								className={`flex w-full justify-center rounded-full p-2  text-base`}
								style={{
									backgroundColor:
										item.color ||
										getRandomReadableBgColor(),
								}}
							>
								<p>{item?.name}</p>
							</div>
						))}
					</>
				) : (
					<PageEmpty
						label="No groups available."
						className="h-full rounded-none"
					/>
				)}
			</div>
		</CardView>
	);
}
