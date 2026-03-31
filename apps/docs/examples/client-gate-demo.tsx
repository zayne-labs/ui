/* eslint-disable unicorn/prefer-global-this */
"use client";

import { ClientGate } from "@zayne-labs/ui-react/common/client-gate";
import { useState } from "react";

function ClientGateDemo() {
	const [showContent, setShowContent] = useState(true);

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			<button
				type="button"
				onClick={() => setShowContent(!showContent)}
				className="rounded-md bg-fd-primary px-4 py-2 text-sm text-fd-primary-foreground
					transition-colors hover:bg-fd-primary/90"
			>
				{showContent ? "Hide" : "Show"} Content
			</button>

			{showContent && (
				<ClientGate fallback={<div className="h-24 animate-pulse rounded-lg bg-fd-muted" />}>
					<div className="rounded-lg border border-fd-border bg-fd-card p-4 shadow-sm">
						<p className="mb-2 font-semibold">Client-Only Content</p>
						<p className="text-sm text-fd-muted-foreground">
							Window width: {typeof window !== "undefined" ? window.innerWidth : 0}px
						</p>
						<p className="text-sm text-fd-muted-foreground">
							User Agent:{" "}
							{typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 50) : "N/A"}...
						</p>
					</div>
				</ClientGate>
			)}
		</div>
	);
}

export default ClientGateDemo;
