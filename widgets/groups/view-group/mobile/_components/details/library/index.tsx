"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader, PlusIcon } from "lucide-react";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { AttachmentsType, Group } from "@/lib/types/groups";
import CardView from "@/components/common/card-view";
import { Modal } from "@/components/common/modal";
import {
	useCreateLibraryForGroup,
	useGetGroupLibraryInfinitely,
} from "@/lib/api/group";
import useInfiniteScroll from "@/hooks/use-infinite-scrolling";
import { PageError } from "@/components/common/page-error";
import { PageEmpty } from "@/components/common/page-empty";
import { PageLoading } from "@/components/common/page-loading";
import LibraryPreview from "./library-previewer";
import { useDropzone } from "react-dropzone";
import { useUploadImage } from "@/lib/api/upload";

interface GroupLibraryView4MobileProps {
	group: Group;
}

interface FileData {
	bucket: string;
	createdAt: string;
	deletedAt: string | null;
	name: string;
	size: string;
	status: boolean;
	type: string;
	updatedAt: string;
	uploaded_by: string;
	url: string;
	__v: number;
	_id: string;
}
type CategoryType = "Documents" | "Media"; //| "Links";

const fileCategories: Record<CategoryType, string[]> = {
	Documents: [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	],
	Media: ["image/png", "image/jpeg", "video/mp4", "video/avi"],
	// Links: ["text/html", "application/x-www-form-urlencoded"],
};

export default function GroupLibraryView4Mobile({
	group,
}: GroupLibraryView4MobileProps): ReactElement | null {
	const queryClient = useQueryClient();
	const [uploading, setUploading] = useState<boolean>(false);
	const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
	const [imageInView, setImageInView] = useState<AttachmentsType | null>(
		null
	);
	const [selectedCategories, setSelectedCategories] = useState<
		Record<CategoryType, boolean>
	>({
		Documents: true,
		Media: true,
		// Links: true,
	});
	const [previewImage, setPreviewImage] = useState<{
		file: File;
		preview: string;
	} | null>();

	// eslint-disable-next-line prefer-const
	let prevPage = 0;
	// eslint-disable-next-line prefer-const
	let currentPage = 1;

	const nabArray = ["user", "invited", "applied"];
	const notAMember = nabArray.includes(group.type);

	const closeImageModal = () => setIsImageModalOpen(false);

	const { mutate: createGroupLibraryItem } = useCreateLibraryForGroup();
	const uploadImage = useUploadImage();

	const mimeTypes = useMemo(() => {
		const selectedMimes = Object.entries(selectedCategories)
			.filter(([_, checked]) => checked)
			.flatMap(([category]) => fileCategories[category as CategoryType]);

		return selectedMimes.join(","); // Combine MIME types
	}, [selectedCategories]);

	const {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetGroupLibraryInfinitely(group._id, mimeTypes);

	// Handle file upload
	const handleUpdate = (data: FileData) => {
		const libraryData = {
			groupId: group?._id,
			fileIds: [data?._id],
		};
		createGroupLibraryItem(libraryData, {
			onSuccess: () => {
				queryClient.invalidateQueries(["group-library", group._id], {});
			},
			onSettled: () => {
				setUploading(false);
			},
		});
	};

	// Handle category toggle
	const toggleCategory = (category: CategoryType) => {
		setSelectedCategories((prev) => ({
			...prev,
			[category]: !prev[category],
		}));
	};

	const libraryData = useMemo(
		() => ({
			...data,
			pages: data?.pages?.map((page) => page?.data) ?? [],
		}),
		[data]
	);

	const { observerTarget } = useInfiniteScroll({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		currentPage,
		prevPage,
		data: libraryData,
		refetch,
		error: error?.response?.data?.message ?? "",
	});

	const fileTypes = {
		"application/pdf": [],
		"video/mp4": [],
		"video/avi": [],
		"image/png": [],
		"image/jpeg": [],
		"image/jpg": [],
	};

	const MB_IN_BYTES = 1024 * 1024;
	const maxSize = 2 * MB_IN_BYTES; // 2MB

	const getDataType = (data: any, key: string) => {
		const type = data[key];

		switch (true) {
			case type?.startsWith("image/"):
				return {
					type: "image",
					icon: "/images/image-placeholder.svg",
				};
			case type?.startsWith("video/"):
				return {
					type: "video",
					icon: "/images/mp4-placeholder.svg",
				};
			case type === "application/pdf":
				return {
					type: "pdf",
					icon: "/images/pdf-placeholder.svg",
				};
			default:
				return {
					type: "file",
					icon: "/images/file-placeholder.svg",
				};
		}
	};

	const handleUpload = (file: File): void => {
		if (file == null) return;
		setUploading(true);
		uploadImage.mutate(
			{ file: file },
			{
				onSuccess: (data) => {
					handleUpdate(data as unknown as FileData);
				},
			}
		);
	};

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		const file = acceptedFiles[0] as File;
		setPreviewImage({
			file,
			preview: window?.URL?.createObjectURL(file),
		});
		handleUpload(file);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event?.target?.files?.[0];
		if (file) {
			setPreviewImage({
				file,
				preview: window?.URL?.createObjectURL(file),
			});

			handleUpload(file);
		}
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		maxSize,
		minSize: 0,
		maxFiles: 1,
		accept: fileTypes,
	});

	// Define animations
	const cardAnimation = {
		hidden: { opacity: 0, scale: 0.95 },
		visible: { opacity: 1, scale: 1 },
	};

	const categoryAnimation = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	const containerAnimation = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: 0.4,
			},
		},
	};

	const handlePreviewDoc = (doc: AttachmentsType) => {
		setImageInView(doc);
		setIsImageModalOpen(true);
	};

	if (isError) return <PageError className="h-[85vh] rounded-2xl" />;

	return (
		<>
			<div className="relative flex h-full w-full flex-col pt-16">
				{notAMember && (
					<div className="absolute inset-0 z-10 flex h-screen items-center justify-center rounded-lg bg-opacity-60 ">
						<div className="absolute inset-0 z-20 h-full backdrop-blur-2xl"></div>
						<div className="z-30 flex flex-col items-center justify-center gap-4">
							<Image
								src="/images/group-lock-image.svg"
								alt="Lock Icon"
								width={210}
								height={210}
							/>
							<p className="text-center text-2xl leading-4 text-white ">
								{group?.type === "invited"
									? "Accept Invite to view group"
									: "Join group to view library"}
							</p>
						</div>
					</div>
				)}
				<div className="flex w-full items-center justify-between bg-[#000000]/60 p-3 ">
					<h3 className="text-lg font-bold text-white">Categories</h3>
					<div
						className="flex h-10 w-10 items-center justify-center rounded-full bg-lemon-green"
						{...getRootProps()}
					>
						<input
							{...getInputProps()}
							onChange={handleFileSelect}
						/>
						<PlusIcon size={20} />
					</div>
				</div>

				<div className=" h-full w-full space-y-4   md:space-y-0">
					<div className="col-span-1 hidden h-fit w-full md:flex">
						<CardView className="flex w-full flex-col gap-4 !border-[#F2C650] !p-4">
							<h2 className="w-full text-left text-lg text-white">
								Categories
							</h2>
							<div className="flex w-full flex-col gap-2">
								{(
									Object.keys(
										selectedCategories
									) as CategoryType[]
								).map((category) => (
									<motion.div
										key={category}
										className="flex w-full justify-between rounded-full border border-[#E8E8E833] bg-[#FCFCFD1A] p-3"
										variants={categoryAnimation}
										initial="hidden"
										animate="visible"
										exit="hidden"
										onClick={() => toggleCategory(category)}
									>
										<p className="text-base text-[#72777A]">
											{category}
										</p>
										<div
											className={`flex h-[22px] w-[22px] items-center justify-center rounded-full ${
												selectedCategories[category]
													? "bg-lemon-green"
													: "bg-white"
											}`}
										>
											{selectedCategories[category] && (
												<CheckIcon size={14} />
											)}
										</div>
									</motion.div>
								))}
							</div>
						</CardView>
					</div>

					{isLoading ? (
						<div className="relative col-span-3 flex min-h-[70vh] w-full items-center justify-center">
							<PageLoading
								className="!h-full rounded-2xl"
								color="#ffffff"
							/>
						</div>
					) : libraryData?.pages?.flat()?.length > 0 || uploading ? (
						<motion.div
							className="col-span-3 grid w-full grid-cols-2 gap-2 overflow-scroll px-3 sm:grid-cols-3 md:gap-4"
							variants={containerAnimation}
							initial="hidden"
							animate="visible"
						>
							{uploading && (
								<CardView className="col-span-1 flex h-[140px] flex-col !rounded-2xl !border-[#43D6AF] !p-0">
									<div className="flex h-full w-full flex-col items-center justify-center gap-4 p-2 md:px-4 md:py-8">
										<Image
											src={
												getDataType(
													previewImage?.file,
													"type"
												)?.icon
											}
											height={100}
											width={100}
											alt="media"
										/>
										<p className="mt-1 text-center font-circular text-base font-bold text-white">
											Uploading
										</p>
										<div className="w-full px-6">
											<div className="h-[6px] w-full overflow-hidden rounded-full bg-[#979C9E]">
												<div
													className="h-full rounded-full bg-lemon-green"
													style={{
														width: `${60}%`,
													}}
												/>
											</div>
										</div>
									</div>
								</CardView>
							)}
							{libraryData?.pages?.flat()?.length &&
								libraryData?.pages?.flat()?.map((file) => (
									<motion.div
										key={file._id}
										className="flex  h-fit flex-col !p-0"
										variants={cardAnimation}
										initial="hidden"
										animate="visible"
										exit="hidden"
									>
										<CardView
											key={file._id}
											className="flex h-[148px] cursor-pointer flex-col !rounded-2xl !border-[#43D6AF] !p-0"
											onClick={() =>
												handlePreviewDoc(file)
											}
										>
											<div className="p-e relative flex h-full w-full items-center justify-center overflow-hidden rounded-t-[30px]">
												{getDataType(file, "mimeType")
													?.type === "image" ? (
													<div className="relative flex h-[140px] w-full items-center justify-center ">
														<div className="relative m-auto h-full w-full">
															<Image
																src={file?.url}
																layout="fill"
																alt="media"
																className="relative z-10 cursor-pointer  object-contain"
															/>
														</div>
													</div>
												) : (
													<Image
														src={
															getDataType(
																file,
																"mimeType"
															)?.icon
														}
														height={120}
														width={100}
														alt="media"
													/>
												)}
											</div>
											<div className="w-full border-t border-[#E8E8E81A] p-2 font-circular">
												<p className="truncate text-sm font-medium text-white">
													{file?.name}
												</p>
												<span className="text-xs text-[#FFFFFF99]">
													{
														getDataType(
															file,
															"mimeType"
														)?.type
													}
												</span>
											</div>
										</CardView>
									</motion.div>
								))}
						</motion.div>
					) : (
						<PageEmpty
							label="Files unavailable."
							className="!mt-0 min-h-[70vh] w-full rounded-none"
						/>
					)}
					{isFetchingNextPage && (
						<div className="mx-auto flex w-full flex-row items-center justify-center text-center">
							<Loader
								size={15}
								className="animate-spin text-center text-white"
							/>
						</div>
					)}
					<div ref={observerTarget} className="!h-2 !w-full" />
				</div>
			</div>

			<Modal
				isOpen={isImageModalOpen}
				onOpenChange={closeImageModal}
				className="max-w-[96%] md:min-w-[806px] md:max-w-[806px]"
			>
				<LibraryPreview
					attachment={imageInView as AttachmentsType}
					closeImageModal={closeImageModal}
				/>
			</Modal>
		</>
	);
}
