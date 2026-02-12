export const ENVS = {
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
	NEXT_PUBLIC_AUTH_TOKEN_KEY: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY,
	NEXT_PUBLIC_APP_BASE_URL: "https://tech1000.chain.site",
	NEXT_PUBLIC_SNOWTRACE_APP_URL: "https://snowtrace.io",
	NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
	NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
	NEXT_PUBLIC_API_ID: process.env.NEXT_PUBLIC_API_ID,
	isProduction:
		String(process.env.NEXT_PUBLIC_NODE_ENV).includes("prod") || false,
};
