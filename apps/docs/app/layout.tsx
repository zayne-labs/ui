import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { baseURL, createMetadata, defaultSiteName } from "@/lib/metadata";
import { cnJoin } from "@/lib/utils/cn";
import { Providers } from "./Providers";
import "../tailwind.css";

const geistSans = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

const jetBrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
});

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			data-scroll-behavior="smooth"
			className={cnJoin(geistSans.variable, geistMono.variable, jetBrainsMono.variable)}
			suppressHydrationWarning={true}
		>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

export default RootLayout;

export const metadata: Metadata = createMetadata({
	metadataBase: new URL(baseURL),
	title: {
		default: defaultSiteName,
		template: `%s | ${defaultSiteName}`,
	},
});

export const viewport: Viewport = {
	colorScheme: "dark light",
	themeColor: [
		{ color: "#0A0A0A", media: "(prefers-color-scheme: dark)" },
		{ color: "#ffffff", media: "(prefers-color-scheme: light)" },
	],
};
