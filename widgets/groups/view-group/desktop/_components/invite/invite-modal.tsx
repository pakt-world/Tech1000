/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { FC, useMemo, useRef, useState } from "react";
import { Check, Loader } from "lucide-react";
import { debounce } from "lodash";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Modal } from "@/components/common/modal";
import CardView from "@/components/common/card-view";
import { Button } from "@/components/common/button";
import { CustomInput } from "@/components/common/custom-input";
import { SnowProfile } from "@/components/common/snow-profile";
import { useGetTalentInfinitely } from "@/lib/api/talent";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { type MappedMember } from "@/lib/actions";
import { mapTalentData } from "@/lib/actions";
import { MemberProps } from "@/lib/types/member";
import { PageEmpty } from "@/components/common/page-empty";
import { toast } from "@/components/common/toaster";
import { useSendInvite } from "@/lib/api/group";
import { PageLoading } from "@/components/common/page-loading";
import { useUserState } from "@/lib/store/account";

interface InviteModalProps {
	title: string;
	limit?: number;
	setOpen: (open: boolean) => void;
	open: boolean;
	groupId: string;
	role: "members" | "admin";
}

export const InviteModal: FC<InviteModalProps> = ({
	title,
	limit = 10000,
	setOpen,
	open,
	groupId,
	role,
}) => {
	const prevPageRef = useRef(0);
	const currentPageRef = useRef(1);

	const [searchTerm, setSearchTerm] = useState("");
	const [skillTag, setSkillsTag] = useState("");
	const [selectedMembers, setSelectedMembers] = useState<MappedMember[]>([]);

	const { mutate: sendInvite, isLoading: isInviting } = useSendInvite();
	const account = useUserState();

	const {
		data: talentPagesData,
		refetch: talentRefetch,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetTalentInfinitely({
		limit: 10,
		filter: {
			// profileCompletenessMin: 70,
			// profileCompletenessMax: 100,
			// owner: true,
			// sortBy: "score",
			// orderBy: "desc",
			// isPrivate: false,
			groupId,
			...(searchTerm && { search: searchTerm }),
			...(skillTag && { tags: skillTag }),
		},
	});

	const talentData = useMemo(
		() => ({
			...talentPagesData,
			pages: talentPagesData?.pages?.map((page) => page.data) ?? [],
		}),
		[talentPagesData]
	);

	const { observerTarget, currentData } = useInfiniteScroll<MemberProps>({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage: currentPageRef.current,
		prevPage: prevPageRef.current,
		data: talentData,
		refetch: talentRefetch,
		error: error?.response?.data.message ?? "",
	});

	const debouncedSearch = useMemo(
		() =>
			debounce((value) => {
				setSearchTerm(value);
			}, 300),
		[]
	);

	const debouncedTagSearch = useMemo(
		() =>
			debounce((value) => {
				setSkillsTag(value);
			}, 300),
		[]
	);

	const handleSelectMember = (member: MappedMember) => {
		if (member?.isMember) return;
		const isAlreadySelected = selectedMembers.find(
			(m) => m._id === member._id
		);

		if (isAlreadySelected) {
			const updatedSelection = selectedMembers.filter(
				(m) => m._id !== member._id
			);
			setSelectedMembers(updatedSelection);
		} else {
			if (selectedMembers.length < limit) {
				const updatedSelection = [...selectedMembers, member];
				setSelectedMembers(updatedSelection);
			} else {
				toast.error(
					`You cannot select more than ${limit} member${limit > 1 ? "s" : ""}.`
				);
			}
		}
	};

	const handleAddSelected = () => {
		const inviteList = selectedMembers.map((m) => m._id);

		if (inviteList.length === 0) {
			toast.error("Please select members to invite.");
			return;
		}

		sendInvite(
			{
				...(role === "members" ? { memberInvites: inviteList } : []),
				...(role === "admin" ? { adminInvites: inviteList } : []),
				groupId: groupId,
			},
			{
				onSuccess: () => {
					setSelectedMembers([]);
					setOpen(false);
				},
			}
		);
	};

	const isSelected = (id: string) =>
		selectedMembers.some((m) => m._id === id) || id === account?._id;

	const typedMembers = currentData.map(mapTalentData);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(event.target.value);
	};

	const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		debouncedTagSearch(event.target.value);
	};

	return (
		<div>
			<Modal
				isOpen={open}
				onOpenChange={() => setOpen(!open)}
				className="flex w-full sm:max-w-[775px]"
			>
				<div className="relative w-full p-0.5">
					<div className="absolute inset-0 z-[-80] w-full rounded-2xl">
						<div
							className="absolute inset-0 overflow-hidden rounded-[30px] border border-transparent 
      before:absolute before:inset-0 before:z-[-1] 
      before:rounded-lg before:border-none before:bg-gradient-to-br 
      before:from-[#D02D3D] before:via-[#F2C650] before:to-[#D02D3D] before:content-['']"
						/>
					</div>
					<div className="z-[4000000000] flex w-full flex-col gap-6 !overflow-hidden rounded-[30px] bg-ink-dark p-6 text-white max-sm:scale-[0.9] sm:max-w-[775px]">
						<h2 className="flex w-full justify-center text-center text-2xl font-bold capitalize text-white">
							{title}
						</h2>

						<CardView className="flex w-full gap-4 bg-[#171515] !p-4">
							<CustomInput
								type="text"
								htmlFor="search"
								label="Search"
								placeholder="By name, title, etc."
								wrapper="w-1/2 !gap-2"
								onChange={handleSearchChange}
							/>
							<CustomInput
								type="text"
								htmlFor="tag"
								label="Interests"
								placeholder="e.g. Gaming, DeFi, Memes"
								wrapper="w-1/2 !gap-2"
								onChange={handleTagChange}
							/>
						</CardView>

						<div className="z-[4000000000] flex max-h-[400px] flex-col gap-4 overflow-x-scroll">
							{isLoading ? (
								<PageLoading className=" max-h-[300px] text-center text-white" />
							) : typedMembers.length > 0 ? (
								<>
									{typedMembers.map((member) => (
										<div
											key={member._id}
											className="b flex cursor-pointer items-center justify-between rounded-md p-2"
											onClick={() =>
												handleSelectMember(member)
											}
										>
											<div className="flex gap-4">
												<SnowProfile
													src={member.image}
													score={
														parseInt(
															member.nftTokenNumber ||
																""
														) || 0
													}
													size="sm"
												/>
												<div className="flex flex-col">
													<span className="text-lg font-bold">
														{member.name}
													</span>
													<span className="text-sm text-[#ffffff]/70">
														{member.role}
													</span>
												</div>
											</div>
											<div
												className={`flex h-8 w-8 items-center justify-center rounded-full ${
													isSelected(member._id) ||
													member?.isMember
														? "bg-green-500"
														: "bg-gray-300/20"
												}`}
											>
												{(isSelected(member._id) ||
													member?.isMember) && (
													<Check
														className="text-white"
														size={20}
													/>
												)}
											</div>
										</div>
									))}
									<div
										className="pt-4"
										ref={observerTarget}
									></div>
								</>
							) : (
								<PageEmpty
									className="max-h-[300px] !py-16"
									label={"No Talent Available"}
								></PageEmpty>
							)}
						</div>

						{isFetchingNextPage && (
							<div className="flex justify-center">
								<Loader
									size={25}
									className="animate-spin text-center text-white"
								/>
							</div>
						)}

						<Button
							className="w-full border-none py-2 font-bold"
							fullWidth
							variant="default"
							onClick={handleAddSelected}
							disabled={isInviting || selectedMembers.length < 1}
						>
							{isInviting ? "Loading..." : "Send Invite"}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};
