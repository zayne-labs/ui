import { defineConfig, type UserConfig } from "tsdown";

const isDevMode = process.env.NODE_ENV === "development";

const sharedOptions = {
	clean: true, // clean up dist folder,
	dts: true,
	entry: ["src/components/ui/*/index.ts", "src/components/common/*/index.ts"],
	format: ["esm"],
	ignoreWatch: [".turbo"],
	platform: "neutral",
	sourcemap: !isDevMode,
	target: "esnext",
	treeshake: true,
	tsconfig: "tsconfig.tsdown.json",
} satisfies UserConfig;

const config = defineConfig([
	{
		...sharedOptions,
		name: "ESM",
		outDir: "./dist/esm",
	},
]);

export default config;
