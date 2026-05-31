import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { MessageCircleIcon } from "lucide-react";
import { AISearchPanel, AISearchRoot, AISearchTrigger } from "@/components/ai/search";
import { BgPatternIcon } from "@/components/icons/BgPatternIcon";
import { Button } from "@/components/ui/button";
import { getDocsOptions } from "@/lib/layout.shared";

function Layout(props: LayoutProps<"/docs">) {
	const { children } = props;

	return (
		<DocsLayout {...getDocsOptions()}>
			<span
				className="absolute inset-0 z-[-1] h-256 max-h-screen overflow-hidden
					bg-[radial-gradient(38%_44%_at_65%_-8%,--alpha(var(--color-fd-primary)/0.2)_0%,transparent_73%),radial-gradient(34%_42%_at_17%_11%,--alpha(var(--color-fd-accent-foreground)/0.14)_0%,transparent_72%)]"
			>
				<BgPatternIcon />
			</span>

			{children}

			<AISearchRoot>
				<AISearchPanel />
				<AISearchTrigger position="float" asChild={true}>
					<Button className="rounded-2xl text-fd-muted-foreground" theme="secondary">
						<MessageCircleIcon className="size-4.5" />
						Ask AI
					</Button>
				</AISearchTrigger>
			</AISearchRoot>
		</DocsLayout>
	);
}

export default Layout;
