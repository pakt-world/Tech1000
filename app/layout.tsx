/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React from "react";
import "./styles.css";
import "pakt-ui/styles.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Providers } from "@/app/providers";
import { kodeMono } from "@/fonts/fonts";

interface Props {
	children: React.ReactNode;
}

export default function RootLayout({ children }: Props): React.JSX.Element {
	return (
		<html lang="en" suppressHydrationWarning className="!scroll-smooth">
			<Script
				type="module"
				src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/zoomies.js"
				defer
				rel="preload"
				crossOrigin="anonymous"
				strategy="lazyOnload"
			/>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, height=device-height, maximum-scale=1, user-scalable=no, interactive-widget=overlays-content, min-scale=0.9, max-scale=1.0, viewport-fit=cover, shrink-to-fit=no"
				/>
			</head>

			<body
				className={`${kodeMono.className} m-0 h-screen overflow-scroll p-0 font-sans antialiased`}
			>
				<Toaster position="top-right" gutter={8} />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
