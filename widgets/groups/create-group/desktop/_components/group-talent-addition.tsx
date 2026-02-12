/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useState } from "react";
import { Controller } from "react-hook-form";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { CustomTagInput } from "@/widgets/groups/_shared/custom-tag-input";
import { useUserState } from "@/lib/store/account";
import { MappedMember } from "@/lib/actions";
import { Roles } from "@/lib/enums";
import { GroupAchievemtProps } from "@/lib/types/member";

interface TalentAdditionProps {
	control: any;
	errors: any;
}

const TalentAddition: React.FC<TalentAdditionProps> = ({ control, errors }) => {
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

	return (
		<>
			<div className="flex w-full flex-col gap-2">
				<p className="text-lg font-bold text-white">
					Invite group members{" "}
					<span className="text-sm font-normal text-white/80">
						Invite as many as you want
					</span>
				</p>
				<Controller
					name="invites"
					control={control}
					defaultValue={[]}
					render={({ field }) => (
						<CustomTagInput
							title="Invite Members to Group"
							inviteText="Click to select members..."
							type="regular"
							limit={10}
							onChange={(members) => {
								field.onChange(members);
								setSelectedMembers(members);
							}}
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
						<CustomTagInput
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
							className={" !cursor-default"}
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
		</>
	);
};

export default TalentAddition;
