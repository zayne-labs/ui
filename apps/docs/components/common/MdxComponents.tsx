import * as Accordion from "fumadocs-ui/components/accordion";
import * as Steps from "fumadocs-ui/components/steps";
import * as Tabs from "fumadocs-ui/components/tabs";
import * as TypeTable from "fumadocs-ui/components/type-table";
import defaultComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export const getMDXComponents = (extraComponents?: MDXComponents) => {
	return {
		...defaultComponents,
		...Accordion,
		...Steps,
		...Tabs,
		...TypeTable,
		...extraComponents,
	} satisfies MDXComponents;
};

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
