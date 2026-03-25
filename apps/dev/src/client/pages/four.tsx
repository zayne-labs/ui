import { Card } from "@zayne-labs/ui-react/ui/card";

function PageFour() {
	return (
		<div className="flex flex-col gap-12">
			<header className="flex flex-col gap-4">
				<div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wider text-indigo-700 uppercase">
					Glassmorphism
				</div>
				<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
					Profile Card Component
				</h1>
				<p className="text-slate-500">
					A showcase of the Card component with advanced styling and glassmorphism effects.
				</p>
			</header>

			<section className="flex justify-center rounded-3xl border border-white/40 bg-linear-to-br from-indigo-500/10 to-violet-500/10 p-8">
				<Card.Root
					className="w-105 rounded-3xl border border-white/50 bg-white/40 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl"
				>
					<Card.Header className="flex items-center gap-4">
						<img
							src="https://images.unsplash.com/photo-1517841905240-472988babdf9"
							alt="Sarah Anderson"
							className="size-16 rounded-2xl object-cover shadow-sm ring-4 ring-white"
						/>

						<div className="flex-1">
							<Card.Title className="text-xl/tight font-bold text-slate-900">Sarah Anderson</Card.Title>
							<Card.Description className="font-medium text-slate-500">Senior Product Designer</Card.Description>
						</div>

						<Card.Action>
							<button
								type="button"
								className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95"
							>
								<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
								</svg>
							</button>
						</Card.Action>
					</Card.Header>

					<Card.Content className="mt-6">
						<p className="text-base/relaxed text-slate-600">
							Creating beautiful, intuitive interfaces that bring joy to users. Always exploring new
							design patterns and pushing creative boundaries.
						</p>
					</Card.Content>

					<Card.Footer className="mt-8 grid grid-cols-3 border-t border-slate-200/60 pt-6 text-center">
						<div className="flex flex-col gap-1">
							<span className="text-lg font-bold text-slate-900">1.2k</span>
							<span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
								Followers
							</span>
						</div>

						<div className="flex flex-col gap-1">
							<span className="text-lg font-bold text-slate-900">234</span>
							<span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
								Following
							</span>
						</div>

						<div className="flex flex-col gap-1">
							<span className="text-lg font-bold text-slate-900">42</span>
							<span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
								Projects
							</span>
						</div>
					</Card.Footer>
				</Card.Root>
			</section>
		</div>
	);
}

export { PageFour };
