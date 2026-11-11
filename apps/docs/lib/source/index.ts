import { loader, type InferPageType } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import type { RemarkAutoTypeTableOptions } from "fumadocs-typescript";
import { shikiOptions } from "../shiki";

export const docs = defineDocs({
	dir: "content/docs",

	docs: {
		async: true,
		compiler: "satteri",

		lastModified: true,

		postprocess: {
			extractLinkReferences: true,
			includeProcessedMarkdown: true,
		},

		satteriOptions: async () => {
			const [
				{ rehypeCodeDefaultOptions },
				{ createFileSystemGeneratorCache, createGenerator },
				{ createShikiHighlighter },
				{ defaultShikiFactory },
				{ remarkAutoTypeTable },
			] = await Promise.all([
				import("fumadocs-core/mdx-plugins/rehype-code"),
				import("fumadocs-typescript"),
				import("fumadocs-core/highlight/shiki"),
				import("fumadocs-core/highlight/shiki/full"),
				import("@fumadocs/satteri/remark-auto-type-table"),
			]);

			const typeTableGenerator = createGenerator({
				cache: createFileSystemGeneratorCache(".next/cache/fumadocs-typescript"),
			});

			const typeTableOptions: RemarkAutoTypeTableOptions = {
				generator: typeTableGenerator,
				highlighter: createShikiHighlighter(() => defaultShikiFactory.getOrInit(), {
					themes: shikiOptions.themes,
				}),
			};

			return {
				mdastPlugins: (plugins) => [remarkAutoTypeTable(typeTableOptions), ...plugins],

				rehypeCodeOptions: {
					inline: "tailing-curly-colon",
					langs: ["ts", "js", "html", "tsx", "mdx", "bash", "css"],
					themes: shikiOptions.themes,

					transformers: [...(rehypeCodeDefaultOptions.transformers ?? [])],
				},

				remarkCodeTabOptions: {
					parseMdx: true,
				},

				remarkNpmOptions: {
					persist: {
						id: "package-manager",
					},
				},
			};
		},

		schema: pageSchema,
	},

	meta: {
		schema: metaSchema,
	},
});

export const source = loader({
	baseUrl: "/docs",
	plugins: [lucideIconsPlugin()],
	source: docs.toFumadocsSource(),
});

export type Page = InferPageType<typeof source>;
