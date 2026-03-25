import MainForm from "../components/MainForm";

function PageOne() {
	return (
		<div className="flex flex-col gap-12">
			<header className="flex flex-col gap-6">
				<div 
					className="flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-1.5 text-xs font-black tracking-widest text-indigo-700 uppercase shadow-sm backdrop-blur-sm"
				>
					<span className="size-2 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
					Environment Ready
				</div>
				
				<div className="flex flex-col gap-4">
					<h1 className="text-5xl font-black tracking-tighter text-slate-900 sm:text-6xl lg:text-7xl">
						The Sandbox for <br/>
						<span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Zayne UI</span>
					</h1>
					<p className="max-w-2xl text-xl/relaxed font-medium text-slate-500">
						Where design meets implementation. Refine components, test edge cases, and 
						experience your library in a premium development context.
					</p>
				</div>
			</header>

			<section className="flex flex-col gap-10 rounded-4xl border border-dashed border-slate-200 bg-slate-50/30 p-12">
				<div className="flex flex-col gap-2">
					<h3 className="text-sm font-black tracking-[0.3em] text-slate-400 uppercase">Current Focus</h3>
					<p className="text-xl font-bold text-slate-700">Refining the MainForm component</p>
				</div>
				<MainForm />
			</section>
		</div>
	);
}

export { PageOne };
