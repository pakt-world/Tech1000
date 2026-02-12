"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Check, ChevronDown, Mail, MapPin, Verified } from "lucide-react";
import { type ReactElement } from "react";
import { type UseFormReturn } from "react-hook-form";
import type * as z from "zod";

import { Button } from "@/components/common/button";
import {
	Command,
	CommandGroup,
	CommandItem,
} from "@/components/common/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/common/popover";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { UploadAvatar } from "@/components/common/upload-avatar";
import { cn, sentenceCase, sentenceCase2, truncateEmail } from "@/lib/utils";
import { type editProfileFormSchema } from "@/lib/validations";
import { Roles } from "@/lib/enums";
import CardView from "@/components/common/card-view";

const ProfileStates: Array<{ label: string; value: string }> = [
	{ label: "Private", value: "true" },
	{ label: "Public", value: "false" },
];

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface BasicInfoProps {
	form: UseFormReturn<EditProfileFormValues>;
	toggleUserProfile: (e: string) => void;
	refetchUser: () => void;
	userData: {
		firstName: string;
		lastName: string;
		title?: string;
		bio: string;
		location: string;
		country: string;
		avatar: string;
		kycVerified: boolean;
		tags: string[];
		isPrivate: boolean;
		email: string;
		website: string;
		x: string;
		tiktok: string;
		instagram: string;
		github: string;
		role?: string;
		meta?: {
			imageUrl: string;
			pointScore: number;
			tokenId?: string;
		};
	};
}

const BasicInfo = ({
	userData,
	form,
	toggleUserProfile,
	refetchUser,
}: BasicInfoProps): ReactElement => {
	const visibility = form.watch("isPrivate") ? "Private" : "Public";

	return (
		// <div className="container_style relative flex h-fit w-full flex-col items-center rounded-lg">
		<CardView className=" relative flex h-fit w-full flex-col items-center !p-2">
			<div className=" flex flex-col p-4">
				<span className="absolute right-[10px] top-[10px] w-max rounded-xl bg-[#27AE604D]  p-2 text-sm font-thin capitalize leading-none text-white">
					{form.getValues().isPrivate ? "Private" : "Public"}
				</span>

				{/* <div className="flip-container !h-[200px] !w-full">
					<div className="flip-inner flex items-center">
						<div className="flip-front "> */}
				<div className="item-center mx-auto mb-3 flex flex-col justify-center gap-2 text-center">
					<UploadAvatar
						size={150}
						image={userData.avatar}
						onUploadComplete={refetchUser}
					/>
				</div>
				{/* </div> */}
				{/* <div className="flip-back">
							<Image
								alt="nft"
								src={userData?.meta?.imageUrl || ""}
								priority
								className="cursor-pointer rounded-lg object-contain"
								width={120}
								height={100}
							/>
						</div> */}
				{/* </div>
				</div> */}
				<div className="mb-1.5 flex flex-row items-center justify-center">
					{userData.title === sentenceCase(Roles.PARTNER) ? (
						<p className="text-lg font-bold text-white">
							{userData.firstName}
						</p>
					) : (
						<p className="text-lg font-bold text-white">
							{userData?.firstName} {userData?.lastName}
						</p>
					)}
					{userData?.kycVerified && (
						<Verified className="ml-2 text-white" />
					)}
				</div>
				<div className="mb-2 flex flex-row items-center justify-center text-white">
					<Mail className="mr-2" />
					<p className="text-base font-thin text-white">
						{truncateEmail(userData?.email, 15)}
					</p>
				</div>
				<div className="flex flex-row items-center justify-center text-white">
					{userData?.location && userData?.country && (
						<>
							<MapPin className="mr-2" />
							<p className="text-base font-thin text-white">
								{sentenceCase2(userData?.location)},{" "}
								{sentenceCase2(userData?.country)}
							</p>
						</>
					)}
				</div>
				<div className="mt-5 flex flex-col">
					<span className="mb-3 text-sm leading-[21px] tracking-wide text-white">
						Profile Visibility
					</span>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								role="combobox"
								className="input-style h-12 w-full justify-between rounded-lg p-3 text-base !text-white"
							>
								{visibility ? (
									<div className="flex items-end gap-2">
										<span>{visibility}</span>
									</div>
								) : (
									<span>Select Visibility...</span>
								)}
								<ChevronDown
									color="#ffffff"
									className="ml-2 size-4 shrink-0 !text-white "
								/>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="PopoverContent container_style rounded-[6px]  p-0">
							<Command>
								<CommandGroup>
									{ProfileStates.map(({ label, value }) => (
										<CommandItem
											key={value}
											value={value}
											onSelect={(
												currentValue: string
											) => {
												toggleUserProfile(currentValue);
											}}
											className="flex cursor-pointer items-center justify-between text-sm text-white hover:!text-lemon-green"
										>
											<div className="flex items-end gap-2">
												<span className="">
													{label}
												</span>
											</div>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													label === visibility
														? "opacity-100"
														: "opacity-0"
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
					<p className="my-4 text-sm text-white">
						Your visibility settings determine if your profile is
						searchable.
					</p>
				</div>
			</div>
		</CardView>
		// </div>
	);
};

export default BasicInfo;
