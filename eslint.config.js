import { zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		ignores: ["packages/**/dist/**"],
		react: true,
		tailwindcssBetter: {
			settings: { entryPoint: "packages/ui-react/tailwind.css" },
		},
		type: "lib",
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
