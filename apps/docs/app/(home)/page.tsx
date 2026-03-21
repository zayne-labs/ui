import Link from "fumadocs-core/link";
import { DocsIcon, GitHubIcon } from "@/components/icons";
import { GridPattern } from "@/components/landing/grid";
import { Button } from "@/components/ui/button";

export default function HomePage() {
	return (
		<main
			className="relative flex min-h-screen w-full items-center justify-center overflow-hidden
				bg-fd-background"
		>
			<GridPattern />
			<div className="z-10 flex flex-col items-center justify-center px-6">
				<h1 className="mb-6 text-center text-6xl font-bold tracking-tight md:text-7xl">Zayne UI</h1>

				<p className="mb-8 max-w-2xl text-center text-lg text-fd-muted-foreground md:text-xl">
					Composable, headless UI components and utilities built for flexibility and great developer
					experience.
				</p>

				<div className="flex w-full items-center justify-center gap-4">
					<Button className="flex gap-2" size="home-default" asChild={true}>
						<Link href="/docs">
							<DocsIcon />
							Docs
						</Link>
					</Button>

					<Button className="flex gap-2" theme="secondary" size="home-default" asChild={true}>
						<Link href="https://github.com/zayne-labs/ui">
							<GitHubIcon />
							GitHub
						</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
