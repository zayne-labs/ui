import { For, ForWithWrapper } from "@zayne-labs/ui-react/common/for";
import { Card } from "@zayne-labs/ui-react/ui/card";
import { useDragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";
import { cnJoin } from "../../lib/utils/cn";

function PageSeven() {
	const { propGetters, useDragScrollStore } = useDragScroll<HTMLUListElement>();

	/* eslint-disable react-hooks/hooks */
	const canGoToPrev = useDragScrollStore((state) => state.canGoToPrev);
	const canGoToNext = useDragScrollStore((state) => state.canGoToNext);
	const isDragging = useDragScrollStore((state) => state.isDragging);
	/* eslint-enable react-hooks/hooks */

	return (
		<main
			className="flex min-h-screen flex-col items-center bg-gray-50/50 p-8 font-sans text-gray-900
				selection:bg-indigo-100 selection:text-indigo-900"
		>
			<header className="text-center">
				<h1
					className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-5xl font-extrabold
						tracking-tight text-transparent"
				>
					Drag Scroll Demo
				</h1>
				<p className="mt-4 max-w-2xl text-lg text-gray-600">
					Experience smooth horizontal scrolling with drag gestures, touch support, and snap physics.
				</p>
			</header>

			<section
				className="mt-12 max-w-7xl overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-8
					shadow-xl ring-1 ring-black/5 backdrop-blur-xl"
			>
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<h2 className="text-2xl font-bold tracking-tight text-gray-800">Horizontal Gallery</h2>

					<div className="flex gap-2">
						<StatusPill label="Can Go Back" value={canGoToPrev} />
						<StatusPill label="Dragging" value={isDragging} />
						<StatusPill label="Can Go Next" value={canGoToNext} />
					</div>
				</div>

				<div className="group/container relative mt-8">
					<button
						type="button"
						{...propGetters.getBackButtonProps({
							className: `absolute top-1/2 -left-4 z-10 flex size-12 -translate-y-1/2 cursor-pointer
								items-center justify-center rounded-full border border-gray-100 bg-white/90 text-xl
								text-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all
								hover:scale-110 hover:bg-white disabled:pointer-events-none disabled:opacity-0`,
						})}
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
					</button>

					<ul
						{...propGetters.getRootProps({
							className:
								"flex gap-6 overflow-x-auto scroll-smooth py-8 px-4 scrollbar-hidden data-[dragging=true]:cursor-grabbing mask-linear-fade",
						})}
					>
						<For
							each={[
								{ color: "#ef4444", title: "Card 1" },
								{ color: "#f97316", title: "Card 2" },
								{ color: "#eab308", title: "Card 3" },
								{ color: "#22c55e", title: "Card 4" },
								{ color: "#06b6d4", title: "Card 5" },
								{ color: "#3b82f6", title: "Card 6" },
								{ color: "#8b5cf6", title: "Card 7" },
								{ color: "#ec4899", title: "Card 8" },
							]}
							renderItem={(item, index) => (
								<Card.Root
									as="li"
									key={item.title}
									{...propGetters.getItemProps({
										className:
											"group relative aspect-[4/3] w-[280px] shrink-0 cursor-grab select-none items-center justify-center rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:cursor-grabbing",
									})}
								>
									{/* Background Gradient and Glass Overlay */}
									<span
										className="absolute inset-0 rounded-2xl opacity-90 transition-opacity
											duration-300 group-hover:opacity-100"
										style={{
											background: `linear-gradient(135deg, ${item.color}, color-mix(in srgb, ${item.color}, black 20%))`,
										}}
									/>
									<span
										className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/20
											to-transparent"
									/>

									<Card.Header className="relative flex flex-col items-center text-white">
										<Card.Title
											className="text-6xl font-black tracking-tighter opacity-90 drop-shadow-sm"
										>
											{index + 1}
										</Card.Title>
										<Card.Description
											className="mt-2 text-lg font-medium tracking-wide text-white/90"
										>
											{item.title}
										</Card.Description>
									</Card.Header>
								</Card.Root>
							)}
						/>
					</ul>

					<button
						type="button"
						{...propGetters.getNextButtonProps({
							className: `absolute top-1/2 -right-4 z-10 flex size-12 -translate-y-1/2 cursor-pointer
								items-center justify-center rounded-full border border-gray-100 bg-white/90 text-xl
								text-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all
								hover:scale-110 hover:bg-white disabled:pointer-events-none disabled:opacity-0`,
						})}
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					</button>
				</div>
			</section>

			<section className="mx-auto mt-16 max-w-5xl">
				<h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-800">
					Key Features
				</h2>

				<ForWithWrapper
					className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
					each={[
						{
							desc: "Intuitive drag gestures for all devices",
							icon: "👆",
							title: "Touch & Drag",
						},
						{ desc: "Aligns perfectly to content items", icon: "🎯", title: "Snap Physics" },
						{ desc: "Throttled events for 60fps animations", icon: "⚡", title: "Performance" },
						{ desc: "Programmatic navigation support", icon: "🎮", title: "Control" },
						{ desc: "Keyboard friendly with ARIA support", icon: "♿", title: "Accessible" },
						{ desc: "Separated state logic for flexibility", icon: "📦", title: "Store-Based" },
					]}
					renderItem={(feature) => (
						<li
							key={feature.title}
							className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1
								ring-gray-900/5 transition-all hover:shadow-md hover:ring-indigo-500/20"
						>
							<span className="mb-4 text-3xl">{feature.icon}</span>
							<h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
							<p className="text-sm text-gray-500">{feature.desc}</p>
						</li>
					)}
				/>
			</section>
		</main>
	);
}

function StatusPill({ label, value }: { label: string; value: boolean }) {
	return (
		<span
			className={cnJoin(
				`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors
				duration-300`,
				value ?
					"border-emerald-200 bg-emerald-50 text-emerald-700"
				:	"border-gray-200 bg-gray-50 text-gray-400"
			)}
		>
			<span
				className={`size-1.5 rounded-full ${value ? "animate-pulse bg-emerald-500" : "bg-gray-300"}`}
			/>
			<span className="tracking-wider uppercase">{label}</span>
		</span>
	);
}

export { PageSeven };
