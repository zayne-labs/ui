"use client";

import { Card } from "@zayne-labs/ui-react/ui/card";
import { DragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";
import { ChevronLeft, ChevronRight, MousePointer2 } from "lucide-react";
import { cnJoin } from "@/lib/utils/cn";

const scrollItems = [
	{ category: "Frontend", color: "from-blue-500", title: "React" },
	{ category: "Backend", color: "from-green-500", title: "Node.js" },
	{ category: "Database", color: "from-purple-500", title: "PostgreSQL" },
	{ category: "Styling", color: "from-cyan-500", title: "Tailwind" },
	{ category: "Framework", color: "from-slate-700", title: "Next.js" },
	{ category: "Language", color: "from-indigo-500", title: "TypeScript" },
	{ category: "DevOps", color: "from-orange-500", title: "Docker" },
	{ category: "Version", color: "from-rose-500", title: "Git" },
];

function DragScrollDemo() {
	return (
		<section className="w-full max-w-4xl">
			<DragScroll.Root>
				<DragScroll.Context>
					{({ canGoToNext, canGoToPrev, isDragging }) => (
						<nav className="flex flex-wrap gap-2" aria-label="Scroll status">
							<Indicator active={canGoToPrev} label="Prev" />
							<Indicator
								active={isDragging}
								label="Dragging"
								icon={<MousePointer2 className="size-3" />}
							/>
							<Indicator active={canGoToNext} label="Next" />
						</nav>
					)}
				</DragScroll.Context>

				<div className="relative mt-4">
					<DragScroll.Prev
						className="absolute top-1/2 -left-4 z-20 flex size-10 -translate-y-1/2 cursor-pointer
							items-center justify-center rounded-xl border border-fd-border bg-fd-background/90
							shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95
							disabled:pointer-events-none disabled:opacity-0"
						aria-label="Scroll previous"
					>
						<ChevronLeft className="size-5" />
					</DragScroll.Prev>

					<DragScroll.List
						className="scrollbar-hidden flex items-stretch gap-4 overflow-x-auto scroll-smooth p-4
							data-[dragging=true]:cursor-grabbing"
					>
						{scrollItems.map((item, index) => (
							<DragScroll.Item key={item.title} asChild={true}>
								<Card.Root
									as="article"
									className="group relative flex aspect-3/4 w-48 shrink-0 cursor-grab flex-col
										justify-end overflow-hidden rounded-2xl border border-fd-border p-5
										transition-all duration-500 select-none hover:-translate-y-1 hover:shadow-xl
										active:cursor-grabbing"
								>
									<span
										className={cnJoin(
											`absolute inset-0 bg-linear-to-br to-fd-background opacity-90
											transition-transform duration-700 group-hover:scale-110`,
											item.color
										)}
										aria-hidden="true"
									/>
									<span
										className="absolute inset-0 bg-fd-background/40 opacity-0 transition-opacity
											duration-300 group-hover:opacity-100"
										aria-hidden="true"
									/>

									<Card.Header as="header" className="relative z-10 p-0 text-white">
										<span
											className="block w-fit rounded-full bg-white/20 px-2 py-0.5 text-[9px]
												font-bold tracking-widest uppercase backdrop-blur-md"
										>
											{item.category}
										</span>
										<Card.Title className="mt-1.5 text-lg font-bold tracking-tight">
											{item.title}
										</Card.Title>
										<Card.Description className="mt-0.5 text-[10px] font-medium text-white/70">
											Technical Stack #{index + 1}
										</Card.Description>
									</Card.Header>
								</Card.Root>
							</DragScroll.Item>
						))}
					</DragScroll.List>

					<DragScroll.Next
						className="absolute top-1/2 -right-4 z-20 flex size-10 -translate-y-1/2 cursor-pointer
							items-center justify-center rounded-xl border border-fd-border bg-fd-background/90
							shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95
							disabled:pointer-events-none disabled:opacity-0"
						aria-label="Scroll next"
					>
						<ChevronRight className="size-5" />
					</DragScroll.Next>
				</div>
			</DragScroll.Root>

			<footer className="mt-4 text-center">
				<p className="text-xs font-medium text-fd-muted-foreground">
					Drag to explore or use navigation controls
				</p>
			</footer>
		</section>
	);
}
export default DragScrollDemo;

function Indicator({ active, icon, label }: { active: boolean; icon?: React.ReactNode; label: string }) {
	return (
		<span
			className={cnJoin(
				`flex items-center gap-2 rounded-lg border px-2.5 py-1 text-[9px] font-bold tracking-widest
				uppercase transition-all duration-300`,
				active ?
					"border-fd-primary/20 bg-fd-primary/10 text-fd-primary shadow-sm"
				:	"border-fd-border bg-fd-card text-fd-muted-foreground"
			)}
		>
			<span
				className={cnJoin(
					"size-1.5 rounded-full",
					active ? "animate-pulse bg-fd-primary" : "bg-fd-border"
				)}
				aria-hidden="true"
			/>
			{icon}
			{label}
		</span>
	);
}
