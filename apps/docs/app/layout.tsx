import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { baseURL, createMetadata } from "@/lib/metadata";
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

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			data-scroll-behavior="smooth"
			className={cnJoin(geistSans.variable, geistMono.variable)}
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
		default: "Zayne UI",
		template: "%s | Zayne UI",
	},
});

export const viewport: Viewport = {
	themeColor: [
		{ color: "#0A0A0A", media: "(prefers-color-scheme: dark)" },
		{ color: "#ffffff", media: "(prefers-color-scheme: light)" },
	],
};
