/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { Link2, Paperclip, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { useUserState } from "@/lib/store/account";
import { useCreateCommentForPost } from "@/lib/api/group";
import { useUploadImage } from "@/lib/api/upload";
import { formatLink } from "@/lib/utils";
import { Attachment, AttachmentType } from "@/lib/types/groups";
import { Button } from "@/components/common/button";
import CardView from "@/components/common/card-view";
import { toast } from "@/components/common/toaster";
import { Spinner } from "@/components/common/loader";
import { CustomInput } from "@/components/common/custom-input";
import { SnowProfile } from "@/components/common/snow-profile";
import ThumbnailRenderer from "@/components/common/thumbnail-renderer";
import Image from "next/image";

interface ReplyBoxProps {
	parentId?: string;
	isVisible: boolean;
	onClose: () => void;
	onSubmit: (response?: any) => void;
	groupId?: string;
	hideEditorInfoView?: boolean;
	noBorder?: boolean;
	onClick?: (e: React.MouseEvent) => void;
}

const maxLength = 300;
const schema = z.object({
	text: z
		.string()
		.min(1, "Comment cannot be empty")
		.max(320, "Text must be 300 characters or less"),
});

const ReplyBox: React.FC<ReplyBoxProps> = ({
	parentId,
	isVisible,
	onClose,
	onSubmit,
	hideEditorInfoView,
	onClick,
	noBorder,
}) => {
	const account = useUserState();
	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);
	const linkIconRef = useRef<HTMLDivElement>(null);

	const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
	const [linkPopoverVisible, setLinkPopoverVisible] = useState(false);
	const [linkUrl, setLinkUrl] = useState("");
	const [hideEditorInfo, setHideEditorInfo] = useState(
		hideEditorInfoView || false
	);
	const uploadImage = useUploadImage();

	const MAX_FILE_SIZE = 10 * 1024 * 1024; // Max file size (10 MB)

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: { text: "" },
	});

	const { mutate: createComment, isLoading: isSubmitting } =
		useCreateCommentForPost();

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
						{
							type: attachmentType,
							// @ts-ignore
							storageUrl: data?.url,
							fileName: file.name,
							_id: data?._id,
						},
						...prev,
					]);
				},
				onSettled: () => {
					setIsUploadingImage(false);
				},
			}
		);
	};

	const handleAttachmentChange = (fileInput: File) => {
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
				placeholder: "Write comment",
			}),
		],
		content: "",
		autofocus: false,
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: "focus:outline-none text-[16px]",
			},
			handlePaste: (view, event) => {
				const items = event.clipboardData?.items;
				if (items) {
					for (let i = 0; i < items?.length; i++) {
						const item = items[i];
						if (item?.type?.startsWith("image")) {
							event.preventDefault();
							const file = item?.getAsFile();
							if (file) {
								handleAttachmentChange(file);
							}
							return true;
						}
					}
				}
				const pastedText = event.clipboardData?.getData("text");
				if (pastedText) {
					if (pastedText.length > 300) {
						event.preventDefault();
						const truncatedText = pastedText.substring(0, 300);
						const selection = view.state.selection;
						const { from, to } = selection;
						const transaction = view.state.tr.insertText(
							truncatedText,
							from,
							to
						);
						view.dispatch(transaction);
					}
				}

				return false;
			},
			//@ts-expect-error
			handleKeyPress: (view, event) => {
				const text = editor?.getText() || "";
				if (text.length >= maxLength) {
					event.preventDefault();
					return true;
				}

				return false;
			},
		},
		onUpdate: ({ editor }) => {
			const text = editor.getText();
			if (text.length > maxLength) {
				// Prevent typing further by trimming the content
				const truncated = text.substring(0, maxLength);
				editor.commands.setContent(truncated);
				setValue("text", truncated);
			} else {
				setValue("text", editor.getHTML());
			}
		},
	});

	const onFormSubmit = (data: { text: string }) => {
		const attamentsArray = attachments.map((file: any) => file._id);
		if (data.text.trim() && parentId) {
			createComment(
				{
					comment: data.text,
					...(attamentsArray.length > 0
						? { attachments: attamentsArray }
						: []),
					parentId,
				},
				{
					onSuccess: (response) => {
						setValue("text", "");
						setAttachments([]);
						onClose();
						toast.success("Comment posted successfully");
						onSubmit(response);
						setHideEditorInfo(false);
						editor?.commands.clearContent();
					},
				}
			);
		}
	};

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

	const handleLinkIconClick = () => {
		if (editor?.isActive("link")) {
			editor.chain().focus().unsetLink().run();
		} else {
			setLinkPopoverVisible(!linkPopoverVisible);
		}
	};

	const removeAttachment = (index: number) => {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	};

	const charactersEntered = editor?.getText().length || 0;

	const content = editor ? editor.getHTML() : "";

	const [isPopoverOutOfView, setPopoverOutOfView] = useState(false);
	const popoverRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (linkPopoverVisible && popoverRef.current) {
			const popoverRect = popoverRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight;

			if (popoverRect.bottom > viewportHeight) {
				setPopoverOutOfView(true);
			} else {
				setPopoverOutOfView(false);
			}
		}
	}, [linkPopoverVisible]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				linkPopoverVisible &&
				popoverRef.current &&
				!popoverRef.current.contains(event.target as Node) &&
				!linkIconRef.current?.contains(event.target as Node)
			) {
				setLinkPopoverVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [linkPopoverVisible]);

	useEffect(() => {
		if (editor) {
			editor.commands.focus();
		}
	}, [editor]);

	if (!isVisible) return null;
	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.1 }}
			className={`flex w-full flex-col  ${hideEditorInfo ? "py-2 " : "py-2"} ${!noBorder ? "border-b border-[#FFFFFF33] " : ""}`}
			onClick={onClick}
		>
			{hideEditorInfo && (
				<div className="hidden items-start gap-2">
					<SnowProfile
						src={account?.profileImage?.url}
						score={parseInt(account?.meta?.tokenId || "") || 0}
						size="sm"
						url={`/members/${account?._id}`}
					/>

					<div className="flex flex-col gap-3">
						<div className="flex flex-col items-start justify-center">
							<h2 className="text-left text-base font-bold text-white md:text-lg">
								{account?.firstName} {account?.lastName}
							</h2>
							<p className="font-mono text-xs capitalize text-[#FFFFFF80] md:text-sm">
								{account?.role || "Builder"}
							</p>
						</div>
					</div>
				</div>
			)}

			<CardView
				className={`flex flex-col gap-2 rounded-3xl !border !border-[#E8E8E833] !bg-[#E8E8E833]/20 !p-3 ${hideEditorInfo ? "mt-1	md:mt-4" : ""}`}
			>
				<form
					onSubmit={handleSubmit(onFormSubmit)}
					className="flex w-full flex-col gap-2 bg-transparent"
				>
					<Controller
						name="text"
						control={control}
						render={({ field: { value } }) => (
							<div
								className={`relative flex min-h-[0px] w-full flex-col  ${hideEditorInfo ? "!border-b !border-[#FFFFFF33] pb-2 " : " !border-none"}`}
								onClick={(e) => e.stopPropagation()}
							>
								<div
									className={`] flex max-h-[90px] flex-col ${hideEditorInfo ? "min-h-[50px]" : "h-fit"}`}
								>
									<EditorContent
										editor={editor}
										value={value}
										className="w-full overflow-auto text-base !text-white placeholder:!text-[#72777A] focus:!border-none focus:!outline-none focus-visible:!border-none focus-visible:!outline-none"
										style={{ fontSize: "16px" }}
										onKeyUp={(e) => {
											e.stopPropagation();
											setHideEditorInfo(true);
										}}
									/>
									{errors.text && (
										<span className="text-xs text-red-500">
											{errors.text.message}
										</span>
									)}
								</div>

								{hideEditorInfo && (
									<span className="absolute bottom-[10px] right-0 text-sm text-white ">
										{charactersEntered}/{maxLength}
									</span>
								)}
								{hideEditorInfo && (
									<div className={`mt-4 flex gap-2`}>
										<ThumbnailRenderer content={content} />

										{isUploadingImage && (
											<div className="group relative flex h-12 w-12 flex-col items-center justify-center overflow-hidden rounded-lg border border-white bg-gray-800 md:h-16 md:w-16">
												<Spinner />
											</div>
										)}

										{attachments.length > 0 && (
											<div className="mt-2 flex flex-wrap gap-2">
												{attachments.map(
													(attachment, index) => (
														<div
															key={index}
															className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-white bg-gray-800"
														>
															{/* Remove icon with hover effect */}
															<X
																color="red"
																size={16}
																className="absolute right-0 top-0 cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100"
																onClick={() =>
																	removeAttachment(
																		index
																	)
																}
															/>
															{attachment.type ===
																"image" && (
																<Image
																	src={
																		attachment.storageUrl
																	}
																	alt="attachment"
																	className="h-full w-full object-cover"
																	width={64}
																	height={64}
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
															{attachment.type ===
																"file" && (
																<div className="flex h-full w-full flex-col items-start justify-center  p-2 text-[8px] text-white">
																	<span>
																		📂
																	</span>

																	<p className="break-words">
																		{
																			attachment.fileName
																		}
																	</p>
																</div>
															)}
														</div>
													)
												)}
											</div>
										)}
									</div>
								)}
							</div>
						)}
					/>
					{hideEditorInfo && (
						<div className="mx-2 flex items-center justify-between">
							<div className="flex items-center gap-4 text-white">
								<div
									ref={linkIconRef}
									onClick={handleLinkIconClick}
									className="cursor-pointer"
								>
									<Link2
										size={18}
										color={
											editor?.isActive("link")
												? "#CCF975"
												: "#ffffff"
										}
									/>
								</div>

								{/* Link Popover */}
								{linkPopoverVisible && linkIconRef?.current && (
									<div
										className="absolute z-[999999999999999] rounded border border-[#E8E8E81A]/10 bg-ink-darkest p-2 shadow-lg"
										style={{
											top: `${
												// Dynamically calculate the position
												linkIconRef?.current
													?.offsetTop +
												(isPopoverOutOfView ? -90 : -40)
											}px`,
											left: `${linkIconRef.current?.offsetLeft + 25}px`,
											width: "200px",
										}}
										ref={popoverRef} // Add a ref for the popover
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
											className="mt-2 w-full text-xs"
										>
											Insert Link
										</Button>
									</div>
								)}
								<input
									type="file"
									multiple
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											handleAttachmentChange(file);
										}
									}}
									className="mt-2 hidden"
								/>
								<Paperclip
									size={20}
									className="cursor-pointer"
									onClick={() => {
										const fileInput =
											document.querySelector(
												'input[type="file"]'
											) as HTMLInputElement;
										fileInput?.click();
									}}
								/>
							</div>
							<Button
								type="submit"
								className="rounded-full px-8 py-1 text-sm font-bold md:px-10 md:py-2"
								disabled={isSubmitting || isUploadingImage}
							>
								{isSubmitting ? "Posting..." : "Post"}
							</Button>
						</div>
					)}
				</form>
			</CardView>
		</motion.div>
	);
};

export default ReplyBox;
