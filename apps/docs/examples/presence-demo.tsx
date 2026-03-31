"use client";

import { Presence } from "@zayne-labs/ui-react/common/presence";
import { useState } from "react";

function PresenceDemo() {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="rounded-md bg-fd-primary px-4 py-2 text-sm text-fd-primary-foreground
					transition-colors hover:bg-fd-primary/90"
			>
				{isOpen ? "Hide" : "Show"} Box
			</button>

			<Presence present={isOpen}>
				<div
					className="animate-in rounded-lg border border-fd-border bg-fd-primary p-6
						text-fd-primary-foreground shadow-lg duration-300 zoom-in-95 fade-in
						data-[animation-phase=exit]:animate-out data-[animation-phase=exit]:zoom-out-95
						data-[animation-phase=exit]:fade-out"
				>
					<p className="font-semibold">Animated Content</p>
					<p className="text-sm opacity-90">This box fades and scales in/out smoothly!</p>
				</div>
			</Presence>
		</div>
	);
}

export default PresenceDemo;
