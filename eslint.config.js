import { GLOB_MARKDOWN_CODE, zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		react: true,
		tailwindcssBetter: {
			enforceCanonicalClasses: true,
			settings: { entryPoint: "apps/dev/tailwind.css" },
		},
		type: "lib",
		typescript: {
			tsconfigPath: ["**/tsconfig.json"],
		},
	},
	{
		files: [`apps/docs/src/${GLOB_MARKDOWN_CODE}`],
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
	},
	{
		files: ["packages/ui-react/src/components/**/*"],
		rules: {
			"react-refresh/only-export-components": "off",
		},
	}
);
