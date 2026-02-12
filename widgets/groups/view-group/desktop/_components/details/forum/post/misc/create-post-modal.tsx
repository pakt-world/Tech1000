"use client";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactElement, useState, useRef } from "react";
import {
	X,
	Bold as LucideBold,
	Italic as LucideItalic,
	Underline as LucideUnderline,
	Paperclip,
	Link2 as LucideLink,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import { CustomInput } from "@/components/common/custom-input";
import { formatLink } from "@/lib/utils";
import { useUploadImage } from "@/lib/api/upload";
import { Spinner } from "@/components/common/loader";
import { toast } from "@/components/common/toaster";
import { postCreationSchema } from "@/lib/validations";
import { Attachment, AttachmentType, Group } from "@/lib/types/groups";
import { useCreatePostForGroup } from "@/lib/api/group";
import { useQueryClient } from "@tanstack/react-query";

// Tiptap dependencies
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import ThumbnailRenderer from "@/components/common/thumbnail-renderer";
import { useRouter } from "next/navigation";
import Logger from "@/lib/utils/logger";
import Image from "next/image";

type PostFormValues = {
	title: string;
	content: string;
	tag: string;
};

interface CreatePostModalProp {
	open: boolean;
	setOpen: (open: boolean) => void;
	group: Group;
}

export default function CreatePostModal({
	open,
	setOpen,
	group,
}: CreatePostModalProp): ReactElement | null {
	const router = useRouter();
	const { control, handleSubmit, formState, setValue } =
		useForm<PostFormValues>({
			resolver: zodResolver(postCreationSchema),
			defaultValues: {
				title: "",
				content: "",
			},
		});
	const { errors } = formState;

	const queryClient = useQueryClient();
	const uploadImage = useUploadImage();

	const linkIconRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const [linkPopoverVisible, setLinkPopoverVisible] = useState(false);
	const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
	const [linkUrl, setLinkUrl] = useState("");

	const { mutate: createPost, isLoading } = useCreatePostForGroup();

	const MAX_FILE_SIZE = 10 * 1024 * 1024; // Max file size (10 MB)

	const maxLength = 1000;

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link.configure({
				openOnClick: true,
				HTMLAttributes: {
					target: "_blank",
					rel: "noopener noreferrer",
					class: "text-blue-500 underline",
				},
			}),
			Placeholder.configure({
				placeholder: "Say what’s on your mind...",
			}),
		],
		content: "",
		autofocus: false,
		editorProps: {
			attributes: {
				class: "focus:outline-none h-full",
			},
			handlePaste: (view, event) => {
				Logger.info("view", { view });
				const items = event.clipboardData?.items;
				if (items) {
					for (let i = 0; i < items?.length; i++) {
						const item = items[i];
						if (item?.type?.startsWith("image")) {
							event.preventDefault(); // Prevent default paste behavior
							const file = item?.getAsFile();
							if (file) {
								handleFileChange(file);
							}
							return true; // Stop further processing
						}
					}
				}
				return false; // Allow default paste behavior for non-image content
			},
		},
		onUpdate: ({ editor }) => {
			const text = editor.getText();
			if (text.length > maxLength) {
				// Prevent typing further by trimming the content
				const truncated = text.substring(0, maxLength);
				editor.commands.setContent(truncated);
				setValue("content", truncated);
			} else {
				setValue("content", editor.getHTML());
			}
		},
	});

	const setLinkInEditor = () => {
		if (linkUrl) {
			editor
				?.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: formatLink(linkUrl) })
				.run();

			setLinkPopoverVisible(false);
			setLinkUrl("");
		}
	};

	const handleImageUpload = (
		file: File,
		attachmentType: AttachmentType
	): void => {
		if (file == null) return;
		setIsUploadingImage(true);
		uploadImage.mutate(
			{ file: file },
			{
				onSuccess: (data) => {
					setAttachments((prev) => [
						...prev,
						{
							type: attachmentType,
							// @ts-ignore
							storageUrl: data?.url,
							fileName: file.name,
							_id: data?._id,
						},
					]);
				},
				onSettled: () => {
					setIsUploadingImage(false);
				},
			}
		);
	};
	const handleFileChange = (fileInput: File) => {
		if (fileInput) {
			if (fileInput.size > MAX_FILE_SIZE) {
				toast.error(
					`File is too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`
				);
				return;
			}

			let attachmentType: AttachmentType = "file";

			if (fileInput.type.startsWith("image/")) {
				attachmentType = "image";
			}
			if (fileInput.type.startsWith("video/")) {
				attachmentType = "video";
			}
			if (fileInput.type === "application/pdf") {
				attachmentType = "file";
			}

			handleImageUpload(fileInput, attachmentType);

			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}
	};

	const removeAttachment = (attachmentUrl: string) => {
		setAttachments((prevAttachments) =>
			prevAttachments.filter(
				(attachment) => attachment.storageUrl !== attachmentUrl
			)
		);
	};

	const charactersEntered = editor?.getText().length || 0;

	const toggleBold = () => {
		editor?.chain().focus().toggleBold().run();
	};

	const toggleItalic = () => {
		editor?.chain().focus().toggleItalic().run();
	};

	const toggleUnderline = () => {
		editor?.chain().focus().toggleUnderline().run();
	};

	const handleLinkIconClick = () => {
		if (editor?.isActive("link")) {
			editor.chain().focus().unsetLink().run();
		} else {
			setLinkPopoverVisible(!linkPopoverVisible);
		}
	};

	const resetForm = () => {
		setOpen(false);
		setValue("content", "");
		setValue("title", "");
		setAttachments([]);
		editor?.commands.clearContent();
		router.push(`/groups/${group?._id}`);
	};

	const onSubmit = (data: PostFormValues) => {
		const attamentsArray = attachments.map((file: any) => file._id);

		const createPostData = {
			title: data.title,
			content: data.content,
			groupId: group?._id,
			...(attamentsArray.length > 0
				? { attachments: attamentsArray }
				: []),
		};

		createPost(createPostData, {
			onSuccess: () => {
				queryClient.invalidateQueries([
					"get-recent-posts",
					group._id,
					10,
				]);
				queryClient.invalidateQueries([
					"get-trending-posts",
					group._id,
					10,
				]);
				queryClient.invalidateQueries(["get-top-posts", group._id, 10]);

				resetForm();
			},
		});
	};

	const content = editor ? editor.getHTML() : "";

	return (
		<Modal
			isOpen={open}
			onOpenChange={() => setOpen(!open)}
			className="sm:max-w-[869px]"
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
				<CardView className=" flex w-full flex-col gap-4 !border !bg-ink-darkest !p-6 max-sm:scale-[0.9]">
					<form className="w-full" onSubmit={handleSubmit(onSubmit)}>
						<div className="flex w-full items-center border-b border-[#E8E8E81A] pb-4">
							<div className="flex w-full flex-col justify-start gap-1">
								<Controller
									name="title"
									control={control}
									defaultValue=""
									render={({
										field: { value, onChange, ...rest },
									}) => (
										<CustomInput
											{...rest}
											value={value || ""}
											onChange={(e) =>
												onChange(e.target.value)
											}
											type="text"
											className="w-full !border-none !bg-inherit !p-0 !text-3xl !font-bold placeholder:!text-3xl placeholder:!font-bold "
											placeholder="Enter Post Title"
										/>
									)}
								/>
								{errors.title && (
									<span className="mb-2 text-xs text-red-500">
										{errors.title.message}
									</span>
								)}
							</div>
							<div
								className="cursor-pointer text-white"
								onClick={() => setOpen(!open)}
							>
								<X size={20} />
							</div>
						</div>
						<div
							className="relative mt-3 flex w-full flex-col justify-between gap-1 md:min-h-[398px]"
							onClick={() => editor?.commands.focus()}
						>
							<div className="flex h-full max-h-[300px] flex-col gap-1 overflow-scroll">
								<Controller
									name="content"
									control={control}
									defaultValue=""
									render={({ field: { value } }) => (
										<EditorContent
											editor={editor}
											value={value}
											className="h-full w-full font-circular !text-white placeholder:!text-[#72777A] focus:!border-none focus:!outline-none focus-visible:!border-none focus-visible:!outline-none"
										/>
									)}
								/>
								{errors.content && (
									<span className="text-xs text-red-500">
										{errors.content.message}
									</span>
								)}
							</div>

							{/* Attachments Preview */}
							<div className="bottom-0 left-0 mt-4 flex flex-col flex-wrap gap-4 pb-2">
								<ThumbnailRenderer content={content} />
								<div className="bottom-0 left-0 mt-4 flex flex-wrap items-end gap-4 pb-2">
									{attachments.length > 0 &&
										attachments.map((attachment, index) => (
											<div
												key={index}
												className="group relative flex h-16 w-16 flex-col items-center justify-center overflow-hidden rounded-lg border border-white bg-gray-800"
											>
												<X
													color="red"
													size={16}
													className="absolute right-0 top-0 cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100"
													onClick={() =>
														removeAttachment(
															attachment.storageUrl
														)
													}
												/>

												{/* Preview Based on File Type */}
												{attachment.type ===
													"image" && (
													<Image
														src={
															attachment.storageUrl
														}
														alt="attachment preview"
														className="h-full w-full object-cover"
														fill
													/>
												)}

												{attachment.type ===
													"video" && (
													<video
														src={
															attachment.storageUrl
														}
														className="h-full w-full object-cover"
														controls
													/>
												)}

												{attachment.type === "file" && (
													<>
														<span className="mx-1 flex flex-col items-center px-1 text-white">
															📄
															<p className="max-w-16 truncate text-[8px]">
																{
																	attachment.fileName
																}
															</p>
														</span>
													</>
												)}
											</div>
										))}
									{isUploadingImage && (
										<div className="group relative flex h-16 w-16 flex-col items-center justify-center overflow-hidden rounded-lg border border-white bg-gray-800">
											<Spinner />
										</div>
									)}
								</div>
							</div>

							{/* Character Count */}
							<div className="absolute bottom-0 right-0 pb-2 text-right font-circular text-sm text-white">
								{charactersEntered}/{maxLength}
							</div>
						</div>

						{/* Controls */}
						<div className="flex w-full items-center justify-between border-t border-[#E8E8E81A] pt-4">
							<div className=" flex items-center gap-4">
								<LucideBold
									size={18}
									onClick={toggleBold}
									className="cursor-pointer"
									color={
										editor?.isActive("bold")
											? "#CCF975"
											: "#ffffff"
									}
								/>

								<LucideItalic
									onClick={toggleItalic}
									size={18}
									className="cursor-pointer"
									color={
										editor?.isActive("italic")
											? "#CCF975"
											: "#ffffff"
									}
								/>

								<LucideUnderline
									onClick={toggleUnderline}
									size={18}
									className="cursor-pointer"
									color={
										editor?.isActive("underline")
											? "#CCF975"
											: "#ffffff"
									}
								/>

								<div
									ref={linkIconRef}
									onClick={handleLinkIconClick}
									className="cursor-pointer"
								>
									<LucideLink
										size={18}
										color={
											editor?.isActive("link")
												? "#CCF975"
												: "#ffffff"
										}
									/>
								</div>

								{/* Link Popover */}
								{linkPopoverVisible && (
									<div
										className="absolute z-10 rounded border border-[#E8E8E81A]/10 bg-ink-darkest p-4 shadow-lg"
										style={{
											top: `${
												// @ts-ignore
												linkIconRef?.current
													?.offsetTop + 30
											}px`,
											left: `${linkIconRef.current?.offsetLeft}px`,
											width: "200px",
										}}
									>
										<CustomInput
											type="text"
											className="!h-fit w-full border !py-2 !text-xs"
											placeholder="Enter URL"
											value={linkUrl}
											onChange={(e) =>
												setLinkUrl(e.target.value)
											}
										/>
										<Button
											onClick={setLinkInEditor}
											size={"xs"}
											className="mt-4 w-full text-sm"
										>
											Insert Link
										</Button>
									</div>
								)}

								<label
									htmlFor="attachment"
									className={` text-white ${
										attachments.length < 4 &&
										!isUploadingImage
											? "cursor-pointer"
											: ""
									}`}
								>
									<Paperclip
										size={18}
										color={
											attachments.length < 4 &&
											!isUploadingImage
												? "#ffffff"
												: "#615f5f"
										}
									/>
									{attachments.length < 4 &&
										!isUploadingImage && (
											<input
												type="file"
												id="attachment"
												className="hidden"
												accept="image/*,video/*,.pdf,.doc,.txt,.csv,.zip"
												ref={inputRef}
												onChange={(e) => {
													const file =
														e.target.files?.[0];
													if (file) {
														handleFileChange(file);
													}
												}}
											/>
										)}
								</label>
							</div>

							<div className="flex justify-end">
								<Button
									type="submit"
									disabled={isLoading || isUploadingImage}
									className="ml-auto rounded-full px-8 py-2 font-circular text-black"
								>
									{isLoading ? "Loading..." : "Publish"}
								</Button>
							</div>
						</div>
					</form>
				</CardView>
			</div>
		</Modal>
	);
}
