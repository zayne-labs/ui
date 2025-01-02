import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	ignores: ["dist/**"],
	react: true,
	tailwindcss: {
		settings: {
			config: "./tailwind.config.ts",
		},
	},
	type: "lib",
	typescript: {
		tsconfigPath: ["**/tsconfig.json"],
	},
});
