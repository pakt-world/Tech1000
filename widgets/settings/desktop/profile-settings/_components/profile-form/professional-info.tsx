"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronRight, ChevronDown } from "lucide-react";
import { Textarea } from "pakt-ui";
import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type z } from "zod";

import { TagInput } from "@/components/common/tag-input";
import { type editProfileFormSchema } from "@/lib/validations";
import CardView from "@/components/common/card-view";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface FormProps {
	form: UseFormReturn<EditProfileFormValues>;
}

const ProfessionalInfo = ({ form }: FormProps): JSX.Element => {
	const [showInfo, setShowInfo] = useState(false);
	const isPartner = form.watch("title") === "Partner";
	return (
		<div
			className={`relative overflow-hidden rounded-lg ${showInfo ? "h-fit" : "h-[86px]"} transition-all duration-300`}
		>
			<CardView className="flex !h-fit flex-col gap-6 !p-6">
				<div
					className="relative z-50 flex w-full cursor-pointer flex-row items-center justify-between rounded-lg "
					onClick={() => {
						setShowInfo(!showInfo);
					}}
					role="button"
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setShowInfo(!showInfo);
						}
					}}
					tabIndex={0}
				>
					<p className="text-lg font-bold text-white">
						{" "}
						Professional Information
					</p>
					{showInfo ? (
						<ChevronDown className="text-white" />
					) : (
						<ChevronRight className="text-white" />
					)}
				</div>

				{/* <div className="container_style my-4 flex w-full flex-col gap-4 rounded-lg p-4"> */}
				<div
					className={` ${showInfo ? "flex" : "hidden"} w-full flex-row gap-4`}
				>
					<div className="relative w-1/2">
						<p className="mb-2 text-[16px] text-white">
							{isPartner ? "Specialty" : "Interests"}
						</p>
						<div className="input-style min-h-[186px] overflow-x-hidden rounded-lg">
							<Controller
								name="tags"
								control={form.control}
								render={({
									field: { onChange, value = [], onBlur },
								}) => (
									<TagInput
										tags={value}
										setTags={onChange}
										className="grow items-start border-none bg-transparent !text-white"
										placeholder={
											value?.length === 1 &&
											value?.length < 3
												? "Must add two more. Can add up to 10."
												: value?.length === 2 &&
													  value?.length < 3
													? "Must add one more. Can add up to 10."
													: value?.length < 3
														? isPartner
															? "Enter your specialty, then press enter."
															: "Enter your interests, then press enter."
														: value?.length > 3 &&
															  value?.length ===
																	10
															? ""
															: value?.length >= 3
																? `You can add ${10 - value.length} more interest${10 - value.length === 1 ? "" : "s"}`
																: ""
										}
										disabled={value?.length === 10}
										form={form}
										onBlur={onBlur}
									/>
								)}
							/>
						</div>
						<span className="absolute -bottom-2 flex w-full">
							{form.formState.errors.tags?.message && (
								<span className="text-sm text-red-500">
									{form.formState.errors.tags?.message}
								</span>
							)}
						</span>
					</div>
					<div className="relative w-1/2">
						<p className="mb-2 text-[16px] text-white">Bio</p>
						<Textarea
							maxLength={350}
							className="input-style !min-h-[186px] w-full p-2 !text-white"
							{...form.register("bio")}
							placeholder="Enter a description of your abilities, approaches, and ambitions (up to 350 characters)."
							rows={10} // Number of rows, can be adjusted as needed
							cols={50} // Number of columns, can be adjusted as needed
						/>
						<div className="ml-auto w-fit text-sm text-white">
							{form.watch("bio")?.length ?? 0}/350
						</div>

						<span className="absolute -bottom-2 flex w-full">
							{form.formState.errors.bio?.message && (
								<span className="text-sm text-red-500">
									{form.formState.errors.bio?.message}
								</span>
							)}
						</span>
					</div>
				</div>
			</CardView>
		</div>
	);
};

export default ProfessionalInfo;
