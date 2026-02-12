"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { AlertCircle, Edit3, FolderOpen } from "lucide-react";
import Image from "next/image";
// import { ArrowLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Button } from "@/components/common/button";
import { GallerySvg } from "@/components/common/gallery-svg";

import { FloatingAvatars } from "../misc/floating-avatars";
import { UploadProgress } from "../misc/upload-progress";
import { type UPIProps } from "../types";

export function DesktopUploadProfileImage({
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
	// goToPreviousSlide,
	// handleSkipView,
	btnDescription,
}: UPIProps): JSX.Element {
	const renderPreview = () => {
		if (!imageFile) return null;

		const { type, preview, name } = imageFile;

		switch (true) {
			case type?.startsWith("image/"):
				return (
					<Image
						src={preview}
						alt="Profile Picture"
						layout="fill"
						objectFit="cover"
					/>
				);
			case type?.startsWith("video/"):
				return (
					<div className="flex h-full w-full flex-col items-center justify-center bg-slate-300 px-4 text-start font-circular">
						<video controls>
							<source src={preview} type={type} />
							Your browser does not support the video tag.
							<p className="font-lg text-center font-semibold text-black">
								{name} vdeo
							</p>
						</video>
					</div>
				);
			case type === "application/pdf":
				return (
					<div className="flex h-full w-full flex-col items-center justify-center bg-slate-300 px-4 text-start font-circular">
						<FolderOpen size={50} fill="true" />
						<p className="font-lg text-center font-semibold text-black">
							{name}
						</p>
					</div>
				);
			default:
				return (
					<Image
						src={preview}
						alt="Unsupported media type"
						layout="fill"
						objectFit="cover"
					/>
				);
		}
	};

	return (
		<div className="relative hidden w-full shrink-0 flex-col items-center justify-center gap-4 sm:flex">
			{/* {isOnboarding && (
				<div className="absolute z-[1000] mb-2 flex w-full justify-between">
					<Button
						type="button"
						size="sm"
						variant={"outline"}
						className=" border border-ink-darkest px-4 py-2 text-ink-darkest hover:border-white dark:border-ink-darkest"
						onClick={goToPreviousSlide}
					>
						<span className="flex justify-between gap-4">
							<ArrowLeft size={18} /> <p> Go Back</p>
						</span>
					</Button>
					<Button
						type="button"
						size="sm"
						variant={"outline"}
						className="h-auto border border-ink-darkest px-8 py-1 text-ink-darkest hover:border-white dark:border-ink-darkest"
						onClick={handleSkipView}
					>
						Skip
					</Button>
				</div>
			)} */}
			<FloatingAvatars />
			{isOnboarding && (
				<div className="flex flex-col items-center text-body">
					<span className="text-2xl font-bold text-white">
						Create Your Avatar
					</span>
					<span className="text-lg leading-[27px] tracking-wide text-neutral-400">
						Upload an image for your avatar
					</span>
				</div>
			)}

			<div
				className="group relative flex size-[270px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-200 border-opacity-20 bg-stone-800 duration-200 hover:bg-opacity-30"
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
					{imageFile != null && <>{renderPreview()} </>}
				</div>

				{imageFile != null && (
					<div className="absolute inset-0 flex items-center justify-center ">
						<div className="mt-10 flex items-center gap-2 !rounded-lg border border-primary bg-neutral-200 px-2 py-1 text-primary opacity-0 duration-200 group-hover:opacity-100">
							<Edit3 size={24} />
							<span className="text-sm">
								{btnDescription
									? "Change File"
									: "Change Image"}
							</span>
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

			<div className="flex h-[80px] w-full items-center justify-center">
				{uploadImage.isLoading || updateAccount.isLoading ? (
					<UploadProgress progress={uploadProgress} />
				) : (
					<div className="flex w-full max-w-xs justify-center">
						<Button
							className="px-8"
							disabled={imageFile == null || isFileTooLarge}
							onClick={handleUpload}
							variant="default"
						>
							{btnDescription || "Upload Image"}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
