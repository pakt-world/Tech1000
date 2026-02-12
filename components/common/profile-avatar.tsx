/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import * as Avatar from "@radix-ui/react-avatar";
import { DefaultAvatar } from "@/components/common/default-avatar";
import Link from "next/link";

type AvatarSize =
	| "xs"
	| "sm"
	| "2sm"
	| "md"
	| "2md"
	| "lg"
	| "xl"
	| "2xl"
	| "3xl";

interface AvatarProps {
	src?: string;
	score?: number;
	url?: string;
	size?: AvatarSize;
	isPartner?: boolean;
	onClick?: () => void;
}

const sizeClasses = {
	xs: "w-8 h-8 text-xs",
	sm: "w-12 h-12 text-xs", // Small size (48px)
	"2sm": "w-12 h-12 text-xs",
	md: "w-16 h-16 text-sm", // Medium size (64px)
	"2md": "w-24 h-24 text-sm", // Medium size (64px)
	lg: "w-36 h-36 text-lg", // Large size (96px)
	xl: "w-40 h-40 text-lg",
	"2xl": "w-40 h-40 text-lg",
	"3xl": "w-56 h-56 text-xl",
};

const ProfileAvatar: React.FC<AvatarProps> = ({
	src,
	url,
	score,
	size = "md",
	onClick,
	// isPartner,
}) => {
	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};
	return (
		<>
			{url ? (
				<Link
					href={url ?? ""}
					className="inline-block scale-95"
					style={{ objectFit: "cover" }}
					onClick={(e) => handleClick(e)}
				>
					{!src ? ( // || score === 0 ? ( commented this out not sure the logic works with tech1000
						<div className="relative h-full w-full rounded-full">
							<Avatar.Root
								className={`flex overflow-hidden rounded-full ${sizeClasses[size]}`}
							>
								<DefaultAvatar />
							</Avatar.Root>
							{/* {!isPartner && (
						<div
							className={`absolute -right-6 top-[20px] z-20 flex h-[26px] w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-400 text-white ${size === "lg" ? "!-right-4 scale-95" : size === "2md" ? " scale-85 !-right-4" : size === "md" ? " !-right-5 scale-75" : size === "sm" ? " !-right-8 top-[5px] scale-[0.6]" : ""}`}
						>
							<span className="text-center text-xs leading-[18px] tracking-wide text-white">
								New
							</span>
						</div>
					)} */}
						</div>
					) : (
						<>
							<Avatar.Root
								className={`flex overflow-hidden rounded-full ${sizeClasses[size]}`}
							>
								<Avatar.Image
									src={src}
									alt="Avatar"
									className="h-full w-full rounded-[inherit] object-cover"
								/>
								<Avatar.Fallback className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-700"></Avatar.Fallback>
							</Avatar.Root>

							{score !== undefined && (
								<span
									className={`
								absolute
                    right-0 top-0 flex 
                    items-center justify-center rounded-full border
                    border-[#222D38] bg-[#50B133] font-mono text-white
                    ${size === "xs" ? " !-top-1 !right-0 h-3 w-3 text-[0.4rem]" : size === "sm" ? " !-top-1 !right-0 h-4 w-4 text-[0.5rem]" : size === "md" ? "right-0 h-5 w-5 text-sm" : size === "2md" ? "right-0 h-8 w-8 text-sm" : "h-12 w-12 text-2xl font-bold"}
                `}
								>
									{score}
								</span>
							)}
						</>
					)}
				</Link>
			) : (
				<div
					className="inline-block scale-95 cursor-pointer"
					style={{ objectFit: "cover" }}
					onClick={onClick}
				>
					{!src ? ( // || score === 0 ? ( commented this out not sure the logic works with tech1000
						<div className="relative h-full w-full rounded-full">
							<Avatar.Root
								className={`flex overflow-hidden rounded-full ${sizeClasses[size]}`}
							>
								<DefaultAvatar />
							</Avatar.Root>
							{/* {!isPartner && (
					<div
						className={`absolute -right-6 top-[20px] z-20 flex h-[26px] w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-400 text-white ${size === "lg" ? "!-right-4 scale-95" : size === "2md" ? " scale-85 !-right-4" : size === "md" ? " !-right-5 scale-75" : size === "sm" ? " !-right-8 top-[5px] scale-[0.6]" : ""}`}
					>
						<span className="text-center text-xs leading-[18px] tracking-wide text-white">
							New
						</span>
					</div>
				)} */}
						</div>
					) : (
						<>
							<Avatar.Root
								className={`flex overflow-hidden rounded-full ${sizeClasses[size]}`}
							>
								<Avatar.Image
									src={src}
									alt="Avatar"
									className="h-full w-full rounded-[inherit] object-cover"
								/>
								<Avatar.Fallback className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-700"></Avatar.Fallback>
							</Avatar.Root>

							{score !== undefined && (
								<span
									className={`
							absolute
				right-0 top-0 flex 
				items-center justify-center rounded-full border
				border-[#222D38] bg-[#50B133] font-mono text-white
				${size === "xs" ? " !-top-1 !right-0 h-3 w-3 text-[0.4rem]" : size === "sm" ? " !-top-1 !right-0 h-4 w-4 text-[0.5rem]" : size === "md" ? "right-0 h-5 w-5 text-sm" : size === "2md" ? "right-0 h-8 w-8 text-sm" : "h-12 w-12 text-2xl font-bold"}
			`}
								>
									{score}
								</span>
							)}
						</>
					)}
				</div>
			)}
		</>
	);
};

export default ProfileAvatar;
