import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const url = searchParams.get("url");

	if (!url || typeof url !== "string") {
		return NextResponse.json(
			{ error: "Missing or invalid URL" },
			{ status: 400 }
		);
	}

	try {
		const response = await axios.get(url, {
			headers: { "User-Agent": "Mozilla/5.0" },
		});
		const html = response.data;

		const ogImage = html.match(
			/<meta (?:property|name)="og:image" content="([^"]+)"/
		)?.[1];

		const ogTitle = html.match(
			/<meta (?:property|name)="og:title" content="([^"]+)"/
		)?.[1];

		const ogDescription = html.match(
			/<meta (?:property|name)="og:description" content="([^"]+)"/
		)?.[1];

		return NextResponse.json({
			url,
			title: ogTitle || "",
			description: ogDescription || "",
			image: ogImage || "",
		});
	} catch (error) {
		console.error(`Failed to fetch Open Graph data from ${url}`, error);
		return NextResponse.json(
			{ error: "Failed to fetch data" },
			{ status: 500 }
		);
	}
}
