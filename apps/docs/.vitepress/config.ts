import { defineConfig } from "vitepress";

export default defineConfig({
	description: "Documentation for @zayne-labs/ui",
	head: [
		["meta", { content: "#aa99ff", name: "theme-color" }],
		["meta", { content: "website", name: "og:type" }],
		["meta", { content: "@zayne-labs/ui", name: "og:title" }],
		[
			"meta",
			{
				content:
					"A collection of unstyled UI and utility components, inspired by the composable patterns of Radix UI and Shadcn",
				name: "og:description",
			},
		],
		["meta", { content: "/logo.svg", name: "og:image" }],
		["meta", { content: "summary", name: "twitter:card" }],
		["meta", { content: "@zayne-labs/ui", name: "twitter:title" }],
		[
			"meta",
			{
				content:
					"A collection of unstyled UI and utility components, inspired by the composable patterns of Radix UI and Shadcn",
				name: "twitter:description",
			},
		],
		["meta", { content: "/logo.svg", name: "twitter:image" }],
		["link", { href: "/logo.svg", rel: "icon", type: "image/svg+xml" }],
	],

	ignoreDeadLinks: true,

	srcDir: "src",

	themeConfig: {
		logo: { height: 24, src: "/logo.svg", width: 24 },

		nav: [
			{ link: "/", text: "Home" },
			{ link: "/ui", text: "UI Components" },
			{ link: "/utility", text: "Utility Components" },
		],

		sidebar: [
			{
				items: [
					{ link: "/guide/introduction", text: "Introduction" },
					{ link: "/guide/getting-started", text: "Getting Started" },
				],
				text: "Guide",
			},
			{
				items: [
					{ link: "/ui", text: "Overview" },
					{ link: "/ui/card", text: "Card" },
					{ link: "/ui/carousel", text: "Carousel" },
					{ link: "/ui/drag-scroll", text: "DragScroll" },
					{ link: "/ui/drop-zone", text: "DropZone" },
					{ link: "/ui/form", text: "Form" },
				],
				text: "UI Components",
			},
			{
				items: [
					{ link: "/utility", text: "Overview" },
					{ link: "/utility/await", text: "Await" },
					{ link: "/utility/error-boundary", text: "ErrorBoundary" },
					{ link: "/utility/for", text: "For" },
					{ link: "/utility/show", text: "Show" },
					{ link: "/utility/slot", text: "Slot" },
					{ link: "/utility/suspense-with-boundary", text: "SuspenseWithBoundary" },
					{ link: "/utility/switch", text: "Switch" },
					{ link: "/utility/teleport", text: "Teleport" },
				],
				text: "Utility Components",
			},
		],

		socialLinks: [{ icon: "github", link: "https://github.com/Ryan-Zayne/Z-COMMERCE--FULLSTACK" }],
	},

	title: " ",
});
