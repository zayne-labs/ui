import { zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		ignores: ["packages/**/dist/**", "eslint.config.js"],
		type: "lib",
		react: true,
		tailwindcssBetter: {
			settings: {
				entryPoint: "packages/ui-react/tailwind.css",
			},
		},
		typescript: {
			tsconfigPath: ["**/tsconfig.json"],
		},
	},
	{
		files: ["apps/docs/**/*"],
		rules: {
			"eslint-comments/require-description": "off",
		},
	}
);
