import { Tabs, TabsContent, TabsList, TabsTrigger } from "fumadocs-ui/components/tabs";
import { ComponentPreview, type ComponentPreviewProps } from "./component-preview";
import { ComponentSource } from "./component-source";

type ComponentTabsProps = ComponentPreviewProps;

export function ComponentTabs(props: ComponentTabsProps) {
	const { name, ...restOfProps } = props;

	return (
		<Tabs defaultValue="preview" className="mt-6 overflow-hidden rounded-xl border">
			<TabsList className="flex items-center border-b bg-fd-secondary/50 px-3 py-1.5">
				<TabsTrigger
					value="preview"
					className="rounded-lg px-2 data-[state=active]:bg-fd-background
						data-[state=active]:text-fd-foreground data-[state=active]:shadow-sm"
				>
					Preview
				</TabsTrigger>

				<TabsTrigger
					value="code"
					className="rounded-lg px-2 data-[state=active]:bg-fd-background
						data-[state=active]:text-fd-foreground data-[state=active]:shadow-sm"
				>
					Code
				</TabsTrigger>
			</TabsList>

			<TabsContent className="p-0" value="preview" asChild={true}>
				<ComponentPreview name={name} {...restOfProps} />
			</TabsContent>

			<TabsContent className="contents" value="code">
				<ComponentSource isCollapsible={false} name={name} />
			</TabsContent>
		</Tabs>
	);
}
