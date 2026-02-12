import { AchievementType } from "../enums";
import { EmptyAchievementProps } from "../types/member";

export const emptyAchievementStyle: EmptyAchievementProps[] = [
	{
		id: AchievementType.REVIEW,
		title: "Review",
		total: "60",
		textColor: "#A05E03",
		bgColor: "#FFEFD7",
	},
	{
		id: AchievementType.FIVE_STAR,
		title: "5 Star Bounties",
		total: "10",
		textColor: "#198155",
		bgColor: "#ECFCE5",
	},
	{
		id: AchievementType.REFERRAL,
		title: "Referral",
		total: "20",
		textColor: "#0065D0",
		bgColor: "#C9F0FF",
	},
	{
		id: AchievementType.SQUAD,
		title: "Squad",
		total: "10",
		textColor: "#D3180C",
		bgColor: "#FFE5E5",
	},
];

export const EMPTY_ACHIEVEMENTS = [
	{
		_id: "",
		owner: "",
		type: "review",
		total: "60",
		value: "0",
		createdAt: "",
		updatedAt: "",
		__v: 0,
	},
	{
		_id: "",
		owner: "",
		type: "five-star",
		total: "10",
		value: "0",
		createdAt: "",
		updatedAt: "",
		__v: 0,
	},
	{
		_id: "",
		owner: "",
		type: "referral",
		total: "20",
		value: "0",
		createdAt: "",
		updatedAt: "",
		__v: 0,
	},

	{
		_id: "",
		owner: "",
		type: "squad",
		total: "10",
		value: "0",
		createdAt: "",
		updatedAt: "",
		__v: 0,
	},
];

export const META = {
	coin: {
		active: true,
		createdAt: "2023-12-19T08:52:53.736Z",
		decimal: "6",
		icon: "https://chainsite-storage.s3.amazonaws.com/icons/usdc.svg",
		isToken: true,
		name: "USDC",
		reference: "usdc",
		rpcChainId: "43113",
		symbol: "USDC",
		updatedAt: "2024-04-29T13:30:39.220Z",
		__v: 0,
		_id: "658159e56e57568c2bfbae67",
	},
};
