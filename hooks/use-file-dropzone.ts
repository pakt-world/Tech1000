"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useState } from "react";
import type { DropzoneOptions, FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import { formatBytes, getPreviewByType } from "@/lib/utils";
import type { AttachmentsSendingProps } from "@/providers/socket-types";

// interface RejectedFile {
// 	file: File;
// 	errors: Array<{ code: string; message: string }>;
// }

const useFileDropzone = (options: Partial<DropzoneOptions> = {}) => {
	const [imageFiles, setImageFiles] = useState<
		AttachmentsSendingProps[] | []
	>([]);

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		const files = acceptedFiles.map((f, i) => ({
			file: f,
			preview: getPreviewByType(f).preview,
			type: getPreviewByType(f).type,
			_id: String(i),
			name: f.name,
			size: formatBytes(f.size, 0),
		}));
		setImageFiles(files);
	}, []);

	const onDropError = useCallback((rejectedFiles: FileRejection[]) => {
		//prev
		// const rejectedFiles = data.map((f: RejectedFile) => ({
		// 	file: f.file,
		// 	errors: f.errors[0],
		// }));

		// rejectedFiles.forEach((f) => {
		// 	toast.error(`${f.file.name}: ${f.errors?.message}`);
		// });
		// new
		rejectedFiles.forEach((rejectedFile) => {
			rejectedFile.errors.forEach((error) => {
				toast.error(`${rejectedFile.file.name}: ${error.message}`);
			});
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const dropzoneProps = useDropzone({
		onDrop,
		onDropRejected: onDropError,
		maxSize: 5242880, // 5MB
		maxFiles: 5,
		accept: {
			"image/*": [],
			"application/pdf": [".pdf"],
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
				[".docx"],
			"text/*": [".csv"],
			"application/vnd.ms-excel": [".csv"],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
				[".xlsx"],
			"image/avif": [".avif"],
			"image/webp": [".webp"],
		},
		noClick: true,
		...options,
	});

	const removeImg = (id: string): void => {
		const newImages = imageFiles.filter((f) => f._id !== id);
		setImageFiles(newImages);
	};

	return {
		imageFiles,
		setImageFiles,
		removeImg,
		...dropzoneProps,
	};
};

export default useFileDropzone;
