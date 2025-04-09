import { type Options, defineConfig } from "tsup";

const isDevMode = process.env.NODE_ENV === "development";

const sharedOptions = {
	clean: true, // clean up dist folder,
	dts: true, // generate d.ts
	entry: [
		"src/components/ui/card/index.ts",
		"src/components/ui/carousel/index.ts",
		"src/components/ui/drop-zone/index.ts",
		"src/components/ui/drag-scroll/index.ts",
		"src/components/ui/form/index.ts",

		"src/components/common/await/index.ts",
		"src/components/common/error-boundary/index.ts",
		"src/components/common/focus-scope/index.ts",
		"src/components/common/for/index.ts",
		"src/components/common/show/index.ts",
		"src/components/common/slot/index.ts",
		"src/components/common/suspense-with-boundary/index.ts",
		"src/components/common/switch/index.ts",
		"src/components/common/teleport/index.ts",
	],
	format: ["esm"],
	platform: "browser",
	sourcemap: !isDevMode,
	splitting: true,
	target: "esnext",
	treeshake: true,
	tsconfig: "tsconfig.json",
} satisfies Options;

const config = defineConfig([
	{
		...sharedOptions,
		name: "ESM",
		outDir: "./dist/esm",
	},
]);

export default config;
