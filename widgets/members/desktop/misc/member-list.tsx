"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Loader } from "lucide-react";
import { forwardRef } from "react";

import { type MappedMember } from "@/lib/actions";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { determineRole } from "@/lib/utils";

import { PageEmpty } from "../../../../components/common/page-empty";
import { PageLoading } from "../../../../components/common/page-loading";
import { MemberCard } from "./member-card";

interface MemberListProps {
	members: MappedMember[];
	isFetchingNextPage: boolean;
	isLoading?: boolean;
}

const RenderLoading = (): JSX.Element => {
	return (
		<div className="z-20 my-auto flex h-full w-full items-center justify-center">
			<PageLoading color="#ffffff" />
		</div>
	);
};

export const MemberList = forwardRef<HTMLDivElement, MemberListProps>(
	(props, ref): JSX.Element => {
		const { members, isLoading, isFetchingNextPage } = props;

		return (
			<div className="overflow-y-auto overflow-x-hidden">
				{isLoading ? (
					<RenderLoading />
				) : members.length > 0 ? (
					<div className="grid grid-cols-1 items-center justify-center gap-6 lg:grid-cols-3">
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
										achievements={t?.achievements}
										type={determineRole(t)}
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
						className="h-[70vh] rounded-2xl"
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
