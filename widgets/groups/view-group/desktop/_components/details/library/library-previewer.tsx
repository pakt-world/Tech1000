"use client";

import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import Image from "next/image";

interface AttachmentProp {
	_id: string;
	url: string;
	mimeType: string;
}

interface AttachmentPreviewProps {
	attachment: AttachmentProp;
	closeImageModal: () => void;
}

const LibraryPreview: React.FC<AttachmentPreviewProps> = ({
	attachment: { url, mimeType },
	closeImageModal,
}) => {
	const isVideo = mimeType.startsWith("video/");
	const isImage = mimeType.startsWith("image/");
	// const isDocument =
	// 	mimeType === "application/pdf" || mimeType.startsWith("application/");

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "file");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<CardView className="relative flex w-full flex-col gap-4 !border border-[#E8E8E81A]/10 !bg-ink-darkest/90 !p-6">
			<div className="flex w-full cursor-pointer justify-between">
				<h3 className="text-2xl font-bold text-white">File Preview</h3>
				<Button
					type="button"
					variant={"outline"}
					onClick={() => closeImageModal()}
					className="rounded-full !py-1"
				>
					Close
				</Button>
			</div>
			<div className="flex h-[500px] justify-center rounded-2xl">
				{isVideo ? (
					<video
						controls
						className="max-h-[400px] max-w-full rounded-2xl"
					>
						<source src={url} type={mimeType} />
						Your browser does not support the video tag.
					</video>
				) : isImage ? (
					<Image
						src={url}
						alt="Preview"
						width={750}
						height={400}
						className="rounded-2xl object-contain"
					/>
				) : (
					<div className="flex flex-col items-center justify-center">
						<p className="mb-4 text-lg text-white">
							Click below to download the file.
						</p>
						<Button
							type="button"
							variant={"default"}
							onClick={handleDownload}
							className="rounded-full !py-2 px-4"
						>
							Download File
						</Button>
					</div>
				)}
			</div>
		</CardView>
	);
};

export default LibraryPreview;
