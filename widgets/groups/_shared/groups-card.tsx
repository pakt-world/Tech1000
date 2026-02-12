"use client";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { FC } from "react";
import { useRouter } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import CardView from "@/components/common/card-view";
import { Tag } from "@/lib/types/groups";
import Image from "next/image";
import { getRandomReadableBgColor } from "@/lib/utils";

interface NavItemType {
	name: string;
	id: string;
	image: string;
	tags: Tag[];
	members: number;
	className?: string;
	onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	score?: number;
}

const GroupsCard: FC<NavItemType> = ({
	name,
	id,
	image,
	tags,
	members,
	className,
	onClick,
	score,
}) => {
	const router = useRouter();

	const handleCardClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (onClick) {
			onClick(e);
		} else {
			router.push(`/groups/${id}`);
		}
	};

	return (
		<CardView
			className={`col-span-1 flex cursor-pointer flex-col gap-4 rounded-none !px-4 !py-4 md:rounded-[30px] md:!border-[#5FADCB] ${className}`}
			onClick={handleCardClick}
		>
			<div className="flex w-full gap-4">
				<div className="h-[55px] w-[59px] rounded-lg">
					<Image
						src={image}
						alt={`${name}'s image`}
						className="h-full w-full rounded-lg object-cover"
						width={59}
						height={55}
					/>
				</div>
				<p className="max-w-[75%] text-xl font-bold text-white">
					{name}
				</p>
			</div>
			<div className="relative flex w-full justify-start gap-2">
				{score && (
					<div className="rounded-full border border-lemon-green bg-[#B2E9AA1A] px-3.5 py-0.5 text-sm text-white">{`Techscore: ${score || 0}`}</div>
				)}
				<div className="rounded-full bg-[#B2E9AA1A] px-3.5 py-0.5 text-sm text-white">{`${members || 0} member${members > 1 ? "s" : ""}`}</div>
			</div>
			<div className="flex w-full justify-start gap-2 overflow-x-scroll">
				{tags?.length > 0 &&
					tags?.slice(0, 3).map((tag, i) => (
						<span
							key={i}
							className="rounded-full bg-white px-4 py-1 text-sm font-medium capitalize text-[#090A0A]"
							style={{
								backgroundColor:
									tag.color || getRandomReadableBgColor(),
							}}
						>
							{tag.name}
						</span>
					))}
			</div>
		</CardView>
	);
};

export default GroupsCard;
