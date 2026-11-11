import { zayne } from "@zayne-labs/knip-config";

export default zayne({
	extend: {
		workspaces: {
			"apps/dev": {
				// == Kept empty on purpose as a scratch file
				ignoreFiles: ["src/test.ts"],
			},

			"apps/docs": {
				// == Read by `<auto-type-table path="../../../lib/ui-options.ts" />` in the MDX docs, not imported
				entry: ["lib/ui-options.ts"],

				// == Fumadocs asks for it alongside the `fumadocs-ui` -> `@fumadocs/base-ui` alias
				ignoreDependencies: ["@base-ui/react"],

				// == `fumadocs-mdx/macro` reads the exported `docs` collection
				ignoreIssues: {
					"lib/source/index.ts": ["exports"],
				},

				// == Knip's default project files (plus the .mdx/.css its compilers read), minus the Next.js build output.
				// == A trailing `!` limits a pattern to production mode, so the `.next` negation has none to apply in both modes
				project: [
					"**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,mdx,css}!",
					"!.next/**",
					// == Dev-only scripts (e.g. `build:examples`), left out of production mode
					"!scripts/**!",
				],
			},

			"packages/ui-react": {
				// == Not imported or built; kept for Tailwind tooling inside the package
				ignoreFiles: ["tailwind.css"],
			},
		},
	},
});
