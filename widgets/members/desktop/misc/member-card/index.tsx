"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ChevronUp } from "lucide-react";
import { useWindowSize } from "usehooks-ts";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Badge } from "@/components/common/badge";
import { SnowProfile } from "@/components/common/snow-profile";
// import { getAchievementData } from "@/lib/actions";
import { Roles } from "@/lib/enums";
// import { EMPTY_ACHIEVEMENTS } from "@/lib/store";
import { type GroupAchievemtProps } from "@/lib/types/member";
// import { colorFromScore } from "@/lib/utils";

import Elements from "./elements";
import { Overlay } from "./overlay";
import CardView from "@/components/common/card-view";

interface MemberCardProps {
	id: string;
	name: string;
	title: string;
	imageUrl?: string;
	score?: string;
	skills: Array<{ name: string; color: string }>;
	achievements: GroupAchievemtProps;
	type: Roles;
	nftTokenNumber?: string;
}

interface AchievementType {
	id: string;
	title: string;
	total: number;
	textColor: string;
	bgColor: string;
	borderColor: string;
}

export const MemberCard = ({
	id,
	name,
	title,
	imageUrl,
	score,
	skills,
	achievements,
	type,
	nftTokenNumber,
}: MemberCardProps): JSX.Element => {
	const router = useRouter();
	const isPartner = type === Roles.PARTNER;
	// const colorCodes = colorFromScore(
	// 	parseInt(isPartner ? "100" : (score ?? "0"), 10)
	// );
	const size = useWindowSize();

	const sortedAchievements: AchievementType[] = [
		{
			"id": "Techscore",
			"title": "TechScore",
			"total": parseInt(score ?? "0"),
			"textColor": "#090A0A",
			"bgColor": "#FFE6A4",
			"borderColor": "#F2C54D",
		},
		{
			"id": "post",
			"title": "Post",
			"total": achievements.posts,
			"textColor": "#198155",
			"bgColor": "#ECFCE5",
			"borderColor": "#23C16B",
		},
		{
			"id": "comments",
			"title": "Comments",
			"total": achievements.comments,
			"textColor": "#A05E03",
			"bgColor": "#FFEFD7",
			"borderColor": "#FFB323",
		},
		{
			"id": "upvotes",
			"title": "Upvotes",
			"total": achievements.upvotes,
			"textColor": "#0065D0",
			"bgColor": "#C9F0FF",
			"borderColor": "#0065D0",
		},
	];

	const goToMembersView = () => {
		router.push(`/members/${id}`);
	};
	return (
		<div
			key={id}
			className="m-0 h-[300px] w-full overflow-hidden rounded-3xl p-0"
		>
			<CardView className="flex h-[300px] w-full overflow-hidden !rounded-[40px] !border-[#9BDCFD] !p-0">
				<div className="relative h-full w-full">
					<Elements colorCodes={"#454545"} />

					<SnowProfile
						size={
							size.width > 1530
								? "3xl"
								: size.width > 768
									? "2xl"
									: "xl"
						}
						score={parseInt(nftTokenNumber || "") || 0}
						src={imageUrl}
						url={`/members/${id}`}
						isPartner={isPartner}
						className="mt-6"
					/>

					<div
						className="absolute bottom-0 !z-[500] -mb-[182px] flex h-full w-full cursor-pointer flex-col overflow-hidden  duration-200 ease-out hover:-mb-[10px] 2xl:hover:mb-[0px]"
						onClick={goToMembersView}
					>
						<div className="relative z-[500]">
							<Overlay />
							<div className="absolute top-[5px] mx-auto flex w-full justify-center ">
								<ChevronUp
									className="z-[500] mx-auto -mt-[3px] text-[#198155]"
									size={25}
									strokeWidth={1.5}
								/>
							</div>
							<div className="absolute top-[7%] h-full w-full rounded-[20px] border-none backdrop-blur-lg ">
								<div className="relative rounded-2xl border-t-0 px-5  ">
									<div className="flex flex-col items-start gap-2">
										<span className="my-auto w-full truncate pb-0 pt-3 text-2xl font-semibold capitalize text-black">
											{name}
										</span>

										<span className="mb-4 text-base capitalize text-[#121212] 2xl:mb-2">
											{title || "Builder"}
										</span>

										{skills?.length > 0 && (
											<div className=" grid w-full grid-cols-3 items-center gap-2">
												{skills?.slice(0, 3).map(
													(
														skill: {
															name: string;
															color: string;
														},
														i: number
													) => {
														const {
															color,
															name: n,
														} = skill;
														const s = n || skill;
														const c =
															color || "#B2AAE9";
														return (
															<span
																key={i}
																className="shrink-0 grow items-center gap-2 truncate rounded-3xl px-3 py-1 text-center capitalize"
																style={{
																	backgroundColor:
																		c,
																}}
															>
																{s as string}
															</span>
														);
													}
												)}
											</div>
										)}
									</div>

									<div className="mt-3 flex flex-col gap-2">
										<h3 className="text-base font-normal text-[#121212]">
											Achievements
										</h3>
										<div className="grid grid-cols-4 gap-2">
											{sortedAchievements.map(
												(
													a: AchievementType,
													i: number
												) => {
													return (
														<Badge
															key={i}
															title={a?.title}
															// value={a?.value}
															total={a?.total}
															textColor={
																a?.textColor
															}
															bgColor={a?.bgColor}
															borderColor={
																a?.borderColor
															}
															// type={a.type}
															isPartner={
																isPartner
															}
														/>
													);
												}
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardView>
		</div>
	);
};
