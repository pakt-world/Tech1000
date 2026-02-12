/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/common/popover";
import { Button } from "@/components/common/button";
import {
	Command,
	CommandGroup,
	CommandItem,
} from "@/components/common/command";
import { CustomInput } from "@/components/common/custom-input";
import { GroupInviteType } from "@/lib/enums";

interface InviteTypeProps {
	control: any;
	errors: any;
	inviteTypeOptions: string[];
	currentInviteType: string;
}

type InviteInfo = { text: string; exp: string };

const convertInviteTypeToText = (inviteType: GroupInviteType): InviteInfo => {
	switch (inviteType) {
		case GroupInviteType.Open:
			return {
				text: "Public",
				exp: "Anyone can Join",
			};
		case GroupInviteType.Close:
			return {
				text: "Private",
				exp: "Invite or application only",
			};
		case GroupInviteType.Private:
			return {
				text: "Secret",
				exp: "Invite Only",
			};
		default:
			return {
				text: "Public",
				exp: "Anyone can Join",
			};
	}
};

const InviteType: React.FC<InviteTypeProps> = ({
	control,
	errors,
	inviteTypeOptions,
	currentInviteType,
}) => {
	const [popoverOpen, setPopoverOpen] = useState(false);

	const handleSelect = (item: string, field: any) => {
		field.onChange(item);
		setPopoverOpen(false);
	};

	return (
		<div className="flex gap-10">
			<Controller
				name="inviteType"
				control={control}
				render={({ field }) => (
					<div className="flex flex-col gap-1">
						<Popover
							open={popoverOpen}
							onOpenChange={setPopoverOpen}
						>
							<PopoverTrigger asChild>
								<Button
									role="combobox"
									className="flex w-full min-w-[150px] justify-between rounded-3xl border border-[#E8E8E833] bg-[#FCFCFD1A] px-4 py-3 text-base text-white md:min-w-[320px]"
								>
									{field.value ? (
										<div className="flex items-end gap-2">
											<span className="text-white">
												{
													convertInviteTypeToText(
														field.value
													).text
												}
											</span>
										</div>
									) : (
										<span className="text-white">
											Select option
										</span>
									)}
									<ChevronDown
										size={25}
										className="ml-2 size-4 shrink-0 text-white opacity-50"
									/>
								</Button>
							</PopoverTrigger>

							<PopoverContent
								side="bottom"
								align="start"
								className="relative z-50 w-fit rounded-[16px] border-2 border-white/20 bg-ink-darkest/60 from-ink-dark/60 via-transparent to-white p-2 backdrop-blur-md"
							>
								<Command>
									<CommandGroup>
										{inviteTypeOptions.map(
											(item, index) => (
												<CommandItem
													key={index}
													value={item}
													onSelect={() =>
														handleSelect(
															item,
															field
														)
													}
													className="flex cursor-pointer items-center justify-between text-sm text-white"
												>
													<div className="flex items-end gap-2">
														<span className="text-md flex gap-2 font-circular font-bold text-white">
															{
																convertInviteTypeToText(
																	item as GroupInviteType
																).text
															}{" "}
															<p className="font-normal text-[#FFFFFF99]">
																(
																{
																	convertInviteTypeToText(
																		item as GroupInviteType
																	).exp
																}
																)
															</p>
														</span>
													</div>
												</CommandItem>
											)
										)}
									</CommandGroup>
								</Command>
							</PopoverContent>
						</Popover>
						{errors.inviteType && (
							<p className="mt-1 text-xs text-red-500">
								Required
							</p>
						)}
					</div>
				)}
			/>
			{currentInviteType === "anyone_with_certain_score" && (
				<div className="flex gap-1">
					<Controller
						name="minScore"
						control={control}
						render={({ field }) => (
							<CustomInput
								{...field}
								type="number"
								wrapper="rounded-full"
								className="!rounded-3xl"
								placeholder="Enter Minimum Score"
							/>
						)}
					/>
					{errors.minScore && (
						<span className="text-red-500">
							{errors.minScore.message}
						</span>
					)}
				</div>
			)}
		</div>
	);
};

export default InviteType;
