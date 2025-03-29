export default {
	"*.{js,ts,jsx,tsx}": () => "pnpm lint:eslint",
	"*.{ts,tsx}": () => "pnpm lint:type-check",
	"package.json": () => "pnpm lint:publint",
	"packages/**/*.{js,ts,jsx,tsx}": () => "pnpm lint:size",
};
