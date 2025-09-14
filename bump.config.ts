import { defineConfig } from "bumpp";

export default defineConfig({
	all: true,
	commit: "chore(bumpp): update package version to v",
	files: ["./packages/**/package.json"],
});
