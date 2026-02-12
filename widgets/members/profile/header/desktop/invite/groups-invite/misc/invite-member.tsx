"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependencies                           */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useMemo, useState } from "react";
import { ChevronLeft, Loader } from "lucide-react";
import { useGetGroupsInfinitely, useSendInvite } from "@/lib/api/group";
import { PageLoading } from "@/components/common/page-loading";
import { PageEmpty } from "@/components/common/page-empty";
import { PageError } from "@/components/common/page-error";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import CardView from "@/components/common/card-view";

import GroupsCard from "@/widgets/groups/_shared/groups-card";
import { Group } from "@/lib/types/groups";
import { Button } from "@/components/common/button";
import { toast } from "@/components/common/toaster";

/* -------------------------------------------------------------------------- */
/*                             Main Component                                 */
/* -------------------------------------------------------------------------- */

interface InvitesGroupPageProp {
	talentId: string;
	onOpenChange: () => void;
}

export default function InvitesGroupPage({
	talentId,
	onOpenChange,
}: InvitesGroupPageProp): ReactElement | null {
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

	const { mutate: sendInvite, isLoading: isInviting } = useSendInvite();
	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;
	const {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetGroupsInfinitely({ limit: 10, type: "created" });

	const groupsData = useMemo(
		() => ({
			...data,
			pages: data?.pages?.map((page) => page.data) ?? [],
		}),
		[data]
	);

	const { observerTarget } = useInfiniteScroll({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: groupsData,
		refetch,
		error: error?.response?.data.message ?? "",
	});

	const handleSendInvite = () => {
		const inviteList = [talentId];
		const groupId = selectedGroup?._id as string;

		if (inviteList.length === 0) {
			toast.error("Please select members to invite.");
			return;
		}

		sendInvite({
			memberInvites: inviteList,
			groupId: groupId,
		});
	};

	const handleSelection = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		group: Group
	) => {
		e.stopPropagation();
		setSelectedGroup(group);
	};

	if (isError) return <PageError className="h-[85vh] rounded-2xl" />;

	return (
		<div className="ml-auto flex h-full w-full max-w-[600px] flex-col gap-6 overflow-y-auto overflow-x-hidden">
			{isLoading ? (
				<CardView className="h-full w-full !rounded-none ">
					<PageLoading className="rounded-2xl" color="#ffffff" />
				</CardView>
			) : (groupsData?.pages?.flat().length ?? 0) > 0 ? (
				<CardView className="relative flex h-full w-full flex-col overflow-hidden !rounded-none border-y-0 border-r-0 border-[#F2C650] bg-[linear-gradient(181deg,rgba(0,0,0,0.50)_1.15%,rgba(0,0,0,0)_98.91%)] !p-0 backdrop-blur-[35px]">
					<h2 className="flex w-full items-center gap-2 bg-white/15 px-4 py-6 text-left text-3xl font-bold text-white backdrop-blur-[35px]">
						<ChevronLeft
							size={30}
							className="cursor-pointer"
							onClick={onOpenChange}
						/>{" "}
						Invite to Group
					</h2>
					<div className="mx-auto flex w-full  flex-col gap-4 overflow-y-scroll p-8 ">
						<p className="mb-4 text-xl font-bold text-white">
							Select group to invite member to
						</p>
						{groupsData?.pages?.flat().map((group, index) => (
							<div
								onClick={() => setSelectedGroup(group)}
								key={index}
							>
								<GroupsCard
									key={group._id}
									name={group.name}
									id={group._id}
									image={
										group?.image ??
										"/images/onboarding-5.png"
									}
									tags={group.tags}
									members={group.memberCount}
									score={group.score}
									className={`${selectedGroup?._id === group?._id ? "!border-[#CCF975]" : " transition-transform duration-100 hover:scale-105 hover:border-[#e1e3de]"} `}
									onClick={(e) => handleSelection(e, group)}
								/>
							</div>
						))}

						{isFetchingNextPage && (
							<div className="mx-auto flex w-full flex-row items-center justify-center text-center">
								<Loader
									size={15}
									className="animate-spin text-center text-white"
								/>
							</div>
						)}
						<div ref={observerTarget} className="!h-2 !w-full" />
					</div>
					<div className="absolute bottom-0 mb-2 w-full max-w-[90%] text-xl font-bold text-black">
						<Button
							size={"lg"}
							className="mt-4 w-full rounded-full text-lg font-bold hover:!bg-opacity-100"
							disabled={!selectedGroup?._id || isInviting}
							onClick={handleSendInvite}
						>
							{isInviting ? "Loading..." : "Send Invite"}
						</Button>
					</div>
				</CardView>
			) : (
				<PageEmpty
					label="No groups available."
					className="h-full w-full rounded-none"
				/>
			)}
		</div>
	);
}
