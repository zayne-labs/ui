import { DocsLayout } from "@/components/ai/layout";
import { BgPatternIcon } from "@/components/icons/BgPatternIcon";
import { BreadcrumbStructuredData } from "@/components/seo/breadcrumb-structured-data";
import { getDocsOptions } from "@/lib/layout.shared";

function Layout(props: LayoutProps<"/docs">) {
	const { children } = props;

	return (
		<DocsLayout {...getDocsOptions()}>
			<BreadcrumbStructuredData
				items={[
					{ name: "Home", url: "/" },
					{ name: "Documentation", url: "/docs" },
				]}
			/>
			<span
				className="absolute inset-0 z-[-1] h-256 max-h-screen overflow-hidden
					bg-[radial-gradient(38%_44%_at_65%_-8%,--alpha(var(--color-fd-primary)/0.2)_0%,transparent_73%),radial-gradient(34%_42%_at_17%_11%,--alpha(var(--color-fd-accent-foreground)/0.14)_0%,transparent_72%)]"
			>
				<BgPatternIcon />
			</span>

			{children}
		</DocsLayout>
	);
}

export default Layout;
