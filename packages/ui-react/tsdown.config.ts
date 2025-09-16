import { defineConfig, type Options } from "tsdown";

const isDevMode = process.env.NODE_ENV === "development";

const sharedOptions = {
	clean: !isDevMode, // clean up dist folder,
	dts: { newContext: true },
	entry: [
		// UI components
		"src/components/ui/card/index.ts",
		"src/components/ui/carousel/index.ts",
		"src/components/ui/drag-scroll/index.ts",
		"src/components/ui/drop-zone/index.ts",
		"src/components/ui/form/index.ts",

		// Utility components
		"src/components/common/await/index.ts",
		"src/components/common/client-gate/index.ts",
		"src/components/common/error-boundary/index.ts",
		"src/components/common/for/index.ts",
		"src/components/common/presence/index.ts",
		"src/components/common/show/index.ts",
		"src/components/common/slot/index.ts",
		"src/components/common/suspense-with-boundary/index.ts",
		"src/components/common/switch/index.ts",
		"src/components/common/teleport/index.ts",
	],
	format: ["esm"],
	platform: "browser",
	sourcemap: !isDevMode,
	target: "esnext",
	treeshake: true,
	tsconfig: "tsconfig.tsdown.json",
} satisfies Options;

const config = defineConfig([
	{
		...sharedOptions,
		name: "ESM",
		outDir: "./dist/esm",
	},
]);

export default config;
