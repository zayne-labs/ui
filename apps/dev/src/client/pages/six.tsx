import { Teleport } from "@zayne-labs/ui-react/common/teleport";

function PageSix() {
	return (
		<div className="flex flex-col gap-12">
			<header className="flex flex-col gap-4">
				<div
					className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50
						px-3 py-1 text-xs font-bold tracking-wider text-indigo-700 uppercase"
				>
					Teleportation
				</div>
				<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Teleport Component</h1>
				<p className="text-slate-500">
					Render components into different DOM locations while maintaining their logical position in
					the React tree.
				</p>
			</header>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{/* Source Location */}
				<section
					className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
				>
					<h3 className="flex items-center gap-2 font-bold text-slate-900">
						<span className="size-2 rounded-full bg-slate-400" />
						Source Location
					</h3>
					<div
						className="rounded-xl border border-slate-100 bg-slate-50 p-4 font-mono text-sm
							text-slate-600"
					>
						<p>&lt;Teleport to="#target"&gt;</p>
						<p className="pl-4 font-bold text-indigo-600">This content is defined here...</p>
						<p>&lt;/Teleport&gt;</p>
					</div>

					<Teleport to="#six-target" insertPosition="afterbegin">
						<div
							className="flex animate-bounce items-center gap-3 rounded-xl bg-indigo-600 p-4
								text-white shadow-xl shadow-indigo-200"
						>
							<div
								className="flex size-8 items-center justify-center rounded-full bg-white/20
									font-bold"
							>
								!
							</div>
							<p className="truncate font-bold">I teleported to the target!</p>
						</div>
					</Teleport>
				</section>

				{/* Target Location */}
				<section
					id="six-target"
					className="relative flex min-h-50 flex-col gap-4 rounded-3xl border-4 border-dashed
						border-indigo-100 bg-indigo-50/30 p-8"
				>
					<div
						className="absolute top-4 right-4 text-[10px] font-black tracking-[0.2em] text-indigo-300
							uppercase"
					>
						Target Container (#six-target)
					</div>

					<div className="flex flex-1 flex-col justify-end">
						<h1 className="text-2xl font-black text-slate-900">Landing Zone</h1>
						<p className="text-slate-500">Elements will appear at the top of this container.</p>
					</div>
				</section>
			</div>
		</div>
	);
}

export { PageSix };
