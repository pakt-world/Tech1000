/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ClassValue, clsx } from "clsx";
import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsUtc from "dayjs/plugin/utc";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import { ENVS } from "@/config";
import { type TransformedData } from "@/widgets/wallet/chart";

import { type MappedMember } from "./actions";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { type CategoryData } from "./api/category";
import type { ChartData, TransactionProps } from "./api/wallet";
import { KycVerificationStatus, Roles } from "./enums";
import { type AccountProps } from "./types/account";
import { type MemberProps } from "./types/member";

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export const generateUniqueId = (): string => {
	return `_${Math.random().toString(36).substr(2, 9)}`;
};

export const AUTH_TOKEN_KEY = ENVS.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "auth-token";
export const TEMP_AUTH_TOKEN_KEY = `temp_${ENVS.NEXT_PUBLIC_AUTH_TOKEN_KEY}`;

// Logo Util
export const getBrandLogo = (): string => {
	return "/images/snowfort-beta.png";
};

export const createQueryString = (name: string, value: string): string => {
	const params = new URLSearchParams();
	params.set(name, value);
	return params.toString();
};

type CreateQueryStringsParams = Array<{ name: string; value: string }>;

export const createQueryStrings = (opts: CreateQueryStringsParams): string => {
	const params = new URLSearchParams();
	opts.forEach((opt) => {
		params.set(opt.name, opt.value);
	});
	return params.toString();
};

type CreateQueryStringsOpts = Record<string, string>;

export const createQueryStrings2 = (opts: CreateQueryStringsOpts): string => {
	const params = new URLSearchParams();
	Object.keys(opts).forEach((key) => {
		const value = opts[key];
		if (value !== undefined) {
			params.set(key, value);
		}
	});
	return params.toString();
};

export const spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

export const formatCountdown = (counter: number): string => {
	const minutes = Math.floor(counter / 60);
	const seconds = counter % 60;

	return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export function formatBytes(bytes: number, decimals = 2): string {
	if (!+bytes) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = [
		"Bytes",
		"KiB",
		"MiB",
		"GiB",
		"TiB",
		"PiB",
		"EiB",
		"ZiB",
		"YiB",
	];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export const CopyText = async (text: string): Promise<void> =>
	navigator.clipboard.writeText(text);

export function sentenceCase(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
export function sentenceCase2(str: string): string {
	return str
		.split(" ")
		.map(
			(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		)
		.join(" ");
}

export function formatUsd(value: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(value);
}

export const truncate = (str: string, n: number): string => {
	return str.length > n ? `${str.slice(0, n - 1)}...` : str;
};

export const truncateText = (
	text: string,
	limit: number,
	expanded: boolean
): string => {
	if (expanded || text.length <= limit) {
		return text;
	}
	return `${text.slice(0, limit)}...`;
};

export const lowerCase = (str: string): string => {
	if (str) {
		return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
	}
	return "";
};

export const titleCase = (str: string): string => {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export function getAvatarColor(paktScore: number): string {
	if (paktScore <= 20) {
		return "#DC3545";
	}
	if (paktScore <= 40) {
		return "#F9D489";
	}
	if (paktScore <= 60) {
		return "#F2C94C";
	}
	if (paktScore <= 80) {
		return "#9BDCFD";
	}
	return "#28A745";
}

interface ColorResult {
	circleColor: string;
	bgColor: string;
	borderColor?: string;
}

export const colorFromScore = (score: number): ColorResult => {
	if (score >= 0 && score <= 20)
		return {
			// circleColor: "linear-gradient(149deg, #FA042F 0%, #FF6A84 100%)",
			circleColor: "#454545",
			bgColor: "#FFF8F8",
			borderColor: "#FF6A84",
		};
	if (score >= 21 && score <= 35)
		return {
			circleColor: "linear-gradient(171deg, #FFF70A 0%, #EEE600 100%)",
			bgColor: "#FFFFF0",
			borderColor: "#EEE600",
		};
	if (score >= 36 && score <= 50)
		return {
			circleColor: "linear-gradient(166deg, #FFB402 0%, #E19E00 100%)",
			bgColor: "#FFFFF0",
			borderColor: "#E19E00",
		};
	if (score >= 51 && score <= 79)
		return {
			circleColor: "linear-gradient(162deg, #08A7FC 0%, #71CDFF 100%)",
			bgColor: "#F2FBFF",
			borderColor: "#71CDFF",
		};
	return {
		circleColor: "linear-gradient(145deg, #05BD2F 0%, #0FF143 100%)",
		bgColor: "#ECFCE5",
		borderColor: "#0FF143",
	};
};

export const limitString = (str: string, limit: number = 10): string =>
	str.length > limit ? `${str.slice(0, limit)}...` : str;

// ============== Attachment Utils =============== //

const allowedFileTypes = [
	"pdf",
	"doc",
	"ai",
	"avi",
	"docx",
	"csv",
	"ppt",
	"zip",
	"rar",
	"jpg",
	"jpeg",
	"png",
	"webp",
];

interface PreviewResult {
	preview: string;
	type: string;
}

export function getPreviewByType(file: File): PreviewResult {
	const { type } = file;
	let preview;
	if (type.includes("image/")) {
		preview = URL.createObjectURL(file);
	} else {
		const typP = type.split("/")[1];
		if (typP && allowedFileTypes.includes(typP))
			preview = `/images/thumbnail/${typP.toUpperCase()}.png`;
		else preview = "/images/thumbnail/TXT.png";
	}
	return { preview, type };
}
export function getPreviewByType2(type: string): PreviewResult {
	let preview;
	const typP = type.split("/")[1];
	if (typP && allowedFileTypes.includes(typP))
		preview = `/images/thumbnail/${typP.toUpperCase()}.png`;
	else preview = "/images/thumbnail/TXT.png";

	return { preview, type };
}

export function getPreviewByTypeUrl(url: string, type: string): PreviewResult {
	let preview;
	if (type.includes("image/") || type === "image") {
		preview = url;
	} else {
		const typP = type.split("/")[1];
		if (typP && allowedFileTypes.includes(typP))
			preview = `/images/thumbnail/${typP}.png`;
		else preview = "/images/thumbnail/TXT.png";
	}
	return { preview, type };
}

// Utility function to check if an image is broken
export const isImageBroken = async (src: string): Promise<boolean> => {
	return new Promise((resolve) => {
		const img = new Image();
		img.src = src;
		img.onload = () => {
			resolve(false);
		};
		img.onerror = () => {
			resolve(true);
		};
	});
};

// ============== Attachment Utils =============== //

export const paginate = <T>(
	array: T[],
	itemsPerPage: number,
	currentPage: number
): T[] => {
	return array.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
};

export function filterEmptyStrings(arr: string[]): string[] {
	return arr.filter((value) => {
		return value !== "";
	});
}

export function formatTimestampForDisplay(
	utcTimestamp: string | number | Date
): string {
	const localTimestamp = new Date(utcTimestamp);
	// Only show the time
	return localTimestamp.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	});
}

export function formatNumberWithCommas(
	number?: string | number | undefined,
	decimal?: number
): string {
	if (!number) return "";
	// Convert the input to a number if it's a string
	const num = typeof number === "string" ? parseFloat(number) : number;

	// If num is not a valid number, return an empty string or handle it accordingly
	// eslint-disable-next-line no-restricted-globals
	if (isNaN(num)) {
		return "";
	}

	// Split the number into integer and decimal parts
	const [integerPart = "0", decimalPart = ""] = num
		.toFixed(decimal ?? 2)
		.split(".");

	// Format the integer part with commas
	const formattedIntegerPart = integerPart.replace(
		/\B(?=(\d{3})+(?!\d))/g,
		","
	);

	// Recombine the integer and decimal parts
	const formattedNumber = decimalPart
		? `${formattedIntegerPart}.${decimalPart}`
		: formattedIntegerPart;

	return formattedNumber;
}

export function formatNumber(number: number): string {
	if (number >= 1e12) {
		return `${(number / 1e12).toFixed(2)}t`;
	}
	if (number >= 1e9) {
		return `${(number / 1e9).toFixed(2)}b`;
	}
	if (number >= 1e6) {
		return `${(number / 1e6).toFixed(2)}m`;
	}
	if (number >= 1e3) {
		return `${(number / 1e3).toFixed(2)}k`;
	}
	return number.toFixed(2).toString();
}

export const formatDateHandler = (date?: string, format?: string): string => {
	// Get timezone from localStorage, then format with dayjs
	const timezone = localStorage.getItem("5n0wf0rt_u53r_71m3z0n3") as
		| string
		| undefined;

	const d = date
		? timezone !== undefined && timezone !== "undefined"
			? dayjs(date)
					.tz(timezone)
					.format(format ?? "MMM D, YYYY")
			: dayjs(date).format(format ?? "MMM D, YYYY")
		: dayjs();

	return d as string;
};

export const mapValueToPx = (
	value: number,
	minRange: number,
	maxRange: number,
	minPx: number,
	maxPx: number
): string => {
	// Clamp value within the range
	const clampedValue = Math.max(minRange, Math.min(maxRange, value));

	// Calculate the scale factor
	const scale: number = (maxPx - minPx) / (maxRange - minRange);

	// Calculate the pixel value
	const pxValue: number = minPx + (clampedValue - minRange) * scale;

	// Return the pixel value with 'px' unit
	return `${pxValue}px`;
};

interface RejectSpecialCharactersOptions {
	allowApostrophes?: boolean;
}

// Empty functions for empty onClick handlers instead of using unnecessary `console.log()`
export const emptyFunction = (): void => {
	// Modifying a data structure
	const arr: number[] = [];
	arr.push(5);
};

/**
 * Checks the input string and rejects special characters.
 * Allows only alphanumeric characters, spaces, and some basic punctuation.
 *
 * @param {string} input - The input string to validate.
 * @return {boolean} - Returns true if the input contains only allowed characters, false otherwise.
 */
export const rejectSpecialCharacters = (
	input: string,
	options: RejectSpecialCharactersOptions = {}
): boolean => {
	const { allowApostrophes = false } = options;
	const pattern = allowApostrophes
		? /^[a-zA-Z0-9 ,.'-]+$/
		: /^[a-zA-Z0-9 ,.-]+$/;
	return pattern.test(input);
};

export const filterSkillsByName = (
	items: CategoryData[],
	disallowedChars: string[]
): CategoryData[] => {
	// Create a regex pattern from the disallowed characters
	// const regex = new RegExp(`[${disallowedChars.join("")}]`, "i");
	const regex = new RegExp(
		`[${disallowedChars.map((char) => `\\${char}`).join("")}]`,
		"i"
	);

	// Filter the array to exclude items with names containing any disallowed characters
	return items.filter((item) => !regex.test(item.name));
};

export const disallowedChars = [
	"<",
	">",
	"{",
	"}",
	"(",
	")",
	"=",
	"-",
	"~",
	"!",
	"@",
	"#",
	"$",
	"%",
	"^",
	"&",
	"*",
	"_",
	"+",
	"|",
	":",
	";",
	"'",
	",",
	"?",
	"/",
	"`",
	'"',
	".",
	" ",
];

/**
 * Truncates the email before the @domain if it exceeds a specified length
 * @param {string} email - The email address to be truncated
 * @param {number} maxLength - The maximum length before truncation
 * @returns {string} - The truncated email
 */
export function truncateEmail(email: string, maxLength: number): string {
	const [localPart, domain] = email.split("@");
	if (localPart) {
		if (localPart.length > maxLength) {
			return `${localPart.substring(0, maxLength)}...@${domain}`;
		}
	}
	return email;
}

/**
 * Determines the type based on the provided object
 * @param {Object} data - The data object to check
 * @returns {string} - "Parker" if data.type === "parker", otherwise "Tarker"
 */
export function determineRole(
	data: AccountProps | MemberProps | MappedMember
): Roles {
	// Extra Check i.e instances where some old data don't have Roles as partner or ambassador but as creator or recipient - So to avoid any issues, we check for both
	if (data.role === Roles.PARTNER || data.type === Roles.CREATOR) {
		return Roles.PARTNER;
	}
	return Roles.AMBASSADOR;
}

export function getRequestSignature(url: string): {
	signature: string;
	timeStamp: string;
} {
	const timestamp = Date.now();
	const key = String(process.env.NEXT_PUBLIC_API_KEY);
	const clientId = String(process.env.NEXT_PUBLIC_API_ID);

	const payload = {
		url,
		"time-stamp": String(timestamp),
		"client-id": clientId,
	};
	const dataStr = JSON.stringify(payload);
	const hash = CryptoJS.HmacSHA256(dataStr, String(key));
	const signature = hash.toString();

	return { signature, timeStamp: String(timestamp) };
}

export const transformAndSortData = (
	data: ChartData[] | undefined,
	dateFormat: string
): TransformedData[] => {
	if (!data) {
		return [];
	}

	return data
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((c) => {
			return {
				date: moment(c.date).utc().format(dateFormat),
				amt: c.value,
			};
		});
};

export const parseTransactionHash = (tx: TransactionProps): string | object => {
	if (tx.responseData !== null && tx.responseData !== undefined) {
		const response = JSON.parse(tx.responseData);
		if (response.data.tx) {
			return response.data.tx.transactionHash;
		}
	}
	return "";
};

export function isValidInteger(value: string): boolean {
	// Check if value is a non-positive integer (0 or negative)
	const intValue = parseInt(value, 10);
	return Number.isInteger(intValue) && intValue <= 0;
}

type LinkCheckType = (link: string) => string;

export const linkChecker: LinkCheckType = (link: string): string => {
	if (!link) {
		return "";
	}
	if (!link.includes("https://")) {
		return `https://${link}`;
	}
	return link;
};

export const getWalletIcon = (
	wallet:
		| {
				id?: string;
				_id?: string;
				amount: number;
				usdValue: number;
				coin: string;
				icon: string;
		  }
		| undefined
		| null
): string => {
	return wallet?.icon ?? "/icons/usdc-logo.svg";
};

export const userKycIsApproved = (kycStatus: string): boolean => {
	return kycStatus === KycVerificationStatus.APPROVED;
};
export const isProductionEnvironment = ENVS.isProduction;

export const formatLink = (link: string): string => {
	if (!link) return link;

	if (!/^https?:\/\//i.test(link) && !/^www\./i.test(link)) {
		return "https://" + link;
	}

	return link;
};

const mimeTypeToFileType = (mimeType: string): string | null => {
	const mimeMap: { [key: string]: string } = {
		"application/pdf": "pdf",
		"image/jpeg": "jpg",
		"image/png": "png",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			"docx",
		"text/csv": "csv",
		"application/vnd.ms-excel": "xls",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
			"xlsx",
		"image/avif": "avif",
		"image/webp": "webp",
	};

	return mimeMap[mimeType] || null;
};

export const getFileTypeForViewer = (mimeType: string): string | null => {
	const fileType = mimeTypeToFileType(mimeType);
	if (!fileType) {
		console.error(`Unsupported MIME type: ${mimeType}`);
		return null;
	}
	return fileType;
};

export const convertDate = (dateString: string): string => {
	const date = new Date(dateString);

	const options: Intl.DateTimeFormatOptions = {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};

	return date.toLocaleString("en-US", options);
};

export const SYSTEM_SETTINGS_KEY = "5Y573M_570R4G3";

export const extractAndRemoveImages = (content: string) => {
	const imgRegex = /<img[^>]*>/g;
	const images: { _id: string; url: string; mimeType: string }[] = [];
	let cleanedContent = content;

	cleanedContent = cleanedContent.replace(imgRegex, (match) => {
		const srcMatch = match.match(/src="([^">]+)"/);
		if (srcMatch) {
			const url = srcMatch[1] as string;
			images.push({ _id: "1", url, mimeType: "image/jpeg" });
		}
		return "";
	});

	cleanedContent = cleanedContent.replace(/<[^>]*alt="[^"]*"[^>]*>/g, "");

	return { cleanedContent, images };
};

export const replaceIPFSWithGatewayURL = (imageURL: string): string => {
	if (!imageURL) {
		return "";
	}
	return imageURL.replace(
		"https://ipfs.io/ipfs/",
		"https://gateway.pinata.cloud/ipfs/"
	);
};

export const truncateName = (name: string, maxLength: number = 30): string => {
	if (name.length <= maxLength) {
		return name;
	}
	return name.slice(0, maxLength) + "...";
};

export const getRandomReadableBgColor = (): string => {
	const bgColors = [
		"#FEE440", // bright yellow
		"#FFD6A5", // peach
		"#CFFAFE", // light cyan
		"#B9FBC0", // mint green
		"#A0C4FF", // baby blue
		"#FFADAD", // light pink
		"#E9FF70", // lime yellow
	];

	// Get a safe random index
	const randomIndex: number = Math.floor(Math.random() * bgColors.length);

	// Always return a string
	return bgColors[randomIndex] ?? "#FEE440";
};
