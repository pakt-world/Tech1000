/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { FileWarning } from "lucide-react";
import Image from "next/image";
import { type FC, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Modal } from "./modal";
import { UploadProfileImage } from "./upload-profile-image";
import { UploadPlaceholder } from "./upload-placeholder";
import { useMediaQuery } from "usehooks-ts";

interface Props {
	type?: string;
	size?: number;
	image?: string;
	onUploadComplete?: (arg?: any) => void;
}

const MB_IN_BYTES = 1024 * 1024;
const maxSize = 2 * MB_IN_BYTES; // 2MB

export const UploadAvatar: FC<Props> = ({
	type,
	image,
	size: previewImageSize = 180,
	onUploadComplete,
}) => {
	const [openUploadImageDialog, setOpenUploadImageDialog] = useState(false);
	const [previewImage, setPreviewImage] = useState<{
		file: File;
		preview: string;
	} | null>();

	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		const file = acceptedFiles[0] as File;
		setPreviewImage({
			file,
			preview: window?.URL?.createObjectURL(file),
		});
		setOpenUploadImageDialog(true);
	}, []);

	useEffect(() => {
		return () => {
			if (previewImage) {
				URL.revokeObjectURL(previewImage.preview);
			}
		};
	}, [previewImage]);

	const { getRootProps, getInputProps, fileRejections, isDragReject } =
		useDropzone({
			onDrop,
			maxSize,
			minSize: 0,
			maxFiles: 1,

			accept: {
				"image/png": [],
				"image/jpg": [],
				"image/jpeg": [],
			},
		});
	const isFileTooLarge =
		fileRejections.length > 0 &&
		fileRejections[0] &&
		fileRejections[0].file.size > maxSize;

	return (
		<>
			<div
				className="flex items-center gap-2 md:flex-col"
				role="button"
				tabIndex={0}
			>
				<div
					{...getRootProps()}
					className="group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#ECFCE5] duration-200"
					style={{
						width: previewImageSize,
						height: previewImageSize,
					}}
				>
					<input {...getInputProps()} />

					<div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border border-red-300 border-opacity-60">
						{image ? (
							<Image
								src={image}
								alt="profile picture"
								layout="fill"
								objectFit="cover"
							/>
						) : (
							<UploadPlaceholder />
						)}
					</div>

					<div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-full p-2 text-center text-green-check opacity-0 duration-200 group-hover:bg-black group-hover:bg-opacity-70 group-hover:opacity-100"></div>

					<div
						className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-1 rounded-full border border-red-200 bg-red-100 px-4 text-sm text-red-500 duration-200"
						style={{
							opacity: isDragReject ? 1 : 0,
						}}
					>
						<FileWarning size={isDesktop ? 36 : 24} />
						<span className="hidden text-xs md:flex">
							File type not supported
						</span>
					</div>
				</div>

				{isFileTooLarge && (
					<div
						className="flex items-center gap-1 text-sm text-red-500"
						style={{
							maxWidth: isDesktop ? previewImageSize : "none",
						}}
					>
						<span>Please upload a picture smaller than 2 MB</span>
					</div>
				)}
			</div>
			<Modal
				isOpen={openUploadImageDialog}
				onOpenChange={() => {
					setOpenUploadImageDialog(!openUploadImageDialog);
				}}
				className="h-fit max-w-[628px] !overflow-hidden rounded-lg "
			>
				<div className="relative p-0.5">
					<div className="absolute inset-0 rounded-2xl">
						<div
							className="absolute inset-0 overflow-hidden rounded-[30px] border border-transparent 
      before:absolute before:inset-0 before:z-[-1] 
      before:rounded-lg before:border-none before:bg-gradient-to-br 
      before:from-[#D02D3D] before:via-[#F2C650] before:to-[#D02D3D] before:content-['']"
						/>
					</div>
					<div className="rounded-[30px] !bg-ink-darkest p-6">
						<UploadProfileImage
							type={type}
							miscAction={(data) => {
								onUploadComplete?.(data);
								setOpenUploadImageDialog(false);
							}}
							previewImage={previewImage}
						/>
					</div>
				</div>
			</Modal>
		</>
	);
};
