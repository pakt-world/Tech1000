export type AchievementType =
	| "Comments"
	| "Posts"
	| "review"
	| "referral"
	| "five-star"
	| "squad"
	| "Upvotes"
	| "TechScore";

export interface AchievementSettingProps {
	value: number;
	maxValue: number;
	minValue: number;
	type: AchievementType;
}

type AchievementTypeMap = {
	[key in AchievementType]: {
		title: string;
		textColor: string;
		borderColor: string;
		barColor: string;
		barIndicatorColor: string;
		outerBackgroundColor: string;
		innerBackgroundColor: string;
	};
};

export const ACHIEVEMENT_STYLES: AchievementTypeMap = {
	TechScore: {
		title: "TechScore",
		textColor: "#287B7B",
		borderColor: "#FFB402",

		innerBackgroundColor: "#E0F5F5",
		outerBackgroundColor: "#F0FAFA",

		barColor: "#B5E3E3",
		barIndicatorColor: "#487E7E",
	},
	Posts: {
		title: "Posts",
		textColor: "#198155",
		borderColor: "#198155",

		innerBackgroundColor: "#F0FFF2",
		outerBackgroundColor: "#ECFCE5",

		barColor: "#D2FFBE",
		barIndicatorColor: "#7DDE86",
	},
	review: {
		title: "Reviews",
		textColor: "#198155",
		borderColor: "#198155",

		innerBackgroundColor: "#F0FFF2",
		outerBackgroundColor: "#ECFCE5",

		barColor: "#D2FFBE",
		barIndicatorColor: "#7DDE86",
	},
	Comments: {
		title: "Comments",
		textColor: "#287B7B",
		borderColor: "#B33F50",

		innerBackgroundColor: "#E0F5F5",
		outerBackgroundColor: "#F0FAFA",

		barColor: "#B5E3E3",
		barIndicatorColor: "#487E7E",
	},
	"five-star": {
		title: "5 Star Bounties",
		textColor: "#287B7B",
		borderColor: "#FFB402",

		innerBackgroundColor: "#E0F5F5",
		outerBackgroundColor: "#F0FAFA",

		barColor: "#B5E3E3",
		barIndicatorColor: "#487E7E",
	},
	Upvotes: {
		title: "Upvotes",
		textColor: "#0065D0",
		borderColor: "#0065D0",

		innerBackgroundColor: "#E1F5FF",
		outerBackgroundColor: "#C9F0FF",

		barColor: "#C0EEFF",
		barIndicatorColor: "#9BDCFD",
	},
	referral: {
		title: "Referrals",
		textColor: "#0065D0",
		borderColor: "#0065D0",

		innerBackgroundColor: "#E1F5FF",
		outerBackgroundColor: "#C9F0FF",

		barColor: "#C0EEFF",
		barIndicatorColor: "#9BDCFD",
	},
	squad: {
		title: "Squad",
		textColor: "#5538EE",
		borderColor: "#5538EE",

		innerBackgroundColor: "#F0EFFF",
		outerBackgroundColor: "#E7E7FF)",

		barColor: "#E0E0FF",
		barIndicatorColor: "#C6C4FF",
	},
};
