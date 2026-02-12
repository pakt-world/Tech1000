"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Check, Loader, X } from "lucide-react";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import { CustomInput } from "@/components/common/custom-input";
import { SnowProfile } from "@/components/common/snow-profile";
import { PageEmpty } from "@/components/common/page-empty";
import { MappedMember } from "@/lib/actions";
import { truncateText } from "@/lib/utils";

interface MemberSearchProps {
	title: string;
	handleSearchChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
	handleTagChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
	type: "admin" | "regular";
	isLoading: boolean;
	typedMembers: any[];
	handleSelectMember: (member: any) => void;
	isSelected: (id: string) => boolean;
	observerTarget: React.RefObject<HTMLDivElement>;
	isFetchingNextPage: boolean;
	error: any;
	setShowMemberSearch: (value: boolean) => void;
	showMemberSearch: boolean;
	selectedMembers: MappedMember[];
}

export const MemberListView4Addition = ({
	title,
	handleSearchChange,
	handleTagChange,
	type,
	isLoading,
	typedMembers,
	handleSelectMember,
	isSelected,
	observerTarget,
	isFetchingNextPage,
	error,
	setShowMemberSearch,
	showMemberSearch,
}: MemberSearchProps): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLDivElement | null>(null);

	const seeMore = false;

	const handleClickOutside = (): void => {
		setShowMemberSearch(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	return (
		<>
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
						{title}
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
						label={type === "admin" ? "Interests" : "Skills"}
						placeholder="e.g. Gaming, DeFi, Memes"
						wrapper="w-full !gap-2"
						onChange={handleTagChange}
					/>
				</CardView>
				<div className="flex flex-1 flex-col gap-4 overflow-y-auto">
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
				{isFetchingNextPage && (
					<div className="flex h-[10] justify-center text-white">
						<Loader
							size={25}
							className="animate-spin text-center text-white"
						/>
					</div>
				)}
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
};
