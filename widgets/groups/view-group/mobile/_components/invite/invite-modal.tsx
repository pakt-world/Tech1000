/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader, X } from "lucide-react";
import { debounce } from "lodash";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
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
import { useOnClickOutside } from "usehooks-ts";

interface InviteModal4MobileProps {
	title: string;
	limit?: number;
	setOpen: (open: boolean) => void;
	open: boolean;
	groupId: string;
	role: "members" | "admin";
}

export const InviteModal4Mobile: FC<InviteModal4MobileProps> = ({
	title,
	limit = 10000,
	setOpen,
	open,
	groupId,
	role,
}) => {
	const prevPageRef = useRef(0);
	const currentPageRef = useRef(1);
	const ref = useRef<HTMLDivElement | null>(null);

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
	const handleClickOutside = (): void => {
		setOpen(false);
	};

	// Keyboard Open - Adjust Modal Height
	useEffect(() => {
		const initialHeight = window.innerHeight;

		const handleResize = () => {
			const modal = document.querySelector(".b_modal");
			const currentHeight = window.innerHeight;

			if (initialHeight > currentHeight) {
				// Keyboard is open, adjust modal height
				modal?.classList.add("keyboard-open");
			} else {
				// Keyboard is closed, reset modal position
				modal?.classList.remove("keyboard-open");
			}
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useOnClickOutside(ref, handleClickOutside);

	return (
		<div
			className={`b_modal fixed left-0 top-auto !z-[1000] flex h-[70vh] w-full shrink-0 flex-col gap-4 rounded-t-2xl bg-[#000000]/95 px-5 py-2 font-circular transition-all duration-300 ease-in-out sm:hidden ${open ? "!bottom-0 !z-[999]" : "!-bottom-full !z-0"}`}
			ref={ref}
		>
			<span className="mt-4 flex  w-full items-center justify-between">
				<h2 className="flex w-full justify-start text-left text-lg font-bold capitalize text-white">
					{title}
				</h2>
				<X
					className="h-6 w-6 rounded-md bg-opacity-30 text-zinc-300"
					onClick={(e) => {
						e.stopPropagation();
						setOpen(false);
					}}
					onKeyDown={() => {
						setOpen(false);
					}}
					role="button"
					tabIndex={0}
					aria-label="close"
				/>
			</span>

			<CardView className="flex w-full flex-col gap-4 bg-[#171515] !p-4">
				<CustomInput
					type="text"
					htmlFor="search"
					label="Search"
					placeholder="By name, title, etc."
					wrapper="w-full !gap-2"
					onChange={handleSearchChange}
				/>
				<CustomInput
					type="text"
					htmlFor="tag"
					label="Interests"
					placeholder="e.g. Gaming, DeFi, Memes"
					wrapper="w-full !gap-2"
					onChange={handleTagChange}
				/>
			</CardView>

			<div className="z-[4000000000] flex max-h-[300px] w-full flex-col gap-4 overflow-y-scroll pb-20">
				{isLoading ? (
					<PageLoading className=" max-h-[300px] text-center text-white" />
				) : typedMembers.length > 0 ? (
					<>
						{typedMembers.map((member) => {
							if (member?.image) {
								return (
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
												<span className="truncate text-base font-bold text-white">
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
								);
							} else {
								return null;
							}
						})}
					</>
				) : (
					<PageEmpty
						className="max-h-[300px] !py-16"
						label={"No Talent Available"}
					></PageEmpty>
				)}
				<div className="pt-4" ref={observerTarget}></div>
			</div>

			{isFetchingNextPage && (
				<div className="flex justify-center">
					<Loader
						size={25}
						className="animate-spin text-center text-white"
					/>
				</div>
			)}

			<div className="absolute bottom-[10%]  right-0 z-[1000000000000000]  w-full bg-[#000000]">
				<Button
					className=" w-full border-none py-2 font-bold"
					fullWidth
					variant="default"
					onClick={handleAddSelected}
					disabled={isInviting || selectedMembers.length < 1}
				>
					{isInviting ? "Loading..." : "Send Invite"}
				</Button>
			</div>
		</div>
	);
};
