/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { type AxiosProgressEvent, isCancel } from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import { type ApiError, axios } from "@/lib/axios";

import type { Bucket, MediaEnums } from "../enums";

// upload image
export interface UploadImageResponse {
	fileName: string;
	storageUrl: string;
	_id: string;
}

export interface UploadImageParams {
	file: File;
	onProgress?: (progress: number) => void;
}

// ====
async function postUploadImage({
	file,
	onProgress,
}: UploadImageParams): Promise<UploadImageResponse> {
	const formData = new FormData();
	formData.append("file", file);
	const res = await axios.post("/upload", formData, {
		headers: { "Content-Type": "multipart/form-data" },
		onUploadProgress: (progressEvent) => {
			const percentCompleted = Math.round(
				(progressEvent.loaded * 100) / (progressEvent.total ?? 1)
			);
			onProgress?.(percentCompleted);
		},
	});
	return res.data.data;
}

export function useUploadImage(): UseMutationResult<
	UploadImageResponse,
	ApiError,
	UploadImageParams,
	unknown
> {
	return useMutation({
		mutationFn: postUploadImage,
		mutationKey: ["upload-image"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
// ====

// ====
export async function getSecureUrl(id: string): Promise<string> {
	const res = await axios.get(`/upload/${id}`);
	return res.data.data;
}

// export function useGetSecureUrl(): UseMutationResult<
//     void,
//     ApiError,
//     string,
//     unknown
// > {
//     return useMutation({
//         mutationFn: getSecureUrl,
//         mutationKey: ["get-secure-url"],
//         onError: (error: ApiError) => {
//             toast.error(error?.response?.data.message ?? "An error occurred");
//         },
//     });
// }
// ====

// ====
async function postDownloadAttachment(url: string): Promise<void> {
	// Get secure url
	const secureUrl = await getSecureUrl(url);

	const mainUrl = String(secureUrl);
	return fetch(mainUrl, { mode: "no-cors" })
		.then(async (response) => {
			return response.blob();
		})
		.then((blob) => {
			const blobUrl = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			// eslint-disable-next-line no-useless-escape
			a.download = secureUrl.replace(/^.*[\\\/]/, "");
			a.href = secureUrl;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(blobUrl);
		});
}

export function useDownloadAttachment(): UseMutationResult<
	void,
	ApiError,
	string,
	unknown
> {
	return useMutation({
		mutationFn: postDownloadAttachment,
		mutationKey: ["download-attachment"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// ====

export interface UploadImageParams2 {
	file: File;
	onProgressEvent: (progressEvent: AxiosProgressEvent) => void;
}

export interface UploadImageResponse2 {
	bucket: Bucket.ChainsiteStorage;
	createdAt: string;
	deletedAt: string | null;
	name: string;
	size: string;
	status: boolean;
	type: MediaEnums;
	updatedAt: string;
	uploaded_bg: string;
	url: string;
	_v: number;
	_id: string;
}

async function postUploadImagePrivately({
	file,
	onProgressEvent,
}: UploadImageParams2): Promise<UploadImageResponse2> {
	const formData = new FormData();
	formData.append("file", file);

	// const controller = new AbortController();
	// const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

	try {
		const res = await axios.post("/upload", formData, {
			// signal: controller.signal,
			headers: { "Content-Type": "multipart/form-data" },
			onUploadProgress: onProgressEvent,
		});
		// clearTimeout(timeoutId);
		return res.data.data;
	} catch (error) {
		// console.error(error);
		if (isCancel(error)) {
			throw new Error("Upload cancelled or timed out");
		}
		const errorMessage =
			error instanceof Error ? error.message : "Error uploading image";
		toast.error(errorMessage);
		throw new Error(errorMessage);
	}
}

export async function uploadAttachmentWithProgress(
	uploadParams: UploadImageParams2[]
): Promise<UploadImageResponse2[]> {
	const uploadWithRetry = async (
		params: UploadImageParams2
		// retries = 3
	): Promise<UploadImageResponse2> => {
		try {
			return await postUploadImagePrivately(params);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error uploading image";
			toast.error(errorMessage);
			// if (retries > 0) {
			// 	await new Promise((resolve) => {
			// 		setTimeout(resolve, 1000);
			// 	}); // Wait 1 second before retrying
			// 	return uploadWithRetry(params, retries - 1);
			// }
			throw error;
		}
	};
	try {
		const allReqs = uploadParams.map((params) => uploadWithRetry(params));
		return await Promise.all(allReqs);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Error uploading images";
		toast.error(errorMessage);
		throw new Error(errorMessage);
	}
}
