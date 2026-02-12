import localFont from "next/font/local";

/* istanbul ignore next */
const circularFont = localFont({
	src: [
		{
			path: "./circular/CircularStd-Bold.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "./circular/CircularStd-Medium.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./circular/CircularStd-Medium.ttf",
			weight: "500",
			style: "normal",
		},

		{
			path: "./circular/CircularStd-Book.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./circular/CircularStd-Book.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "./circular/CircularStd-Book.ttf",
			weight: "200",
			style: "normal",
		},
	],
	fallback: ["Inter", "sans-serif"],
});

export default circularFont;
