"use client";

import { Card } from "@zayne-labs/ui-react/ui/card";
import { DragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";
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
		<div className="w-full max-w-4xl">
			<DragScroll.Root>
				<DragScroll.Context>
					{({ canGoToNext, canGoToPrev, isDragging }) => (
						<div className="mb-4 flex flex-wrap gap-2">
							<Indicator active={canGoToPrev} label="Prev" />
							<Indicator active={isDragging} label="Dragging" />
							<Indicator active={canGoToNext} label="Next" />
						</div>
					)}
				</DragScroll.Context>

				<DragScroll.Prev
					className="absolute top-1/2 -left-4 z-20 flex size-10 -translate-y-1/2 cursor-pointer
						items-center justify-center rounded-xl border border-fd-border bg-fd-background/90
						shadow-lg backdrop-blur-md transition-all hover:scale-110 active:scale-95
						disabled:pointer-events-none disabled:opacity-0"
				>
					<svg
						className="size-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</DragScroll.Prev>

				<DragScroll.List
					className="scrollbar-hidden flex items-stretch gap-4 overflow-x-auto scroll-smooth p-4
						data-[dragging=true]:cursor-grabbing"
				>
					{scrollItems.map((item, index) => (
						<DragScroll.Item key={item.title} asChild={true}>
							<Card.Root
								as="li"
								className="group relative flex aspect-3/4 w-48 shrink-0 cursor-grab flex-col
									justify-end overflow-hidden rounded-2xl border border-fd-border p-5
									transition-all duration-500 select-none hover:-translate-y-1 hover:shadow-xl
									active:cursor-grabbing"
							>
								<div
									className={cnJoin(
										`absolute inset-0 bg-linear-to-br to-fd-background opacity-90
										transition-transform duration-700 group-hover:scale-110`,
										item.color
									)}
								/>
								<div
									className="absolute inset-0 bg-fd-background/40 opacity-0 transition-opacity
										duration-300 group-hover:opacity-100"
								/>

								<Card.Header className="relative z-10 p-0 text-white">
									<div
										className="mb-1.5 w-fit rounded-full bg-white/20 px-2 py-0.5 text-[9px]
											font-bold tracking-widest uppercase backdrop-blur-md"
									>
										{item.category}
									</div>
									<Card.Title className="text-lg font-bold tracking-tight">
										{item.title}
									</Card.Title>
									<Card.Description className="mt-0.5 text-[10px] font-medium text-white/70">
										Item #{index + 1}
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
				>
					<svg
						className="size-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</DragScroll.Next>
			</DragScroll.Root>

			<p className="mt-4 text-center text-xs text-fd-muted-foreground">
				Drag to scroll or use navigation buttons
			</p>
		</div>
	);
}

function Indicator({ active, label }: { active: boolean; label: string }) {
	return (
		<div
			className={cnJoin(
				`flex items-center gap-2 rounded-lg border px-2.5 py-1 text-[9px] font-bold tracking-widest
				uppercase transition-all duration-300`,
				active ?
					"border-fd-primary/20 bg-fd-primary/10 text-fd-primary shadow-sm"
				:	"border-fd-border bg-fd-card text-fd-muted-foreground"
			)}
		>
			<div className={cnJoin("size-1.5 rounded-full", active ? "bg-fd-primary" : "bg-fd-border")} />
			{label}
		</div>
	);
}

export default DragScrollDemo;
