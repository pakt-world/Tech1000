"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { AlertCircle, ChevronLeft, Edit3 } from "lucide-react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { GallerySvg } from "@/components/common/gallery-svg";

import { FloatingAvatars } from "../misc/floating-avatars";
import { UploadProgress } from "../misc/upload-progress";
import { type UPIProps } from "../types";

export function MobileProfileImage({
	isOnboarding,
	getRootProps,
	getInputProps,
	imageFile,
	isFileTooLarge,
	isDragReject,
	uploadImage,
	updateAccount,
	handleUpload,
	uploadProgress,
	goToPreviousSlide,
}: UPIProps): JSX.Element {
	return (
		<div className="max-h-auto relative flex w-full shrink-0 flex-col items-center gap-4 sm:hidden">
			{isOnboarding && (
				<div className="relative flex w-full items-center justify-between">
					<Button
						size="sm"
						className="w-max !border-white"
						onClick={goToPreviousSlide}
						variant="outline"
					>
						<ChevronLeft className="size-4 text-white" />
					</Button>
					<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white">
						Create Your Avatar
					</span>
					<div className="" />
				</div>
			)}
			<div className="container_style relative flex h-[539px] w-full shrink-0 flex-col items-center justify-center gap-4 rounded-2xl sm:hidden">
				<FloatingAvatars />
				<div
					className="group relative z-50 flex size-[250px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-200 border-opacity-20 bg-stone-800 duration-200 hover:bg-opacity-30"
					{...getRootProps()}
				>
					<input {...getInputProps()} />
					<div className="flex flex-col items-center gap-2 text-center ">
						<GallerySvg />
						<span className="flex flex-col gap-1 text-body">
							<span>Click or drag and drop</span>
							<span> to upload</span>
						</span>
					</div>

					<div className="absolute inset-0 flex items-center justify-center">
						{imageFile != null && (
							<Image
								src={imageFile.preview}
								alt="profile picture"
								layout="fill"
								objectFit="cover"
							/>
						)}
					</div>

					{imageFile != null && (
						<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
							<div className="mt-10 flex items-center gap-2 !rounded-lg border border-primary bg-neutral-200 px-2 py-1 text-primary opacity-0 duration-200 group-hover:opacity-100">
								<Edit3 size={24} />
								<span className="text-sm">Change Image</span>
							</div>
						</div>
					)}
				</div>

				{isFileTooLarge && (
					<div className="flex items-center gap-1 text-sm text-red-500">
						<AlertCircle size={16} />
						<span>File size should be less than 2MB</span>
					</div>
				)}

				{isDragReject && (
					<div className="flex items-center gap-1 text-sm text-red-500">
						<AlertCircle size={16} />
						<span>File type not supported</span>
					</div>
				)}

				<div className="!z-[100] flex h-[80px] w-full items-center justify-center opacity-100">
					{uploadImage.isLoading || updateAccount.isLoading ? (
						<div className="z-20 w-full max-w-[300px]">
							<UploadProgress progress={uploadProgress} />
						</div>
					) : (
						<div className="!z-20 w-full max-w-[300px]">
							<Button
								fullWidth
								disabled={imageFile == null || isFileTooLarge}
								onClick={handleUpload}
								variant="white"
								className=""
							>
								Upload Image
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
