"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { toast } from "@/components/common/toaster";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useUpdateAccount } from "@/lib/api/account";
import { useUploadImage } from "@/lib/api/upload";
import { useOnboardingState } from "@/lib/store/onboarding";

import { type SlideItemProps } from "../slider";
import { DesktopUploadProfileImage } from "./screens/desktop";
import { MobileProfileImage } from "./screens/mobile";

const MB_IN_BYTES = 1024 * 1024;
const maxSize = 2 * MB_IN_BYTES;

type AcceptedFileTypes = {
	[key: string]: any[];
};
interface Props {
	type?: string;
	isOnboarding?: boolean;
	miscAction?: (arg?: any) => void;
	previewImage?: {
		file: File;
		preview: string;
	} | null;
	btnDescription?: string;
	acceptableFileTypes?: AcceptedFileTypes;
}

export function UploadProfileImage({
	type,
	isOnboarding,
	miscAction,
	previewImage,
	goToPreviousSlide,
	btnDescription,
	acceptableFileTypes,
}: Props & SlideItemProps): React.JSX.Element {
	const router = useRouter();
	const { tags } = useOnboardingState();
	const uploadImage = useUploadImage();
	const updateAccount = useUpdateAccount();
	const [uploadProgress, setUploadProgress] = useState(0);

	const [imageFile, setImageFile] = useState<{
		file: File;
		preview: string;
		type?: string;
		name?: string;
	} | null>(null);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		// if (acceptedFiles.length === 0) return;
		const file = acceptedFiles[0] as File;
		setImageFile({
			file,
			preview: URL.createObjectURL(file),
			type: acceptedFiles?.[0]?.type,
			name: acceptedFiles?.[0]?.name,
		});
	}, []);

	useEffect(() => {
		if (previewImage) {
			setImageFile(previewImage);
		}
	}, [previewImage]);

	const { getRootProps, getInputProps, fileRejections, isDragReject } =
		useDropzone({
			onDrop,
			maxSize,
			minSize: 0,
			maxFiles: 1,
			accept: acceptableFileTypes || {
				"image/png": [],
				"image/jpeg": [],
				"image/jpg": [],
			},
		});

	const isFileTooLarge =
		fileRejections.length > 0 &&
		fileRejections[0]?.file?.size != null &&
		fileRejections[0].file.size > maxSize;

	useEffect(() => {
		return () => {
			if (imageFile != null) {
				URL.revokeObjectURL(imageFile.preview);
			}
		};
	}, [imageFile]);

	const handleUpload = (): void => {
		if (imageFile == null) return;
		uploadImage.mutate(
			{ file: imageFile.file, onProgress: setUploadProgress },
			{
				onSuccess: (data) => {
					if (type === "uploader") {
						if (miscAction) miscAction(data);
						return;
					}
					// save account details
					const payload = isOnboarding
						? {
								profile: { talent: { tags: tags } },
								profileImage: data._id,
							}
						: { profileImage: data._id };
					updateAccount.mutate(payload, {
						onSuccess: () => {
							toast.success("Image uploaded successfully");
							if (miscAction) miscAction();
							if (isOnboarding) router.push("/overview");
						},
					});
				},
			}
		);
	};

	const handleSkipView = () => {
		if (isOnboarding) router.push("/overview");
	};

	return (
		<>
			<DesktopUploadProfileImage
				handleUpload={handleUpload}
				isFileTooLarge={isFileTooLarge}
				getRootProps={getRootProps}
				getInputProps={getInputProps}
				imageFile={imageFile}
				isDragReject={isDragReject}
				uploadImage={uploadImage}
				updateAccount={updateAccount}
				uploadProgress={uploadProgress}
				goToPreviousSlide={goToPreviousSlide}
				handleSkipView={handleSkipView}
				isOnboarding={isOnboarding}
				btnDescription={btnDescription}
			/>
			<MobileProfileImage
				handleUpload={handleUpload}
				isFileTooLarge={isFileTooLarge}
				getRootProps={getRootProps}
				getInputProps={getInputProps}
				imageFile={imageFile}
				isDragReject={isDragReject}
				uploadImage={uploadImage}
				updateAccount={updateAccount}
				uploadProgress={uploadProgress}
				goToPreviousSlide={goToPreviousSlide}
				isOnboarding={isOnboarding}
			/>
		</>
	);
}
