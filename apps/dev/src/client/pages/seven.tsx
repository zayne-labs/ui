import { Icon } from "@iconify/react";
import { For, ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { Card } from "@zayne-labs/ui-react/ui/card";
import { DragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";
import { cnJoin } from "../../lib/utils/cn";

const items = [
	{ category: "Abstract", color: "from-indigo-500", title: "Midnight Flow" },
	{ category: "Nature", color: "from-emerald-500", title: "Forest Deep" },
	{ category: "Architecture", color: "from-amber-500", title: "Glass & Steel" },
	{ category: "Minimal", color: "from-rose-500", title: "Soft Tones" },
	{ category: "Tech", color: "from-cyan-500", title: "Data Streams" },
	{ category: "Art", color: "from-violet-500", title: "Paint Over" },
	{ category: "Space", color: "from-slate-700", title: "Outer Void" },
	{ category: "Urban", color: "from-orange-500", title: "City Lights" },
];

function PageSeven() {
	return (
		<div className="flex flex-col gap-12 text-slate-900">
			<header className="flex flex-col gap-5">
				<p
					className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3
						py-1 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase shadow-xs"
				>
					Interaction Engine v1.0
				</p>
				<div className="flex flex-col gap-2">
					<h1 className="text-4xl font-black tracking-tighter">Drag Scroll Canvas</h1>
					<p className="max-w-xl text-lg font-medium text-slate-500">
						A high-performance primitive for touch and mouse-based horizontal navigation with native
						inertia and snap alignment.
					</p>
				</div>
			</header>

			<section
				className="overflow-hidden rounded-4xl border border-slate-200 bg-white p-10 shadow-2xl
					shadow-slate-200/50"
			>
				<DragScroll.Root>
					<header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
						<div className="flex flex-col gap-1">
							<h2 className="text-xl font-bold tracking-tight">Media Content Shelf</h2>
							<p className="text-sm font-medium text-slate-400">
								Testing container snap & scroll-padding
							</p>
						</div>

						<DragScroll.Context>
							{({ canGoToNext, canGoToPrev, isDragging }) => (
								<div className="flex flex-wrap gap-2">
									<Indicator active={canGoToPrev} label="Prev" />
									<Indicator active={isDragging} label="Dragging" />
									<Indicator active={canGoToNext} label="Next" />
								</div>
							)}
						</DragScroll.Context>
					</header>

					<DragScroll.Prev
						className="absolute top-1/2 -left-5 z-20 flex size-12 -translate-y-1/2 cursor-pointer
							items-center justify-center rounded-2xl border border-slate-100 bg-white/90
							text-slate-900 shadow-xl backdrop-blur-md transition-all hover:scale-110
							active:scale-95 disabled:pointer-events-none disabled:opacity-0"
					>
						<Icon className="size-6" icon="lucide:chevron-left" />
					</DragScroll.Prev>

					<DragScroll.Container
						className="scrollbar-hidden flex items-stretch gap-6 overflow-x-auto scroll-smooth p-4
							data-[dragging=true]:cursor-grabbing"
					>
						<For
							each={items}
							renderItem={(item, index) => (
								<DragScroll.Item
									asChild={true}
									className="group relative flex aspect-4/5 w-[280px] shrink-0 cursor-grab
										flex-col justify-end overflow-hidden rounded-3xl border border-slate-100 p-8
										transition-all duration-500 select-none hover:-translate-y-1 hover:shadow-2xl
										active:cursor-grabbing"
								>
									<Card.Root key={item.title}>
										<div
											className={cnJoin(
												`absolute inset-0 bg-linear-to-br to-slate-900 opacity-90
												transition-transform duration-700 group-hover:scale-110`,
												item.color
											)}
										/>
										<div
											className="absolute inset-0 bg-slate-900/40 opacity-0 transition-opacity
												duration-300 group-hover:opacity-100"
										/>

										<Card.Header className="relative z-10 p-0 text-white">
											<div
												className="mb-2 w-fit rounded-full bg-white/20 px-2 py-0.5 text-[10px]
													font-black tracking-widest uppercase backdrop-blur-md"
											>
												{item.category}
											</div>
											<Card.Title className="text-2xl/tight font-black tracking-tight">
												{item.title}
											</Card.Title>
											<Card.Description className="mt-1 text-xs font-bold text-white/60">
												Collection Item #{index + 1}
											</Card.Description>
										</Card.Header>
									</Card.Root>
								</DragScroll.Item>
							)}
						/>
					</DragScroll.Container>

					<DragScroll.Next
						className="absolute top-1/2 -right-5 z-20 flex size-12 -translate-y-1/2 cursor-pointer
							items-center justify-center rounded-2xl border border-slate-100 bg-white/90
							text-slate-900 shadow-xl backdrop-blur-md transition-all hover:scale-110
							active:scale-95 disabled:pointer-events-none disabled:opacity-0"
					>
						<Icon className="size-6" icon="lucide:chevron-right" />
					</DragScroll.Next>
				</DragScroll.Root>
			</section>

			<section className="mt-8 flex flex-col gap-10">
				<div className="flex flex-col gap-2">
					<h2 className="text-xl font-bold tracking-tight">Internal Capabilities</h2>
					<p className="text-sm font-medium text-slate-500">
						Technical breakdown of the interaction store
					</p>
				</div>

				<ForWithWrapper
					className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
					each={[
						{
							desc: "Optimized pointer event handlers for 1:1 movement tracking.",
							icon: "lucide:mouse-pointer-2",
							title: "High-Frequency Tracking",
						},
						{
							desc: "Configurable snap points for precise item alignment after release.",
							icon: "lucide:magnet",
							title: "Magnetic Snapping",
						},
						{
							desc: "Hardware accelerated transitions with configurable damping.",
							icon: "lucide:zap",
							title: "Inertial Physics",
						},
						{
							desc: "External store access for custom navigation controls.",
							icon: "lucide:gamepad-2",
							title: "Remote Control",
						},
						{
							desc: "Full keyboard navigation and ARIA-compliant focus management.",
							icon: "lucide:accessibility",
							title: "Semantic Access",
						},
						{
							desc: "Pure headless logic separated from DOM-reliant layout.",
							icon: "lucide:package",
							title: "Logic Encapsulation",
						},
					]}
					renderItem={(feature) => (
						<li
							className="group flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-8
								transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
							key={feature.title}
						>
							<div
								className="flex size-12 items-center justify-center rounded-2xl bg-slate-50
									text-slate-400 transition-colors group-hover:bg-indigo-50
									group-hover:text-indigo-600"
							>
								<Icon className="size-6" icon={feature.icon} />
							</div>
							<div className="flex flex-col gap-2">
								<h3 className="font-bold">{feature.title}</h3>
								<p className="text-sm/relaxed font-medium text-slate-500">{feature.desc}</p>
							</div>
						</li>
					)}
				/>
			</section>
		</div>
	);
}

function Indicator({ active, label }: { active: boolean; label: string }) {
	return (
		<div
			className={cnJoin(
				`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] font-black tracking-widest
				uppercase transition-all duration-300`,
				active ?
					"border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
				:	"border-slate-100 bg-white text-slate-300"
			)}
		>
			<div className={cnJoin("size-1.5 rounded-full", active ? "bg-indigo-600" : "bg-slate-200")} />
			{label}
		</div>
	);
}

export { PageSeven };
