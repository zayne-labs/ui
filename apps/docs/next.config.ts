import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},

	experimental: {
		typedEnv: true,
	},

	logging: {
		fetches: {
			fullUrl: true,
		},
	},

	reactStrictMode: true,

	serverExternalPackages: ["typescript", "shiki", "@takumi-rs/core"],

	typedRoutes: true,
};

export default withMDX(config);
