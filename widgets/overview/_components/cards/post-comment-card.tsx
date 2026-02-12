"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { useRouter, useSearchParams } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { FeedWrapper } from "../feed-wrapper";
import { SnowProfile } from "@/components/common/snow-profile";

import { RenderBookMark } from "@/widgets/bounties/misc/render-bookmark";
import { Tag } from "@/lib/types/groups";
import { FeedData } from "@/lib/types/feed";
import { extractAndRemoveImages } from "@/lib/utils";
import ThumbnailRenderer from "@/components/common/thumbnail-renderer";
import AttachmentPreview from "@/components/common/attachment-preview";
import { useMediaQuery } from "usehooks-ts";
import { useEffect, useRef } from "react";

interface TruncateTextProps {
	description: string;
}

const TruncateText: React.FC<TruncateTextProps> = ({ description }) => {
	const maxCharacters = 250;

	const getTruncatedText = (text: string, limit: number): string => {
		if (text.length <= limit) return text;
		const truncated = text.substring(0, limit);
		return (
			truncated.substring(0, truncated.lastIndexOf(" ")) +
			`... <span class="!text-lemon-green whitespace-nowrap">see more</span`
		);
	};

	const truncatedDescription: string = getTruncatedText(
		description,
		maxCharacters
	);

	return (
		<p className="overflow-wrap break-word word-break-keep-all whitespace-break-spaces font-circular text-base text-[#F2F4F5]/50 md:text-lg md:text-white">
			<span
				dangerouslySetInnerHTML={{
					__html: truncatedDescription,
				}}
			></span>
		</p>
	);
};

interface PostCommentCardType {
	feedId: string;
	type:
		| "group_invite"
		| "application_accepted"
		| "application_rejected"
		| "post"
		| "comment";
	title: string;
	description?: string;
	data?: FeedData;
	isBookmarked?: boolean;
	bookmarkId?: string;
	score?: number;
	tags?: Tag[];
	dismissByID: (id: string) => void;
	viewType: "bookmarked" | "others" | "post_comments";
	callback?: () => void;
	isDismissLoading?: boolean;
}

export const PostCommentCard = ({
	feedId,
	type,
	title,
	description,
	data,
	isBookmarked,
	bookmarkId,
	// dismissByID,
	viewType,
	callback,
}: PostCommentCardType): JSX.Element => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const cardRef = useRef<HTMLDivElement | null>(null);

	const getRoute = () => {
		if (type === "post") {
			return `/groups/${data?.groupId}?tab=forum&postview=post&postId=${data?.postId}&fromDashboard=true`;
		} else {
			return `/groups/${data?.groupId}?tab=forum&postview=comment&commentId=${data?.commentId}&fromDashboard=true`;
		}
	};

	const { cleanedContent: postCleanedContent, images: postImages } =
		extractAndRemoveImages(description || "");

	const postAttachments = {
		attachments: [...(data?.attachments || []), ...postImages],
	};

	const hasAttachments =
		postAttachments?.attachments &&
		postAttachments?.attachments.length > 0 &&
		postAttachments?.attachments?.[0]?.url;

	useEffect(() => {
		const postInView = searchParams.get("postInView");
		const targetId = type === "post" ? data?.postId : data?.commentId;

		if (postInView && postInView === targetId && cardRef.current) {
			cardRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
			const url = new URL(window.location.href);
			url.searchParams.delete("postInView");
			router.replace(url.toString(), { scroll: false });
		}
	}, [searchParams, type, data, router]);
	return (
		<FeedWrapper
			className={`h-full cursor-pointer flex-col justify-start ${type === "comment" ? " md:!border-[#7DDE86]" : " md:!border-[#9BDCFD]"}`}
			onClick={() => {
				router.push(getRoute());
			}}
		>
			<div className="flex h-full w-full gap-2" ref={cardRef}>
				{(!postAttachments?.attachments?.[0]?.url ||
					!postAttachments?.attachments?.[0]?.mimeType) &&
					isDesktop && (
						<div className=" no-image flex h-full items-start">
							<SnowProfile
								src={data?.creator?.image}
								size="2md"
								url={`/members/${data?.creator?._id}`}
								score={
									parseInt(
										data?.creator?.nftTokenNumber || ""
									) || 0
								}
							/>
						</div>
					)}
				<div className="flex h-full w-full flex-col">
					<div className="flex h-full flex-col gap-2">
						<div className="flex h-full w-full gap-2">
							{postAttachments?.attachments &&
								postAttachments?.attachments.length > 0 &&
								postAttachments?.attachments?.[0]?.url &&
								isDesktop && (
									<div className="image present flex h-full items-start">
										<SnowProfile
											src={data?.creator?.image}
											size="2md"
											url={`/members/${data?.creator?._id}`}
											score={
												parseInt(
													data?.creator
														?.nftTokenNumber || ""
												) || 0
											}
										/>
									</div>
								)}
							<div className="flex h-full w-full flex-col justify-between gap-4">
								<div className="flex w-full flex-col gap-1">
									<div className="flex w-full flex-col items-start gap-3">
										{data?.title && (
											<span className="flex gap-2 md:gap-0">
												{!isDesktop && (
													<SnowProfile
														src={
															data?.creator?.image
														}
														size="xs"
														url={`/members/${data?.creator?._id}`}
														score={
															parseInt(
																data?.creator
																	?.nftTokenNumber ||
																	""
															) || 0
														}
													/>
												)}
												<p className="font-mono text-sm text-white/90 md:text-base">
													{title}
												</p>
											</span>
										)}
										<h3 className=" break-word whitespace-break-spaces  text-lg font-bold text-lemon-green md:text-2xl">
											{data?.title ? data?.title : title}
										</h3>

										{/* <X
											size={24}
											className=" right-2 cursor-pointer text-white"
											onClick={(e) => {
												dismissByID(feedId);
												e.stopPropagation();
											}}
										/> */}
									</div>
									<TruncateText
										description={postCleanedContent || ""}
									/>
									<ThumbnailRenderer
										content={postCleanedContent || ""}
									/>
								</div>
							</div>
						</div>

						{postAttachments?.attachments &&
							postAttachments?.attachments.length > 0 &&
							postAttachments?.attachments?.[0]?.url && (
								<div
									className={`grid gap-2 ${
										postAttachments?.attachments?.length ===
										1
											? "grid-cols-1"
											: "grid-cols-2 "
									}`}
								>
									{postAttachments?.attachments?.map(
										(attachment, index) => (
											<>
												{attachment?.url &&
													attachment?.mimeType && (
														<AttachmentPreview
															key={index}
															attachment={
																attachment
															}
															className={`${postAttachments?.attachments?.length === index + 1 && postAttachments?.attachments.length % 2 !== 0 ? "col-span-2" : "col-span-1"}`}
														/>
													)}
											</>
										)
									)}
								</div>
							)}

						<div
							className={`mt-auto flex items-end justify-between ${hasAttachments ? "md:ml-auto md:w-[calc(100%-6rem)]" : "w-full"}`}
						>
							<div
								className="flex items-center justify-start gap-4 md:gap-8"
								onClick={() => {
									router.push(getRoute());
								}}
							>
								<div className="flex cursor-pointer items-center gap-1 text-sm font-bold text-white">
									{/* <ArrowBigUp height={20} width={18} /> */}
									<span className="leading-none">
										Vote ({data?.upvotes})
									</span>
								</div>
								<div className="flex cursor-pointer items-center gap-1 text-sm font-bold  text-white">
									{/* <MessageCircle height={14} width={18} /> */}
									<span className="leading-none">
										Comment ({data?.commentCount})
									</span>
								</div>
								{/* <Button
							size="lg"
							variant="outline"
							className="rounded-full !border py-1.5 font-bold"
						>
							{type === "post" ? "View Post" : "View Convo"}
						</Button> */}
							</div>

							<RenderBookMark
								size={24}
								isBookmarked={
									isBookmarked || viewType === "bookmarked"
								}
								type={"feed"}
								id={feedId as string}
								bookmarkId={bookmarkId as string}
								callback={callback}
							/>
						</div>
					</div>
				</div>
			</div>
		</FeedWrapper>
	);
};
