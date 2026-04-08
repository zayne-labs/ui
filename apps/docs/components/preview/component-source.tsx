import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { getExampleItem, readFileFromRoot } from "@/lib/registry";
import { shikiOptions } from "@/lib/shiki";
import { CodeCollapsibleWrapper } from "./code-collapsible-wrapper";

type ComponentSourceProps = InferProps<"div"> & {
	isCollapsible?: boolean;
	maxLines?: number;
	name?: string;
	src?: string;
};

export async function ComponentSource(props: ComponentSourceProps) {
	const { className, isCollapsible = true, maxLines, name, src } = props;

	const code = await getSourceCode(src, name, maxLines);

	if (!code) {
		return null;
	}

	const codeBlock = (
		<DynamicCodeBlock
			code={code}
			lang="tsx"
			options={{
				themes: shikiOptions.themes,
			}}
		/>
	);

	if (isCollapsible) {
		return <CodeCollapsibleWrapper className={className}>{codeBlock}</CodeCollapsibleWrapper>;
	}

	return <div className={className}>{codeBlock}</div>;
}

const getSourceCode = async (src: string | undefined, name: string | undefined, maxLines?: number) => {
	let code: string | undefined;

	switch (true) {
		case src != null: {
			code = await readFileFromRoot(src);
			break;
		}
		case name != null: {
			const exampleItem = await getExampleItem(name);

			code = exampleItem?.files[0]?.content;
			break;
		}
		default: {
			break;
		}
	}

	if (!code) return;

	return maxLines ? code.split("\n").slice(0, maxLines).join("\n") : code;
};
