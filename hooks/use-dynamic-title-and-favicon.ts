import { useEffect } from "react";

type FaviconOptions = {
	favicon: string; // Path to the default favicon
	description: string; // Path to dynamic favicon if any
};

export const useDynamicTitleAndFavicon = (
	title: string,
	{ favicon, description }: FaviconOptions
) => {
	useEffect(() => {
		// Set the document title dynamically
		document.title = title;

		// Function to update favicon
		const updateFavicon = (faviconURL: string) => {
			let link = document.querySelector(
				"link[rel~='icon']"
			) as HTMLLinkElement;
			if (!link) {
				link = document.createElement("link");
				link.rel = "icon";
				document.getElementsByTagName("head")[0]?.appendChild(link);
			}
			link.href = faviconURL;
		};

		// Set the dynamic favicon if provided, otherwise set the default favicon

		updateFavicon(favicon);

		// Function to update the meta description
		const updateMetaDescription = (description: string) => {
			let meta = document.querySelector(
				"meta[name='description']"
			) as HTMLMetaElement;
			if (!meta) {
				meta = document.createElement("meta");
				meta.name = "description";
				document.getElementsByTagName("head")[0]?.appendChild(meta);
			}
			meta.content = description;
		};

		// Set the dynamic description if provided, otherwise set the default description
		updateMetaDescription(description);

		// Optional cleanup if needed
		return () => {
			// Revert to the default favicon when unmounted
			updateFavicon(favicon);
			updateMetaDescription(description);
		};
	}, [title, description, favicon]); // Re-run effect if title or favicon changes
};
