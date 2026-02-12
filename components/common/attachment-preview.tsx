"use client";

import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import { Modal } from "@/components/common/modal";
import { Play } from "lucide-react";
import Image from "next/image";
import React, { MouseEventHandler, useRef, useState } from "react";

interface AttachmentProp {
	_id?: string;
	url: string;
	mimeType: string;
}

interface AttachmentPreviewProps {
	attachment: AttachmentProp;
	className?: string;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
	attachment: { url, mimeType },
	className,
}) => {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

	const handlePlayVideo = () => {
		if (videoRef?.current) {
			videoRef?.current?.play();
			setIsPlaying(true);
		}
	};

	const handlePauseVideo = () => {
		if (videoRef?.current) {
			videoRef?.current?.pause();
			setIsPlaying(false);
		}
	};

	const handleEndedVideo = () => {
		setIsPlaying(false);
	};

	const openImageModal: MouseEventHandler<HTMLImageElement> = (e) => {
		e?.stopPropagation();
		setIsImageModalOpen(true);
	};

	const closeImageModal: MouseEventHandler<HTMLButtonElement> = (e) => {
		e?.stopPropagation();
		setIsImageModalOpen(false);
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsImageModalOpen(false);
	};

	return (
		<>
			<div
				className={`w-full overflow-hidden rounded-2xl border border-white/50 ${className}`}
			>
				{/* Image Preview */}
				{mimeType?.includes("image") && (
					<div className="relative flex h-[360px] w-full items-center justify-center">
						{/* Blurred Background Image */}
						<Image
							src={url}
							alt="Attachment background blur"
							layout="fill"
							priority
							className="absolute inset-0 h-full max-h-[360px] object-cover blur-md"
							style={{ filter: "blur(20px)" }}
						/>

						{/* Main Image */}
						<div className="relative m-auto h-full max-h-[360px] w-full">
							<Image
								src={url}
								alt="Attachment"
								layout="fill"
								className="relative z-10 cursor-pointer object-contain"
								onClick={openImageModal}
							/>
						</div>
					</div>
				)}

				{/* Video Preview */}
				{mimeType.includes("video") && (
					<div className="relative h-[293px] w-full">
						<video
							ref={videoRef}
							src={url}
							className="absolute left-0 top-0 h-full w-full object-fill"
							onPause={handlePauseVideo}
							onEnded={handleEndedVideo}
						>
							Your browser does not support the video tag.
						</video>
						{!isPlaying && (
							<div className="absolute inset-0 flex items-center justify-center bg-transparent">
								<Button
									size="xs"
									className="gap-2 rounded-full bg-lemon-green px-6 text-sm text-white shadow-lg"
									onClick={handlePlayVideo}
								>
									<Play size={20} />
									Play Video
								</Button>
							</div>
						)}
					</div>
				)}

				{/* File Download */}
				{(mimeType?.includes("file") || mimeType?.includes("pdf")) && (
					<div className="relative h-fit w-full cursor-pointer bg-white/40 p-2">
						<p className="flex gap-2 text-white">
							📂 Download the file{" "}
							<a href={url} className="leading-1 underline">
								here
							</a>
							.
						</p>
					</div>
				)}
			</div>
			<Modal
				isOpen={isImageModalOpen}
				//@ts-ignore
				onOpenChange={closeImageModal}
				className="max-w-[96%] md:min-w-[806px] md:max-w-[806px]"
				handleOverlayClick={handleOverlayClick}
			>
				<CardView className="relative flex w-full flex-col gap-4 !border border-[#E8E8E81A]/10 !bg-ink-darkest/90 !p-4 md:!p-6  ">
					<div className=" flex w-full cursor-pointer justify-between">
						<h3 className="text-2xl font-bold text-white">
							Image Preview
						</h3>
						<Button
							type="button"
							variant={"outline"}
							onClick={(e) => closeImageModal(e)}
							className="rounded-full !py-1"
						>
							Close
						</Button>
					</div>
					<div className="flex  h-[500px] w-full justify-center rounded-2xl">
						<Image
							src={url}
							alt="Full View"
							width={750}
							height={400}
							className="rounded-2xl object-contain"
						/>
					</div>
				</CardView>
			</Modal>
		</>
	);
};

export default AttachmentPreview;
