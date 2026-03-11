import { GLOB_MARKDOWN_CODE, zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		type: "lib",
		ignores: ["eslint.config.js", "apps/docs/.source/**"],
		react: {
			nextjs: {
				overrides: { "nextjs/no-html-link-for-pages": ["error", "apps/docs"] },
			},
		},
		tailwindcssBetter: {
			settings: { entryPoint: "apps/docs/tailwind.css" },
		},
		typescript: {
			tsconfigPath: ["tsconfig.json", "packages/*/tsconfig.json", "apps/*/tsconfig.json"],
			// tsconfigPath: ["**/tsconfig.json"],
		},
	},
	{
		files: [`apps/docs/content/docs/${GLOB_MARKDOWN_CODE}`, `apps/docs-old/src/${GLOB_MARKDOWN_CODE}`],
		rules: {
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
		files: ["apps/docs/**/*.{ts,tsx}"],
	}),
	"zayne/react/nextjs/rules": (config) => ({
		...config,
		files: ["apps/docs/**/*.{ts,tsx}"],
	}),
	"zayne/react/refresh/rules": (config) => ({
		...config,
		files: ["apps/docs/**/*.{ts,tsx}"],
	}),
});
