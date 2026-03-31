"use client";

import { Teleport } from "@zayne-labs/ui-react/common/teleport";
import { useState } from "react";

function TeleportDemo() {
	const [showModal, setShowModal] = useState(false);

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			<div className="overflow-hidden rounded-lg border border-fd-border bg-fd-card p-4">
				<p className="mb-4 text-sm text-fd-muted-foreground">
					This container has <code className="rounded-sm bg-fd-muted px-1">overflow: hidden</code>
				</p>
				<button
					type="button"
					onClick={() => setShowModal(true)}
					className="rounded-md bg-fd-primary px-4 py-2 text-sm text-fd-primary-foreground
						transition-colors hover:bg-fd-primary/90"
				>
					Open Modal
				</button>
			</div>

			{showModal && (
				<Teleport to="body">
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50
							backdrop-blur-sm"
					>
						<div
							className="w-full max-w-sm rounded-lg border border-fd-border bg-fd-background p-6
								shadow-xl"
						>
							<h3 className="mb-2 text-lg font-semibold">Teleported Modal</h3>
							<p className="mb-4 text-sm text-fd-muted-foreground">
								This modal is rendered at the end of the document body, escaping the
								overflow:hidden container!
							</p>
							<button
								type="button"
								onClick={() => setShowModal(false)}
								className="rounded-md bg-fd-primary px-4 py-2 text-sm text-fd-primary-foreground
									transition-colors hover:bg-fd-primary/90"
							>
								Close
							</button>
						</div>
					</div>
				</Teleport>
			)}
		</div>
	);
}

export default TeleportDemo;
