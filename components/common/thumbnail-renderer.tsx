import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Thumbnail {
	url: string;
	title?: string;
	description?: string;
	image?: string;
}

interface ThumbnailRendererProps {
	content: string;
}

const ThumbnailRenderer: React.FC<ThumbnailRendererProps> = ({ content }) => {
	const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);

	const urlRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/g;

	const extractUrls = (text: string): string[] => {
		const matches: string[] = [];
		let match;

		while ((match = urlRegex.exec(text)) !== null) {
			matches.push(match[1] as string);
		}

		return matches;
	};

	const fetchOpenGraphData = async (url: string): Promise<Thumbnail> => {
		try {
			const response = await axios.get(
				`/api/fetch-og-data?url=${encodeURIComponent(url)}`
			);
			return response.data;
		} catch (error) {
			console.error(`Failed to fetch Open Graph data from ${url}`, error);
			return { url }; // Return the url in case of error
		}
	};

	const fetchYouTubeOEmbed = async (videoId: string): Promise<Thumbnail> => {
		try {
			const response = await fetch(
				`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
			);
			const oEmbedData = await response.json();

			return {
				url: `https://www.youtube.com/watch?v=${videoId}`,
				title: oEmbedData.title,
				description: oEmbedData.author_name,
				image: oEmbedData.thumbnail_url,
			} as Thumbnail;
		} catch (error) {
			console.error("Error fetching YouTube oEmbed data:", error);
			// Fallback to manually constructing thumbnail URL
			return {
				url: `https://www.youtube.com/watch?v=${videoId}`,
				title: "YouTube Video",
				image: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
			} as Thumbnail;
		}
	};

	const fetchThumbnails = async (urls: string[]) => {
		const thumbnailsData = await Promise.all(
			urls.map(async (url) => {
				if (url.includes("youtube.com") || url.includes("youtu.be")) {
					const videoId =
						url.split("v=")[1]?.split("&")[0] ||
						url.split("/").pop();
					return await fetchYouTubeOEmbed(videoId!);
				}
				// Fetch OpenGraph data for non-YouTube URLs
				return await fetchOpenGraphData(url);
			})
		);

		setThumbnails(thumbnailsData);
	};

	// const removeThumbnail = (url: string) => {
	// 	setThumbnails((prevThumbnails) =>
	// 		prevThumbnails.filter((thumbnail) => thumbnail.url !== url)
	// 	);
	// };

	useEffect(() => {
		const urls = extractUrls(content);
		if (urls.length) {
			fetchThumbnails(urls);
		} else {
			setThumbnails([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [content]);

	return (
		<>
			{thumbnails.length > 0 && (
				<div className="flex flex-col gap-2">
					{thumbnails
						.slice(0, 1)
						.map((thumbnail: Thumbnail, index: number) => {
							if (thumbnail?.image) {
								return (
									<a
										href={thumbnail.url}
										key={index}
										target="_blank"
										rel="noopener noreferrer"
										onClick={(e) => e.stopPropagation()}
										className="group relative flex w-full overflow-hidden rounded-lg bg-white text-black shadow-md md:min-h-[100px]"
									>
										{/* <X
										color="red"
										size={16}
										className="absolute right-0 top-0 cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100"
										onClick={() =>
											removeThumbnail(thumbnail.url)
										}
									/> */}
										<div className="flex h-full w-fit gap-1 md:gap-2">
											<div className="relative w-[60px] border-r md:min-h-[80px] md:w-[150px] ">
												{thumbnail.image && (
													<Image
														src={thumbnail.image}
														alt={
															thumbnail.title as string
														}
														className="w-full object-contain"
														layout="fill"
													/>
												)}
											</div>
											<div className=" flex w-fit max-w-[240px] flex-col gap-1 p-2 font-circular md:gap-2  md:p-4">
												<h4 className="max-w-[360px] truncate font-mono text-sm font-semibold md:text-lg  2xl:max-w-full">
													{thumbnail.title}
												</h4>
												<p className=" max-w-[270px] truncate text-xs md:max-w-[360px] 2xl:max-w-full ">
													{thumbnail.description}
												</p>
												<p className="w-fit max-w-[270px] truncate rounded-full bg-[#0000001A] px-3 py-1 text-xs md:max-w-[360px] md:text-sm 2xl:max-w-full">
													{thumbnail.url}
												</p>
											</div>
										</div>
									</a>
								);
							}
							return null;
						})}
				</div>
			)}
		</>
	);
};

export default ThumbnailRenderer;
