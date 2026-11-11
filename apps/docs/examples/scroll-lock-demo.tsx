"use client";

import { ScrollLock } from "@zayne-labs/ui-react/common/scroll-lock";
import { Teleport } from "@zayne-labs/ui-react/common/teleport";
import { Lock, Unlock, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const items = Array.from({ length: 30 }, (_, index) => `Scrollable item ${index + 1}`);

function ScrollLockDemo() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<section className="flex w-full max-w-md flex-col items-center gap-4 py-4 text-center">
			<p className="text-sm text-fd-muted-foreground">
				Open the panel, then try scrolling the page behind it. Only the list inside the panel scrolls.
			</p>

			<Button theme="glow" className="rounded-xl font-bold" onClick={() => setIsOpen(true)}>
				<Lock className="mr-2 size-4" />
				Open locked panel
			</Button>

			{isOpen && (
				<Teleport to="body">
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
						<ScrollLock
							className="flex max-h-[70dvh] w-full max-w-sm flex-col overflow-hidden rounded-3xl
								border border-fd-border bg-fd-card shadow-2xl"
						>
							<header className="flex items-center justify-between border-b border-fd-border p-4">
								<h3 className="text-sm font-black tracking-tight">Page scroll is locked</h3>
								<Button
									theme="ghost"
									size="icon"
									aria-label="Close panel"
									onClick={() => setIsOpen(false)}
								>
									<X className="size-4" />
								</Button>
							</header>

							<ul className="flex flex-col gap-2 overflow-y-auto overscroll-contain p-4">
								{items.map((item) => (
									<li
										key={item}
										className="rounded-xl bg-fd-secondary/60 px-3 py-2 text-left text-xs
											font-medium"
									>
										{item}
									</li>
								))}
							</ul>

							<footer className="border-t border-fd-border p-4">
								<Button
									theme="secondary"
									className="w-full rounded-xl font-bold"
									onClick={() => setIsOpen(false)}
								>
									<Unlock className="mr-2 size-4" />
									Unlock
								</Button>
							</footer>
						</ScrollLock>
					</div>
				</Teleport>
			)}
		</section>
	);
}

export default ScrollLockDemo;
