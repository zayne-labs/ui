import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	ignores: ["eslint.config.js"],
	type: "app",
	react: true,
	tailwindcssBetter: true,
	typescript: {
		tsconfigPath: ["**/tsconfig.json"],
	},
});
