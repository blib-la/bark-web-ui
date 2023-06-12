const process = require("node:process");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: process.env.API_PORT,
			},
		],
	},
};

module.exports = nextConfig;
