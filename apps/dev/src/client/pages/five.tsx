import { NavBar } from "../components/NavBar";

function PageFive() {
	return (
		<div className="flex flex-col gap-12">
			<header className="flex flex-col gap-4">
				<div
					className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50
						px-3 py-1 text-xs font-bold tracking-wider text-indigo-700 uppercase"
				>
					Layout Components
				</div>
				<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
					Navigation Bar Component
				</h1>
				<p className="text-slate-500">
					A responsive, multi-height navigation bar with mobile support and transition effects.
				</p>
			</header>

			<section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
				<div
					className="border-b border-slate-200 bg-slate-50 p-4 text-xs font-bold tracking-widest
						text-slate-400 uppercase"
				>
					Interactive Preview
				</div>
				<div className="min-h-100 bg-slate-100">
					<NavBar />
				</div>
			</section>
		</div>
	);
}

export { PageFive };
