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

export default function GroupsTagView({
	tags,
}: TagViewType): ReactElement | null {
	return (
		<CardView className="sticky top-[10px] mt-4 flex-col gap-4  !border !border-lemon-green !px-6 !py-4">
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
						className="h-full rounded-2xl"
					/>
				)}
			</div>
		</CardView>
	);
}
