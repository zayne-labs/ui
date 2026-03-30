import path from "node:path";
import { GLOB_MARKDOWN_CODE, zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		type: "lib",
		ignores: ["eslint.config.js", "apps/docs/.source/**/*"],
		react: {
			nextjs: true,
		},
		typescript: {
			tsconfigPath: ["tsconfig.json", "packages/*/tsconfig.json", "apps/*/tsconfig.json"],
			// tsconfigPath: ["**/tsconfig.json"],
		},
		tailwindcssBetter: {
			settings: { entryPoint: "apps/docs/tailwind.css" },
		},
	},
	{
		files: [`apps/docs/content/docs/${GLOB_MARKDOWN_CODE}`, `apps/docs-old/src/${GLOB_MARKDOWN_CODE}`],
		rules: {
			"eslint-comments/disable-enable-pair": "off",
			"no-param-reassign": "off",
			"no-await-in-loop": "off",
			"react-hooks/hooks": "off",
			"react-hooks/rules-of-hooks": "off",
		},
	},
	{
		files: ["apps/**/*"],
		rules: {
			"eslint-comments/require-description": "off",
		},
	}
).overrides({
	"zayne/react/nextjs/recommended": (config) => ({
		...config,
		ignores: ["apps/docs/content/docs/**/*"],
		files: ["apps/docs/**/*.{ts,tsx}"],
	}),
	"zayne/react/nextjs/rules": (config) => ({
		...config,
		ignores: ["apps/docs/content/docs/**/*"],
		files: ["apps/docs/**/*.{ts,tsx}"],
	}),
	"zayne/react/refresh/rules": (config) => ({
		...config,
		ignores: ["apps/docs/content/docs/**/*"],
		files: ["apps/docs/**/*.{ts,tsx}"],
	}),
});
