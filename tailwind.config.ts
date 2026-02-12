import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssRadix from "tailwindcss-radix";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./widgets/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		screens: {
			sm: "640px",
			// => @media (min-width: 640px) { ... }

			md: "768px",
			// => @media (min-width: 768px) { ... }

			lg: "1024px",
			// => @media (min-width: 1024px) { ... }

			xl: "1280px",
			// => @media (min-width: 1280px) { ... }

			"2xl": "1536px",
			// => @media (min-width: 1536px) { ... }

			"2xl-5": "1600px",
			// => @media (min-width: 1600px) { ... }

			"3xl": "1600px",
		},
		extend: {
			colors: {
				info: "#17A2B8",
				sky: "#CDCFD0",
				"sky-dark": "#979C9E",
				line: "rgba(232, 232, 232, 1)",
				title: "#1F2739",
				primary: "#0E0707",
				"primary-light": "#262020",
				"primary-lighter": "#FF98984D",
				secondary: "#FF99A2",
				"success-lighter": "rgba(39, 174, 96, 0.1)",
				preference: "rgba(133, 133, 133, 0.1)",
				"refer-border": "#E8E8E8",
				"refer-bg": "#F9F9F9",
				"input-bg": "#FCFCFD",
				"sky-lighter": "#F7F9FA",
				body: "#6C757D",
				success: "#28A745",
				warning: "#F2C94C",
				danger: "#DC3545",
				"ink-dark": "#0D0E0F",
				"ink-darkest": "#090A0A",
				"dark-badge": "#F2F4F51A",
				"light-badge": "#FEB4BB",
				"lighter-badge": "#FFE5E5",
				"green-check": "#23C16B",
				"in-progress": "#FF980033",
				"lemon-green": "#CCF975",
				"teal-blue": "#2E7DA7",
				yellow: colors.yellow,
			},
			backgroundImage: {
				default: "url('/images/auth-bg.png')",
				"sidebar-bg": "url('/images/sidebar-bg.png')",
				modal: "url('/images/modal-bg.png')",
				"gradient-piece": "url('/images/gradient-piece.png')",
				"hover-gradient":
					"linear-gradient(102deg, #452F28 32.23%, #12130E 139.92%)",
				"mobile-nav": "url('/images/mobile-nav-bg.svg')",
				"gradient-leaderboard":
					"linear-gradient(312deg, #452F28 26.95%, #12130E 70.36%);",
				"mobile-l1":
					"linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(135deg, #FFC462 0%, #A05E03 99.26%)",
				"mobile-l2":
					"linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(31deg, #BBD2C5 2.94%, #536976 83.78%)",
				"mobile-l3":
					"linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(77deg, #055A60 3.45%, #1F3439 97.41%);",
			},
			fontFamily: {
				sans: ["var(--circular-std-font)", ...fontFamily.sans],
				circular: ["CircularStd", "sans-serif"], // Add your custom font
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				overlayShow: {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				contentShow: {
					from: {
						opacity: "0",
						transform: "translate(-50%, -48%) scale(0.96)",
					},
					to: {
						opacity: "1",
						transform: "translate(-50%, -50%) scale(1)",
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
		},
	},
	plugins: [tailwindcssRadix, tailwindcssAnimate],
};
export default config;
