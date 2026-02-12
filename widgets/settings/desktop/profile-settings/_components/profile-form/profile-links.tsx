"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as Form from "@radix-ui/react-form";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type editProfileFormSchema } from "@/lib/validations";
import CardView from "@/components/common/card-view";
import { CustomInput } from "@/components/common/custom-input";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface FormProps {
	form: UseFormReturn<EditProfileFormValues>;
}

export const ProfileLinks = ({ form }: FormProps): JSX.Element => {
	const [showLinks, setShowLinks] = useState(false);

	return (
		<div
			className={`relative overflow-hidden rounded-lg ${showLinks ? "h-fit" : "h-[86px]"} transition-all duration-300`}
		>
			<CardView className="flex !h-fit flex-col gap-6 !p-6">
				<div
					className="relative z-50 flex w-full cursor-pointer flex-row items-center justify-between rounded-lg"
					onClick={() => {
						setShowLinks(!showLinks);
					}}
					role="button"
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setShowLinks(!showLinks);
						}
					}}
					tabIndex={0}
				>
					<p className="text-lg font-bold text-white">
						Profile Links
					</p>
					{showLinks ? (
						<ChevronDown className="text-white" />
					) : (
						<ChevronRight className="text-white" />
					)}
				</div>
				<div
					className={` ${showLinks ? "flex" : "hidden"} w-full flex-col gap-4`}
				>
					<div className="flex flex-row gap-4">
						<Form.Field name="lastName" className="relative w-1/2">
							{/* <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
								Website
							</Form.Label>
							<input
								{...form.register("website")}
								className="h-12 w-full rounded-lg border border-gray-200 border-opacity-20 !bg-primary-light px-4 py-[13px] !text-white outline-none"
								placeholder="Enter website url"
							/> */}

							<CustomInput
								htmlFor="website"
								type="text"
								label="Website"
								placeholder="Enter website url"
								register={form.register("website")}
							/>
							<span className="absolute -bottom-6 flex w-full">
								{form.formState.errors.website?.message && (
									<span className="text-sm text-red-500">
										{form.formState.errors.website?.message}
									</span>
								)}
							</span>
						</Form.Field>
						<Form.Field name="lastName" className="relative w-1/2">
							{/* <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
								X
							</Form.Label>
							<input
								{...form.register("x")}
								className="h-12 w-full rounded-lg border border-gray-200 border-opacity-20 !bg-primary-light px-4 py-[13px] !text-white"
								placeholder="Enter x url"
							/> */}
							<CustomInput
								htmlFor="x"
								type="text"
								label="X"
								placeholder="Enter x url"
								register={form.register("x")}
							/>
							<span className="absolute -bottom-6 flex w-full">
								{form.formState.errors.x?.message && (
									<span className="text-sm text-red-500">
										{form.formState.errors.x?.message}
									</span>
								)}
							</span>
						</Form.Field>
					</div>
					<div className="flex flex-row gap-4">
						<Form.Field name="lastName" className="relative w-1/2">
							{/* <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
								Tiktok
							</Form.Label>
							<input
								{...form.register("tiktok")}
								className="h-12 w-full rounded-lg border border-gray-200 border-opacity-20 !bg-primary-light px-4 py-[13px] !text-white"
								placeholder="Enter tiktok url"
							/> */}
							<CustomInput
								htmlFor="tiktok"
								type="text"
								label="Tiktok"
								placeholder="Enter tiktok url"
								register={form.register("tiktok")}
							/>
							<span className="absolute -bottom-6 flex w-full">
								{form.formState.errors.tiktok?.message && (
									<span className="text-sm text-red-500">
										{form.formState.errors.tiktok?.message}
									</span>
								)}
							</span>
						</Form.Field>
						<Form.Field name="lastName" className="relative w-1/2">
							{/* <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
								Instagram
							</Form.Label>
							<input
								{...form.register("instagram")}
								className="h-12 w-full rounded-lg border border-gray-200 border-opacity-20 !bg-primary-light px-4 py-[13px] !text-white"
								placeholder="Enter instagram url"
							/> */}

							<CustomInput
								htmlFor="instagram"
								type="text"
								label="Instagram"
								placeholder="Enter instagram url"
								register={form.register("instagram")}
							/>
							<span className="absolute -bottom-6 flex w-full">
								{form.formState.errors.instagram?.message && (
									<span className="text-sm text-red-500">
										{
											form.formState.errors.instagram
												?.message
										}
									</span>
								)}
							</span>
						</Form.Field>
					</div>
					<div className="flex flex-row gap-4">
						<Form.Field name="lastName" className="relative w-1/2">
							{/* <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
								Github
							</Form.Label>
							<input
								{...form.register("github")}
								className="h-12 w-full rounded-lg border border-gray-200 border-opacity-20 !bg-primary-light px-4 py-[13px] !text-white"
								placeholder="Enter github url"
							/> */}
							<CustomInput
								htmlFor="github"
								type="text"
								label="Github"
								placeholder="Enter github url"
								register={form.register("github")}
							/>
							<span className="absolute -bottom-6 flex w-full">
								{form.formState.errors.github?.message && (
									<span className="text-sm text-red-500">
										{form.formState.errors.github?.message}
									</span>
								)}
							</span>
						</Form.Field>
					</div>
				</div>
			</CardView>
		</div>
	);
};
