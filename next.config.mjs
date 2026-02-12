/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		swcPlugins: [["swc-plugin-coverage-instrument", {}]],
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.externals.push({
				bufferutil: "bufferutil",
				"utf-8-validate": "utf-8-validate",
			});
		}
		return config;
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "http",
				hostname: "*.amazonaws.com",
				port: "",
			},
		],
	},
	async headers() {
		return [
			{
				// Apply these headers to all routes in your application.
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "Content-Security-Policy",
						value: "frame-ancestors 'none'",
					},
					{
						key: "X-Powered-By",
						value: "N/A",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		];
	},
};

export default nextConfig;
