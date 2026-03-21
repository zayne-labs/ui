import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { applyMdxPreset, defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import type { RemarkAutoTypeTableOptions } from "fumadocs-typescript";
import type { ElementContent } from "hast";
import type { ShikiTransformer } from "shiki";

export const docs = defineDocs({
	dir: "content/docs",

	docs: {
		async: true,

		mdxOptions: async (options) => {
			const [
				{ rehypeCodeDefaultOptions },
				{ createFileSystemGeneratorCache, createGenerator, remarkAutoTypeTable },
			] = await Promise.all([
				import("fumadocs-core/mdx-plugins/rehype-code"),
				import("fumadocs-typescript"),
			]);

			const typeTableOptions: RemarkAutoTypeTableOptions = {
				generator: createGenerator({
					cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
				}),
				shiki: {
					themes: {
						dark: "material-theme-darker",
						light: "material-theme-lighter",
					},
				},
			};

			return applyMdxPreset({
				rehypeCodeOptions: {
					inline: "tailing-curly-colon",
					langs: ["ts", "js", "html", "tsx", "mdx", "bash"],
					themes: {
						dark: "material-theme-darker",
						light: "material-theme-lighter",
					},

					transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), transformerEscape()],
				},

				remarkCodeTabOptions: {
					parseMdx: true,
				},

				remarkNpmOptions: {
					persist: {
						id: "package-manager",
					},
				},

				remarkPlugins: [[remarkAutoTypeTable, typeTableOptions]],
			})(options);
		},

		postprocess: {
			extractLinkReferences: true,
			includeProcessedMarkdown: true,
		},

		schema: pageSchema,
	},

	meta: {
		schema: metaSchema,
	},
});

const transformerEscape = (): ShikiTransformer => {
	const replace = (node: ElementContent) => {
		if (node.type === "text") {
			// eslint-disable-next-line no-param-reassign
			node.value = node.value.replace(String.raw`[\!code`, "[!code");
		} else if ("children" in node) {
			for (const child of node.children) {
				replace(child);
			}
		}
	};

	return {
		name: "@shikijs/transformers:remove-notation-escape",

		// eslint-disable-next-line perfectionist/sort-objects
		code: (hast) => {
			replace(hast);
			return hast;
		},
	};
};

export default defineConfig({
	plugins: [lastModified()],
});
