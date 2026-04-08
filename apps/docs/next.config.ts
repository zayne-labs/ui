import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const config: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},

	logging: {
		fetches: {
			fullUrl: true,
		},
	},

	reactStrictMode: true,

	rewrites: () => {
		return [
			{
				destination: "/llms.mdx/docs/:path*",
				source: "/docs/:path*.mdx",
			},
		];
	},

	serverExternalPackages: ["typescript", "shiki", "@takumi-rs/image-response"],

	typescript: {
		ignoreBuildErrors: true,
	},
};

export default withMDX(config);
