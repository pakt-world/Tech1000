"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { X } from "lucide-react";
import Image from "next/image";
import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type AttachmentsSendingProps } from "@/providers/socket-types";

export const RenderAttachmentPreviewer = ({
	images,
	removeImage,
}: {
	images: AttachmentsSendingProps[];
	removeImage: (id: string) => void;
}): ReactElement | boolean => {
	// eslint-disable-next-line @typescript-eslint/no-shadow
	const MAX_LEN = 10;
	return (
		images.length > 0 && (
			<div className="flex h-fit flex-row gap-4 overflow-x-auto py-4">
				{images.map((img) => (
					<div
						key={img._id}
						className="relative flex flex-row gap-2 rounded-lg bg-white p-2"
					>
						<span
							className="absolute -right-3 -top-3 h-fit w-fit cursor-pointer rounded-full bg-[#CDCFD0] p-1"
							onClick={() => {
								removeImage(img._id);
							}}
							role="button"
							onKeyDown={() => {
								removeImage(img._id);
							}}
							tabIndex={0}
						>
							<X size={15} />{" "}
						</span>
						<div className="flex items-center">
							<Image
								className="min-h-[38px] min-w-[38px] rounded-lg"
								src={img.preview}
								alt="upload-picture"
								width={38}
								height={38}
								objectFit="contain"
							/>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-primary">
								{img.name.length > MAX_LEN
									? `${img.name.slice(0, MAX_LEN)}...`
									: img.name}
							</p>
							<p className="text-sm text-body">{img.size}</p>
						</div>
					</div>
				))}
			</div>
		)
	);
};
