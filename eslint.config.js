import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	ignores: ["dist/**"],
	react: true,
	type: "lib",
	typescript: {
		tsconfigPath: ["**/tsconfig.json"],
	},
});
