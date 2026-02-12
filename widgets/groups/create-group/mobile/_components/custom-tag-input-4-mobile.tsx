/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { FC, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { SnowProfile } from "@/components/common/snow-profile";
import { type MappedMember } from "@/lib/actions";

import { AccountProps } from "@/lib/types/account";

interface TagInputProps {
	onChange?: (selected: MappedMember[]) => void;
	title: string;
	inviteText?: string;
	limit?: number;
	type: "admin" | "regular";
	creator?: MappedMember;
	preselectedMember?: MappedMember;
	excludedMembers?: MappedMember[];
	selectedMembers?: MappedMember[];
	user?: AccountProps;
	className?: string;
	noClickAllowed?: boolean;
	onClick?: () => void;
}

export const CustomTagInput4Mobile: FC<TagInputProps> = ({
	onChange,
	inviteText,
	type,
	creator,
	preselectedMember,
	selectedMembers,
	className,
	noClickAllowed,
	onClick,
}) => {
	const buttonRef = useRef<HTMLDivElement>(null);
	const [localState, setLocalState] = useState<MappedMember[]>(
		selectedMembers || []
	);

	const handleRemoveMember = (id: string) => {
		if (id === creator?._id && type === "admin") return;

		const updatedSelection = localState?.filter((m) => m._id !== id);
		setLocalState(updatedSelection);
		onChange?.(updatedSelection || []);
	};

	const handleCardClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		if (noClickAllowed) return;
		const target = event.target as HTMLElement;
		if (target.closest(".data-member-button")) {
			return;
		}
		onClick?.();
	};

	useEffect(() => {
		setLocalState(selectedMembers || []);
		onChange?.(selectedMembers || []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedMembers]);

	return (
		<div>
			<div
				className={`!-z-10 flex h-full w-full cursor-pointer flex-wrap !items-start justify-start gap-2 border-opacity-30 !bg-[#FCFCFD1A] !p-4 md:min-h-[130px] ${className}`}
				onClick={handleCardClick}
			>
				{preselectedMember && (
					<div
						key={preselectedMember._id}
						className="data-member-button z-[2] flex items-center space-x-2 rounded-xl border border-[#CAE7BE] bg-white p-2"
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
				{localState?.length === 0 ? (
					<span className="text-[#72777A]">{inviteText}</span>
				) : (
					localState?.map((member) => (
						<div
							ref={buttonRef}
							key={member._id}
							className="data-member-button  flex items-center space-x-2 rounded-xl border border-[#CAE7BE] bg-white p-2"
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
			</div>
		</div>
	);
};
