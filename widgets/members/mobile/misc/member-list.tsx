"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";
import { forwardRef } from "react";

import { PageEmpty } from "@/components/common/page-empty";
import { PageLoading } from "@/components/common/page-loading";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type MappedMember } from "@/lib/actions";

import { MemberCard } from "./member-card";

interface MemberListProps {
	members: MappedMember[];
	isFetchingNextPage: boolean;
	isLoading?: boolean;
}

export const MemberList = forwardRef<HTMLDivElement, MemberListProps>(
	(props, ref): JSX.Element => {
		const { members, isLoading, isFetchingNextPage } = props;
		return (
			<div className="scrollbar-hide relative mt-[62px] h-full w-full overflow-auto pb-20">
				{isLoading ? (
					<PageLoading color="#ffffff" className="max-sm:!h-full" />
				) : members.length > 0 ? (
					<div className="relative flex w-full flex-col overflow-y-auto">
						{members.map((t: MappedMember, i: number) => {
							if (t?.image) {
								return (
									<MemberCard
										key={i}
										id={t._id}
										name={t.name}
										title={t?.title ?? ""}
										score={(t?.score as string) || "0"}
										imageUrl={t?.image}
										skills={t?.skills}
										nftTokenNumber={
											(t?.nftTokenNumber as string) || "0"
										}
									/>
								);
							} else {
								return null;
							}
						})}
					</div>
				) : (
					<PageEmpty
						label="No result Found..."
						className="max-sm:!h-full sm:h-[70vh] sm:rounded-2xl"
					/>
				)}
				{isFetchingNextPage && (
					<div className="mx-auto my-8 flex w-full flex-row items-center justify-center text-center">
						<Loader
							size={25}
							className="animate-spin text-center text-white"
						/>
					</div>
				)}
				<div ref={ref} className="!h-4 !w-full" />
			</div>
		);
	}
);

MemberList.displayName = "MemberList";
