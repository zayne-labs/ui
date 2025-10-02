import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	react: true,
	tailwindcssBetter: true,
	type: "app",
	typescript: {
		tsconfigPath: ["**/tsconfig.json"],
	},
});
