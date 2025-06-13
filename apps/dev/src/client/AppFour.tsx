import { Card } from "@zayne-labs/ui-react/ui/card";

function AppFour() {
	return (
		<div className="grid min-h-screen place-items-center bg-zinc-50 p-8">
			<Card.Root className="w-[420px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
				<Card.Header className="flex items-center gap-4">
					<img
						src="https://images.unsplash.com/photo-1517841905240-472988babdf9"
						alt="Sarah Anderson"
						className="h-14 w-14 rounded-full object-cover"
					/>

					<div>
						<Card.Title className="text-lg font-semibold">Sarah Anderson</Card.Title>
						<Card.Description>Senior Product Designer</Card.Description>
					</div>

					<Card.Action>
						<button
							type="button"
							className="rounded-full border border-blue-500 px-3 py-1 text-sm font-medium
								text-blue-500 transition-colors hover:bg-blue-50"
						>
							Follow
						</button>
					</Card.Action>
				</Card.Header>

				<Card.Content className="mt-4">
					<p className="text-sm leading-relaxed text-gray-700">
						Creating beautiful, intuitive interfaces that bring joy to users. Always exploring new
						design patterns and pushing creative boundaries.
					</p>
				</Card.Content>

				<Card.Footer className="mt-6 grid grid-cols-3 border-t border-gray-100 pt-4 text-center">
					<div className="flex flex-col gap-1">
						<span className="text-sm font-semibold">1.2k</span>
						<span className="text-xs font-medium uppercase tracking-wide text-gray-500">
							Followers
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-sm font-semibold">234</span>
						<span className="text-xs font-medium uppercase tracking-wide text-gray-500">
							Following
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-sm font-semibold">42</span>
						<span className="text-xs font-medium uppercase tracking-wide text-gray-500">
							Projects
						</span>
					</div>
				</Card.Footer>
			</Card.Root>
		</div>
	);
}

export default AppFour;
