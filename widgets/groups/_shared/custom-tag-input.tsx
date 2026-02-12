/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { FC, useMemo, useRef, useState } from "react";
import { X, Check, Loader } from "lucide-react";
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
import { AccountProps } from "@/lib/types/account";

interface TagInputProps {
	onChange: (selected: MappedMember[]) => void;
	title: string;
	inviteText?: string;
	limit?: number;
	type: "admin" | "regular";
	creator?: MappedMember;
	preselectedMember?: MappedMember;
	excludedMembers?: MappedMember[];
	user?: AccountProps;
	className?: string;
	noClickAllowed?: boolean;
}

export const CustomTagInput: FC<TagInputProps> = ({
	onChange,
	title,
	inviteText,
	limit = 10000,
	type,
	creator,
	preselectedMember,
	excludedMembers,
	user,
	className,
	noClickAllowed,
}) => {
	const prevPageRef = useRef(0);
	const currentPageRef = useRef(1);
	const buttonRef = useRef<HTMLDivElement>(null);

	const [searchTerm, setSearchTerm] = useState("");
	const [skillTag, setSkillsTag] = useState("");
	const [selectedMembers, setSelectedMembers] = useState<MappedMember[]>([]);
	const [open, setOpen] = useState(false);

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
			orderBy: "desc",
			// isPrivate: false,
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
			}, 500),
		[]
	);

	const debouncedTagSearch = useMemo(
		() =>
			debounce((value) => {
				setSkillsTag(value);
			}, 500),
		[]
	);

	const handleSelectMember = (member: MappedMember) => {
		const isAlreadySelected = selectedMembers.find(
			(m) => m._id === member._id
		);

		if (isAlreadySelected) {
			const updatedSelection = selectedMembers.filter(
				(m) => m._id !== member._id
			);
			setSelectedMembers(updatedSelection);
			onChange(updatedSelection);
		} else {
			if (selectedMembers.length < limit) {
				const updatedSelection = [...selectedMembers, member];
				setSelectedMembers(updatedSelection);
				onChange(updatedSelection);
			} else {
				toast.error(
					`You cannot select more than ${limit} member${limit > 1 ? "s" : ""}.`
				);
			}
		}
	};

	const handleRemoveMember = (id: string) => {
		if (id === creator?._id && type === "admin") return;

		const updatedSelection = selectedMembers.filter((m) => m._id !== id);
		setSelectedMembers(updatedSelection);
		onChange(updatedSelection);
	};

	const isSelected = (id: string) =>
		selectedMembers.some((m) => m._id === id);

	const typedMembers = currentData
		.map(mapTalentData)
		.filter(
			(member) =>
				!excludedMembers?.some(
					(excluded) => excluded._id === member._id
				) && member._id !== user?._id
		);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(event.target.value);
	};

	const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		debouncedTagSearch(event.target.value);
	};

	const handleCardClick = (event: React.MouseEvent) => {
		if (noClickAllowed) return;
		const target = event.target as HTMLElement;
		if (target.closest(".data-member-button")) {
			return;
		}
		setOpen(true);
	};

	return (
		<div>
			<CardView
				className={`flex min-h-[130px] cursor-pointer flex-wrap !items-start justify-start gap-2 border-opacity-30 !bg-[#FCFCFD1A] !p-4 ${className}`}
				onClick={handleCardClick}
			>
				{preselectedMember && (
					<div
						key={preselectedMember._id}
						className="data-member-button z-[4] flex items-center space-x-2 rounded-xl border border-[#CAE7BE] bg-white p-2"
					>
						<SnowProfile
							src={preselectedMember.image}
							score={
								parseInt(
									preselectedMember.nftTokenNumber || ""
								) as number
							}
							size="sm"
						/>
						<div className="flex flex-col">
							<span className="text-md font-medium">
								{preselectedMember.name} (You)
							</span>
							<span className="text-xs text-gray-500">
								{preselectedMember.title}
							</span>
						</div>
					</div>
				)}
				{selectedMembers.length === 0 ? (
					<span className="text-[#72777A]">{inviteText}</span>
				) : (
					selectedMembers.map((member) => (
						<div
							ref={buttonRef}
							key={member._id}
							className="data-member-button z-[4] flex items-center space-x-2 rounded-xl border border-[#CAE7BE] bg-white p-2"
						>
							<SnowProfile
								src={member.image}
								score={
									parseInt(member.nftTokenNumber || "") || 0
								}
								size="sm"
							/>
							<div className="flex flex-col">
								<span className="text-md font-medium">
									{member.name}
								</span>
								<span className="text-xs text-gray-500">
									{member.role}
								</span>
							</div>
							{member._id !== "admin" && (
								<X
									className=" ml-2 cursor-pointer"
									size={22}
									onClick={() =>
										handleRemoveMember(member._id)
									}
								/>
							)}
						</div>
					))
				)}
			</CardView>

			<Modal
				isOpen={open}
				onOpenChange={() => setOpen(!open)}
				className="flex   w-full sm:max-w-[775px] "
			>
				<div className="relative w-full p-0.5">
					<div className="pointer-events-none absolute inset-0 z-0 w-full rounded-2xl">
						<div
							className="pointer-events-none absolute inset-0 w-full overflow-hidden rounded-[30px] 
      border border-transparent before:absolute 
      before:inset-0 before:z-[-1] before:rounded-lg 
      before:border-none before:bg-gradient-to-br before:from-[#D02D3D] before:via-[#F2C650] before:to-[#D02D3D] before:content-['']"
						/>
					</div>

					<div className="relative z-10 flex w-full flex-col gap-6 !overflow-hidden rounded-[30px]  bg-ink-dark p-6 text-white max-sm:scale-[0.9] sm:max-w-[775px]">
						<h2 className="flex w-full justify-center text-center text-2xl font-bold text-white">
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
								label={`${type === "admin" ? "Interests" : "Skills"}`}
								placeholder="e.g. Gaming, DeFi, Memes"
								wrapper="w-1/2 !gap-2"
								onChange={handleTagChange}
							/>
						</CardView>

						<div className="flex max-h-[400px] flex-col gap-4 overflow-x-scroll">
							{isLoading ? (
								<div className="flex justify-center">
									<Loader
										size={25}
										className="animate-spin text-center text-white"
									/>
								</div>
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
															member?.nftTokenNumber ||
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
													isSelected(member._id)
														? "bg-green-500"
														: "bg-gray-300/20"
												}`}
											>
												{isSelected(member._id) && (
													<Check
														className="text-white"
														size={20}
													/>
												)}
											</div>
										</div>
									))}
									<div
										className="pb-4"
										ref={observerTarget}
									></div>
								</>
							) : (
								<PageEmpty
									className="h-[350px] !py-16"
									label="No Talent Available"
								/>
							)}
						</div>

						{isFetchingNextPage && (
							<div className="flex h-[10] justify-center text-white">
								<Loader
									size={25}
									className="animate-spin text-center text-white"
								/>
							</div>
						)}
						{error && <div>{error.message}</div>}

						<Button
							className="w-full border-none py-2 font-bold"
							fullWidth
							variant="default"
							onClick={() => setOpen(!open)}
						>
							Add Selected
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};
