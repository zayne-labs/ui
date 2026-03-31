import * as Accordion from "fumadocs-ui/components/accordion";
import * as Steps from "fumadocs-ui/components/steps";
import * as Tabs from "fumadocs-ui/components/tabs";
import * as TypeTable from "fumadocs-ui/components/type-table";
import defaultComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentSource } from "@/components/preview/component-source";
import { ComponentTabs } from "@/components/preview/component-tabs";

export const getMDXComponents = (extraComponents?: MDXComponents): MDXComponents => {
	return {
		...defaultComponents,
		...Accordion,
		...Steps,
		...Tabs,
		...TypeTable,
		ComponentSource,
		ComponentTabs,
		...extraComponents,
	};
};

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
