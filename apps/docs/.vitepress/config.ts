import { defineConfig } from "vitepress";

export default defineConfig({
	description: "Documentation for @zayne-labs/ui",
	srcDir: "src",
	title: "UI",

	// eslint-disable-next-line perfectionist/sort-objects
	themeConfig: {
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
});
