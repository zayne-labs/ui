import type { Metadata } from "next";

const VERCEL_PROJECT_PRODUCTION_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL;

const withHttps = (url: string | undefined) => {
	if (!url) return;

	if (!url.startsWith("https")) {
		return `https://${url}`;
	}

	return url;
};

const SELECTED_PRODUCTION_URL = withHttps(VERCEL_PROJECT_PRODUCTION_URL);

export const baseURL =
	process.env.NODE_ENV === "development" || !SELECTED_PRODUCTION_URL ?
		"http://localhost:3000"
	:	SELECTED_PRODUCTION_URL;

const bannerImage = "/banner.png";

const defaultKeywords = [
	"ui",
	"react",
	"headless ui",
	"composable",
	"components",
	"zayne-labs",
	"tailwind",
	"typescript",
];

export const defaultSiteName = "Zayne UI";

export const defaultDescription =
	"Composable, headless UI components and utilities built for flexibility and great developer experience.";

export function createMetadata(overrides?: Metadata): Metadata {
	return {
		...overrides,

		alternates: {
			canonical: overrides?.alternates?.canonical ?? baseURL,
			...overrides?.alternates,
		},

		applicationName: overrides?.applicationName ?? defaultSiteName,

		description: overrides?.description ?? defaultDescription,

		generator: "Next.js",

		keywords: overrides?.keywords ?? defaultKeywords,

		openGraph: {
			description: overrides?.description ?? defaultDescription,
			images: bannerImage,
			siteName: defaultSiteName,
			title: overrides?.title ?? undefined,
			type: "website",
			url: baseURL,

			...overrides?.openGraph,
		},

		robots: {
			follow: true,
			index: true,
		},

		twitter: {
			card: "summary_large_image",
			creator: "@zayne_el_kaiser",
			description: overrides?.description ?? defaultDescription,
			images: bannerImage,
			title: overrides?.title ?? undefined,

			...overrides?.twitter,
		},
	};
}
