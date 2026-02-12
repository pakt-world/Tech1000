/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseMutationResult } from "@tanstack/react-query";
import {
	type DropzoneInputProps,
	type DropzoneRootProps,
} from "react-dropzone";

import { type UpdateAccountParams } from "@/lib/api/account";
import {
	type UploadImageParams,
	type UploadImageResponse,
} from "@/lib/api/upload";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type ApiError } from "@/lib/axios";
import { type AccountProps } from "@/lib/types/account";

export interface UPIProps {
	isOnboarding?: boolean;
	getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
	getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
	imageFile: {
		file: File;
		preview: string;
		type?: string;
		name?: string;
	} | null;
	isFileTooLarge: boolean;
	isDragReject: boolean;
	uploadImage: UseMutationResult<
		UploadImageResponse,
		ApiError,
		UploadImageParams,
		unknown
	>;
	updateAccount: UseMutationResult<
		AccountProps,
		ApiError,
		UpdateAccountParams,
		unknown
	>;
	handleUpload: () => void;
	uploadProgress: number;
	goToPreviousSlide?: () => void;
	handleSkipView?: () => void;
	btnDescription?: string;
}
