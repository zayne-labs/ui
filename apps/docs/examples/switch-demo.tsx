"use client";

import { Switch } from "@zayne-labs/ui-react/common/switch";
import { useState } from "react";
import { cnJoin } from "@/lib/utils/cn";

export default function SwitchDemo() {
	const [status, setStatus] = useState<"error" | "idle" | "loading" | "success">("idle");

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => setStatus("idle")}
					className={cnJoin(
						"rounded-md px-3 py-1.5 text-sm transition-colors",
						status === "idle" ?
							"bg-fd-secondary text-fd-secondary-foreground ring-2 ring-fd-ring ring-offset-2"
						:	"bg-fd-secondary/50 text-fd-secondary-foreground/70 hover:bg-fd-secondary/80"
					)}
				>
					Idle
				</button>
				<button
					type="button"
					onClick={() => setStatus("loading")}
					className={cnJoin(
						"rounded-md px-3 py-1.5 text-sm transition-colors",
						status === "loading" ?
							"bg-fd-primary text-fd-primary-foreground ring-2 ring-fd-ring ring-offset-2"
						:	"bg-fd-primary/50 text-fd-primary-foreground/70 hover:bg-fd-primary/80"
					)}
				>
					Loading
				</button>
				<button
					type="button"
					onClick={() => setStatus("success")}
					className={cnJoin(
						"rounded-md px-3 py-1.5 text-sm text-white transition-colors",
						status === "success" ?
							"bg-green-600 ring-2 ring-green-500 ring-offset-2 dark:bg-green-700"
						:	`bg-green-600/50 hover:bg-green-600/80 dark:bg-green-700/50
							dark:hover:bg-green-700/80`
					)}
				>
					Success
				</button>
				<button
					type="button"
					onClick={() => setStatus("error")}
					className={cnJoin(
						"rounded-md px-3 py-1.5 text-sm transition-colors",
						status === "error" ?
							`bg-fd-destructive text-fd-destructive-foreground ring-2 ring-fd-destructive
								ring-offset-2`
						:	"bg-fd-destructive/50 text-fd-destructive-foreground/70 hover:bg-fd-destructive/80"
					)}
				>
					Error
				</button>
			</div>

			<div className="rounded-lg border border-fd-border bg-fd-card p-6 shadow-sm">
				<Switch.Root>
					<Switch.Match when={status === "idle"}>
						<div className="flex items-center gap-2 text-fd-muted-foreground">
							<span className="size-2 rounded-full bg-fd-muted-foreground/40" />
							<p>Ready to start</p>
						</div>
					</Switch.Match>

					<Switch.Match when={status === "loading"}>
						<div className="flex items-center gap-2 text-fd-primary">
							<span
								className="size-4 animate-spin rounded-full border-2 border-current
									border-t-transparent"
							/>
							<p>Loading...</p>
						</div>
					</Switch.Match>

					<Switch.Match when={status === "success"}>
						<div className="flex items-center gap-2 text-green-600 dark:text-green-500">
							<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<p>Operation completed successfully!</p>
						</div>
					</Switch.Match>

					<Switch.Match when={status === "error"}>
						<div className="flex items-center gap-2 text-fd-destructive">
							<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
							<p>Something went wrong</p>
						</div>
					</Switch.Match>

					<Switch.Default>
						<p className="text-fd-muted-foreground">Unknown status</p>
					</Switch.Default>
				</Switch.Root>
			</div>
		</div>
	);
}
