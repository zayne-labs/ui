import { GLOB_MARKDOWN_CODE, zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		react: {
			nextjs: {
				overrides: { "nextjs/no-html-link-for-pages": ["error", "apps/docs"] },
			},
		},
		tailwindcssBetter: {
			settings: { entryPoint: "apps/docs/tailwind.css" },
		},
		type: "lib",
		typescript: {
			tsconfigPath: ["tsconfig.json", "packages/*/tsconfig.json", "apps/*/tsconfig.json"],
			// tsconfigPath: ["**/tsconfig.json"],
		},
	},
	{
		files: [`apps/docs/content/docs/${GLOB_MARKDOWN_CODE}`],
		rules: {
			"no-await-in-loop": "off",
			"react-hooks/hooks": "off",
			"react-hooks/rules-of-hooks": "off",
		},
	},
	{
		files: ["apps/docs/**/*"],
		rules: {
			"eslint-comments/require-description": "off",
		},
	},
	{
		files: ["packages/ui-react/src/components/**/*"],
		rules: {
			"react-refresh/only-export-components": "off",
		},
	}
);
