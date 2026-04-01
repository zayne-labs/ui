"use client";

import { Switch } from "@zayne-labs/ui-react/common/switch";
import { AlertCircle, CheckCircle2, Circle, Loader2, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";

type Status = "error" | "idle" | "loading" | "success";

function SwitchDemo() {
	const [status, setStatus] = useState<Status>("idle");

	return (
		<section className="flex w-full max-w-md flex-col gap-6 py-4">
			<nav className="flex flex-wrap gap-2" aria-label="Status controls">
				<Button
					theme={status === "idle" ? "primary" : "outline"}
					onClick={() => setStatus("idle")}
					size="sm"
					className="font-bold tracking-tight"
				>
					Idle
				</Button>
				<Button
					theme={status === "loading" ? "glow" : "outline"}
					onClick={() => setStatus("loading")}
					size="sm"
					className="font-bold tracking-tight"
				>
					Loading
				</Button>
				<Button
					theme={status === "success" ? "primary" : "outline"}
					onClick={() => setStatus("success")}
					size="sm"
					className={cnJoin(
						"font-bold tracking-tight",
						status === "success" && "bg-emerald-600 hover:bg-emerald-700"
					)}
				>
					Success
				</Button>
				<Button
					theme={status === "error" ? "destructive" : "outline"}
					onClick={() => setStatus("error")}
					size="sm"
					className="font-bold tracking-tight"
				>
					Error
				</Button>
			</nav>

			<div className="relative min-h-35">
				<article
					className="flex w-full flex-col gap-4 rounded-2xl border border-fd-border bg-fd-card/50 p-6
						shadow-xl backdrop-blur-sm"
				>
					<header className="flex items-center gap-2 border-b border-fd-border pb-3">
						<span
							className="text-[11px] font-bold tracking-widest text-fd-muted-foreground uppercase"
						>
							System Status
						</span>
					</header>

					<div className="flex-1">
						<Switch.Root>
							<Switch.Match when={status === "idle"}>
								<div className="flex animate-in items-center gap-3 fade-in slide-in-from-left-4">
									<span
										className="flex size-10 items-center justify-center rounded-full
											bg-fd-muted/30"
									>
										<Circle className="size-5 text-fd-muted-foreground/60" />
									</span>
									<div>
										<p className="text-[15px] font-bold text-fd-foreground">Ready to start</p>
										<p className="text-xs font-medium text-fd-muted-foreground/80">
											System is in dormant state
										</p>
									</div>
								</div>
							</Switch.Match>

							<Switch.Match when={status === "loading"}>
								<div className="flex animate-in items-center gap-3 fade-in slide-in-from-left-4">
									<span
										className="flex size-10 items-center justify-center rounded-full
											bg-fd-primary/10"
									>
										<Loader2 className="size-5 animate-spin text-fd-primary" />
									</span>
									<div>
										<p className="text-[15px] font-bold text-fd-foreground">Synchronizing...</p>
										<p className="text-xs font-medium text-fd-muted-foreground/80">
											Fetching real-time updates
										</p>
									</div>
								</div>
							</Switch.Match>

							<Switch.Match when={status === "success"}>
								<div className="flex animate-in items-center gap-3 fade-in slide-in-from-left-4">
									<span
										className="flex size-10 items-center justify-center rounded-full
											bg-emerald-500/10"
									>
										<CheckCircle2 className="size-5 text-emerald-500" />
									</span>
									<div>
										<p className="text-[15px] font-bold text-fd-foreground">
											Operation Successful
										</p>
										<p className="text-xs font-medium text-fd-muted-foreground/80">
											All data integrity checks passed
										</p>
									</div>
								</div>
							</Switch.Match>

							<Switch.Match when={status === "error"}>
								<div className="flex animate-in items-center gap-3 fade-in slide-in-from-left-4">
									<span
										className="flex size-10 items-center justify-center rounded-full
											bg-red-500/10"
									>
										<AlertCircle className="size-5 text-red-500" />
									</span>
									<div>
										<p className="text-[15px] font-bold text-fd-foreground">Critical Error</p>
										<p className="text-xs font-medium text-fd-muted-foreground/80">
											Connection handshake failed
										</p>
									</div>
								</div>
							</Switch.Match>

							<Switch.Default>
								<div className="flex items-center gap-3">
									<Play className="size-5 text-fd-muted-foreground" />
									<p className="text-sm font-medium text-fd-muted-foreground">
										Select a status to preview
									</p>
								</div>
							</Switch.Default>
						</Switch.Root>
					</div>
				</article>
			</div>
		</section>
	);
}

export default SwitchDemo;
