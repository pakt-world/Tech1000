import Image from "next/image";
import React, { useState, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";

interface DocumentPreviewProps {
	url: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ url }) => {
	const [loading, setLoading] = useState(true);
	const [fileType, setFileType] = useState<
		"image" | "video" | "pdf" | "excel" | "unknown"
	>("unknown");
	const [numPages, setNumPages] = useState<number | null>(null);

	pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

	const getFileType = (
		url: string
	): "image" | "video" | "pdf" | "excel" | "unknown" => {
		const extension = url.split(".").pop()?.toLowerCase();
		const imageTypes = ["jpg", "jpeg", "png", "gif"];
		const videoTypes = ["mp4", "webm", "ogg"];
		const pdfTypes = ["pdf"];
		const excelTypes = ["xls", "xlsx"];

		if (extension && imageTypes.includes(extension)) return "image";
		if (extension && videoTypes.includes(extension)) return "video";
		if (extension && pdfTypes.includes(extension)) return "pdf";
		if (extension && excelTypes.includes(extension)) return "excel";

		return "unknown";
	};

	useEffect(() => {
		const type = getFileType(url);
		setFileType(type);

		const timer = setTimeout(() => setLoading(false), 500); // Simulate loading time

		return () => clearTimeout(timer);
	}, [url]);

	return (
		<div className="document-preview">
			{loading && (
				<div className="flex h-64 items-center justify-center">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
				</div>
			)}

			{!loading && fileType === "image" && (
				<Image src={url} alt="Preview" className="h-auto max-w-full" />
			)}
			{!loading && fileType === "video" && (
				<video controls className="h-auto max-w-full">
					<source src={url} type={`video/${url.split(".").pop()}`} />
					Your browser does not support the video tag.
				</video>
			)}
			{!loading && fileType === "pdf" && (
				<div className="h-96 w-full">
					<Document
						file={url}
						onLoadSuccess={({ numPages }) => setNumPages(numPages)}
					>
						{Array.from(new Array(numPages), (el, index) => (
							<Page
								key={`page_${index + 1}${el}`}
								pageNumber={index + 1}
							/>
						))}
					</Document>
				</div>
			)}
			{!loading && fileType === "excel" && (
				<iframe
					src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
					className="h-96 w-full"
					title="Excel Preview"
				/>
			)}
			{!loading && fileType === "unknown" && (
				<p>File type not supported for preview.</p>
			)}
		</div>
	);
};

export default DocumentPreview;
