import { Card } from "@zayne-labs/ui-react/ui/card";

function AppFour() {
	return (
		<div
			className="relative grid min-h-screen place-items-center bg-gradient-to-br from-sky-400
				via-indigo-500 to-purple-700 p-8"
		>
			<Card.Root
				className="w-[420px] rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl
					backdrop-blur-lg"
			>
				<Card.Header className="flex items-center gap-4">
					<img
						src="https://images.unsplash.com/photo-1517841905240-472988babdf9"
						alt="Sarah Anderson"
						className="size-14 rounded-full object-cover"
					/>

					<div>
						<Card.Title className="text-lg font-semibold text-white">Sarah Anderson</Card.Title>
						<Card.Description className="text-white/80">Senior Product Designer</Card.Description>
					</div>

					<Card.Action>
						<button
							type="button"
							className="rounded-full border border-white/60 px-4 py-1 text-sm font-medium
								text-white transition-colors hover:bg-white/20"
						>
							Follow
						</button>
					</Card.Action>
				</Card.Header>

				<Card.Content className="mt-4">
					<p className="text-sm leading-relaxed text-white/90">
						Creating beautiful, intuitive interfaces that bring joy to users. Always exploring new
						design patterns and pushing creative boundaries.
					</p>
				</Card.Content>

				<Card.Footer className="mt-6 grid grid-cols-3 border-t border-white/20 pt-4 text-center">
					<div className="flex flex-col gap-1">
						<span className="text-sm font-semibold text-white">1.2k</span>
						<span className="text-xs font-medium tracking-wide text-white/70 uppercase">
							Followers
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-sm font-semibold text-white">234</span>
						<span className="text-xs font-medium tracking-wide text-white/70 uppercase">
							Following
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-sm font-semibold text-white">42</span>
						<span className="text-xs font-medium tracking-wide text-white/70 uppercase">
							Projects
						</span>
					</div>
				</Card.Footer>
			</Card.Root>
		</div>
	);
}

export default AppFour;
