import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	ignores: ["dist/**"],
	type: "lib-strict",
	typescript: {
		tsconfigPath: ["**/tsconfig.json"],
	},
});
