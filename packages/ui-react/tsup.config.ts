import { type Options, defineConfig } from "tsup";

const isDevMode = process.env.NODE_ENV === "development";

const sharedOptions = {
	clean: true, // clean up dist folder,
	dts: true, // generate d.ts
	entry: [
		"src/components/index.ts",
		"src/components/ui/drop-zone/index.ts",
		"src/components/ui//drag-scroll/index.ts",
		"src/components/ui//carousel/index.ts",
		"src/components/ui/form/index.ts",

		"src/components/common/For/index.ts",
		"src/components/common/Teleport/index.ts",
		"src/components/common/Show/index.ts",
		"src/components/common/Switch/index.ts",
		"src/components/common/Slot/index.ts",
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
