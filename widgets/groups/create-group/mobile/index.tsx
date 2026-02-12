"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import CardView from "@/components/common/card-view";
import { toast } from "@/components/common/toaster";
import { Button } from "@/components/common/button";
import GroupInfo4Mobile from "./_components/group-info";
import GroupTags4Mobile from "./_components/group-tags";
import InviteType4Mobile from "./_components/invite-type";
import { CustomTagInput4Mobile } from "./_components/custom-tag-input-4-mobile";

import { groupCreationSchema } from "@/lib/validations";
import { useCreateGroup } from "@/lib/api/group";
import { ImageData } from "@/lib/types";
import { useUserState } from "@/lib/store/account";
import { MappedMember } from "@/lib/actions";
import { GroupAchievemtProps, MemberProps } from "@/lib/types/member";
import { Roles } from "@/lib/enums";
import { useGetTalentInfinitely } from "@/lib/api/talent";
import { mapTalentData } from "@/lib/actions";

import { useMobileContext } from "@/providers/mobile-context-provider";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { useOnClickOutside } from "usehooks-ts";
import { Check, Loader, X } from "lucide-react";
import { SnowProfile } from "@/components/common/snow-profile";
import { truncateText } from "@/lib/utils";
import { CustomInput } from "@/components/common/custom-input";
import { PageEmpty } from "@/components/common/page-empty";

type GroupInviteType = "open" | "close" | "private";

type GroupFormInputs = z.infer<typeof groupCreationSchema>;

export default function CreateGroupsPage4Mobile(): ReactElement | null {
	const router = useRouter();
	const ref = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLDivElement | null>(null);

	const [imageData, setImageData] = useState<ImageData>();
	const { mutate: createGroup, isLoading } = useCreateGroup();

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<GroupFormInputs>({
		resolver: zodResolver(groupCreationSchema),
	});

	const inviteType = useWatch({ control, name: "inviteType" });

	const onSubmit = (data: GroupFormInputs) => {
		const invites = data?.invites.map((invite: any) => invite._id);
		const adminInvites = data.admins
			? data?.admins.map((admin: any) => admin._id)
			: [];

		const groupData = {
			name: data.name,
			description: data.description,
			tags: data.tags,
			image: imageData?._id,
			inviteType: data.inviteType,
			memberInvites: invites,
			...(adminInvites.length > 0 ? { adminInvites: adminInvites } : []),
		};

		createGroup(groupData, {
			onSuccess: (data: any) => {
				router.push(`/groups/${data?._id}`);
			},
		});
	};

	const userState = useUserState();

	const [selectedMembers, setSelectedMembers] = useState<MappedMember[]>([]);
	const [selectedAdmins, setSelectedAdmins] = useState<MappedMember[]>([]);

	const preselectedMember: MappedMember = {
		_id: userState?._id,
		name: `${userState?.firstName} ${userState?.lastName}`,
		title: userState?.role,
		image: userState?.profileImage?.url || "",
		skills: [{ name: "", color: "" }],
		score: userState?.score || 0,
		type: Roles.EMPTY,
		role: Roles.EMPTY,
		achievements: userState.achievements as GroupAchievemtProps,
		nftTokenNumber: userState?.meta?.tokenId,
	};

	const handleUploadComplete = (data: any) => {
		setImageData(data);
		setValue("image", data?.url);
	};

	const inviteTypeOptions: GroupInviteType[] = ["open", "close", "private"];

	const prevPageRef = useRef(0);
	const currentPageRef = useRef(1);

	const limit = 10;

	const [searchTerm, setSearchTerm] = useState("");
	const [skillTag, setSkillsTag] = useState("");

	const { showMemberSearch, setShowMemberSearch } = useMobileContext();

	const seeMore = false;

	const handleClickOutside = (): void => {
		setShowMemberSearch(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	const {
		data: talentPagesData,
		refetch: talentRefetch,
		isLoading: isTalentFetching,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetTalentInfinitely({
		limit: 10,
		filter: {
			orderBy: "desc",
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
			setValue("invites", updatedSelection);
			setSelectedMembers(updatedSelection);
		} else {
			if (selectedMembers.length < limit) {
				const updatedSelection = [...selectedMembers, member];
				updatedSelection;
				setValue("invites", updatedSelection);
				setSelectedMembers(updatedSelection);
			} else {
				toast.error(
					`You cannot select more than ${limit} member${limit > 1 ? "s" : ""}.`
				);
			}
		}
	};

	const isSelected = (id: string) =>
		selectedMembers.some((m) => m._id === id);

	const typedMembers = currentData
		.map(mapTalentData)
		.filter(
			(member) =>
				!selectedAdmins?.some(
					(excluded) => excluded._id === member._id
				) && member._id !== userState?._id
		);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.stopPropagation();
		debouncedSearch(event.target.value);
	};

	const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.stopPropagation();
		debouncedTagSearch(event.target.value);
	};

	return (
		<>
			<div className=" flex h-full w-full flex-col gap-6 overflow-scroll bg-ink-darkest/40 from-white via-transparent to-white px-4   backdrop-blur-sm lg:flex-row">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex h-full w-full flex-col gap-4 overflow-scroll py-4 pb-20 lg:w-4/5"
				>
					<GroupInfo4Mobile
						control={control}
						errors={errors}
						onUploadComplete={handleUploadComplete}
					/>
					<CardView className="flex w-full flex-col gap-6 !border-none !bg-ink-darkest/0 !p-0 !backdrop-blur-none">
						<GroupTags4Mobile control={control} errors={errors} />

						<div className=" flex w-full flex-col gap-2 border-t border-white/40 pt-4">
							<span className="flex flex-col gap-1 text-lg font-bold text-white">
								<p>Invite group members </p>
								<span className="text-sm font-normal text-white/80">
									Invite as many as you want
								</span>
							</span>
							<Controller
								name="invites"
								control={control}
								defaultValue={[]}
								render={({ field }) => (
									<CustomTagInput4Mobile
										title="Invite Members to Group"
										inviteText="Click to select members..."
										className="!rounded-md"
										type="regular"
										limit={10}
										onChange={(members) => {
											field.onChange(members);
											setSelectedMembers(members);
										}}
										onClick={() => {
											setShowMemberSearch(true);
										}}
										selectedMembers={selectedMembers}
										excludedMembers={selectedAdmins}
										user={userState}
									/>
								)}
							/>
							{errors.invites && (
								<span className="text-xs text-red-500">
									{errors.invites.message}
								</span>
							)}
						</div>
						<div className="flex w-full flex-col gap-2">
							<p className="text-lg font-bold text-white">
								Group admin{" "}
								{/* <span className="text-sm font-normal text-white/80">
						You can have up to 3 admin including you
					</span> */}
							</p>
							<Controller
								name="admins"
								control={control}
								defaultValue={[]}
								render={({ field }) => (
									<CustomTagInput4Mobile
										title={"Invite Admin to Group"}
										//inviteText="Click to select members..."
										type="admin"
										limit={4}
										onChange={(admins) => {
											field.onChange(admins);
											setSelectedAdmins(admins);
										}}
										excludedMembers={selectedMembers}
										preselectedMember={preselectedMember}
										user={userState}
										className={
											" !cursor-default !rounded-md"
										}
										noClickAllowed={true}
									/>
								)}
							/>
							{errors.admins && (
								<span className="text-xs text-red-500">
									{errors.admins.message}
								</span>
							)}
						</div>

						<div className="flex w-full flex-col items-center justify-between gap-6">
							<InviteType4Mobile
								control={control}
								errors={errors}
								inviteTypeOptions={inviteTypeOptions}
								currentInviteType={inviteType}
							/>
							<Button
								type="submit"
								variant={"default"}
								disabled={isLoading}
								className={
									isLoading
										? "text-grey z-[100000] w-full !bg-white"
										: " w-full"
								}
							>
								{isLoading ? "Creating..." : "Create Group"}
							</Button>
							<div className="h-[30px]"></div>
						</div>
					</CardView>
				</form>
			</div>

			<div
				className={`b_modal fixed bottom-0 left-0  flex max-h-[75vh] w-full shrink-0 flex-col gap-4 rounded-t-2xl !bg-[#000000] px-5 py-2 font-circular transition-all duration-300 ease-in-out sm:hidden ${
					showMemberSearch
						? "!bottom-0 !z-[999]"
						: "!-bottom-full !z-0"
				}`}
				ref={ref}
			>
				<span className="mt-4 flex w-full items-center justify-between">
					<h2 className="flex justify-start text-left text-xl font-bold text-white">
						Invite Members to Group
					</h2>

					<X
						className="h-6 w-6 rounded-md bg-opacity-30 text-zinc-300"
						onClick={(e) => {
							e.stopPropagation();
							setShowMemberSearch(false);
						}}
						onKeyDown={() => {
							setShowMemberSearch(false);
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
						label={"Interests"}
						placeholder="e.g. Gaming, DeFi, Memes"
						wrapper="w-full !gap-2"
						onChange={handleTagChange}
					/>
				</CardView>
				<div className="flex flex-1 flex-col gap-4 overflow-y-auto">
					{isLoading ? (
						<div className="flex justify-center">
							<Loader
								size={14}
								className="animate-spin text-center text-white"
							/>
						</div>
					) : typedMembers.length > 0 ? (
						<>
							{typedMembers.map((member, index) => (
								<div
									key={member._id}
									className={`b flex cursor-pointer items-center justify-between rounded-md p-2 ${index + 1 === typedMembers.length}`}
									onClick={() => handleSelectMember(member)}
								>
									<div className="flex gap-4">
										<SnowProfile
											src={member.image}
											score={
												parseInt(
													member?.nftTokenNumber || ""
												) || 0
											}
											size="sm"
										/>
										<div className="flex flex-col">
											<span className="text-lg font-bold text-white">
												{truncateText(
													member.name,
													17,
													seeMore
												)}
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
								className="mb-6 h-4"
								ref={observerTarget}
							></div>
						</>
					) : (
						<PageEmpty
							className="h-[250px] !py-16"
							label="No Talent Available"
						/>
					)}
				</div>

				{isFetchingNextPage ||
					(isTalentFetching && (
						<div className="flex h-[10] justify-center text-white">
							<Loader
								size={14}
								className="animate-spin text-center text-white"
							/>
						</div>
					))}
				{error && <div>{error?.message}</div>}
				<Button
					type="button"
					className="z-[100000] w-full border-none py-2 font-bold"
					fullWidth
					variant="default"
					onClick={(e) => {
						e.stopPropagation();
						setShowMemberSearch(!showMemberSearch);
					}}
				>
					Add Selected
				</Button>
				<div className="h-[30px]" ref={buttonRef}></div>
			</div>
		</>
	);
}
