"use client";

import { Teleport } from "@zayne-labs/ui-react/common/teleport";
import { Box, ChevronDown, ChevronUp, Sparkles, Target, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cnJoin } from "@/lib/utils/cn";

function TeleportDemo() {
	const [isTeleported, setIsTeleported] = useState(false);
	const [position, setPosition] = useState<InsertPosition>("afterbegin");

	return (
		<section className="flex w-full max-w-2xl flex-col gap-8 py-4 md:flex-row">
			<div className="flex flex-1 flex-col gap-4">
				<header className="flex items-center gap-2">
					<span className="flex size-8 items-center justify-center rounded-lg bg-fd-primary/10">
						<Box className="size-4 text-fd-primary" />
					</span>
					<h3 className="text-sm font-black tracking-tight text-fd-foreground">Source</h3>
				</header>

				<article
					className="flex flex-col gap-5 rounded-3xl border border-fd-border bg-fd-card/50 p-6
						shadow-xl backdrop-blur-sm"
				>
					<div
						className="rounded-2xl bg-black/40 p-4 font-geist-mono text-[11px]/relaxed
							text-fd-muted-foreground/80"
					>
						<span className="text-pink-400">{"<Teleport "}</span>
						<div className="pl-4">
							<span className="text-sky-400">to</span>
							<span className="text-white">="</span>
							<span className="text-emerald-400">#target</span>
							<span className="text-white">"</span>
						</div>
						<div className="pl-4">
							<span className="text-sky-400">insertPosition</span>
							<span className="text-white">="</span>
							<span className="text-emerald-400">{position}</span>
							<span className="text-white">"</span>
						</div>
						<span className="text-pink-400">{">"}</span>
						<div className="pl-4 text-fd-foreground/60">{"// Content..."}</div>
						<span className="text-pink-400">{"</Teleport>"}</span>
					</div>

					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<p
								className="text-[10px] font-black tracking-widest text-fd-muted-foreground
									uppercase opacity-70"
							>
								Target Position
							</p>
							<div className="flex flex-wrap gap-1.5">
								{(["afterbegin", "beforeend"] satisfies InsertPosition[]).map((pos) => (
									<Button
										key={pos}
										theme={position === pos ? "glow" : "outline"}
										size="xs"
										onClick={() => setPosition(pos)}
										className={cnJoin(
											"rounded-lg font-black tracking-tight",
											position === pos && "border-fd-primary/50 text-fd-primary"
										)}
									>
										{pos}
									</Button>
								))}
							</div>
						</div>

						<Button
							theme={isTeleported ? "secondary" : "glow"}
							onClick={() => setIsTeleported(!isTeleported)}
							className="w-full rounded-xl font-bold tracking-tight"
						>
							<Zap
								className={cnJoin("mr-2 size-4 transition-all", isTeleported && "fill-current")}
							/>
							{isTeleported ? "Recall Beam" : "Initiate Beam"}
						</Button>
					</div>
				</article>
			</div>

			<div className="flex flex-1 flex-col gap-4">
				<header className="flex items-center gap-2">
					<span className="flex size-8 items-center justify-center rounded-lg bg-fd-accent/10">
						<Target className="size-4 text-fd-accent" />
					</span>
					<h3 className="text-sm font-black tracking-tight text-fd-foreground">Destination</h3>
				</header>

				<article
					className="flex size-full flex-col gap-4 rounded-3xl border border-dashed
						border-fd-border/50 bg-fd-card/10 p-6"
				>
					<div className="flex grow flex-col gap-2.5">
						<div
							className="flex items-center gap-2 px-1 text-[9px] font-black tracking-tight
								text-fd-muted-foreground/60 uppercase"
						>
							<ChevronUp className="size-2.5" />
							Pre-existing entry
						</div>

						<div
							id="teleport-target"
							className="relative flex min-h-42 flex-col gap-2 rounded-2xl border
								border-fd-primary/10 bg-fd-primary/5 p-3"
						>
							<div
								className={cnJoin(
									`text-center text-[9px] font-black tracking-[0.3em] text-fd-primary/30
									uppercase`,
									position === "afterbegin" && "mt-auto",
									position === "beforeend" && "-mt-[auto]"
								)}
							>
								#teleport-target
							</div>

							<div
								className="flex items-center gap-2 rounded-xl bg-fd-card/60 p-3 text-[10px]
									font-black tracking-tight text-fd-foreground/70"
							>
								STATIC CONTENT BLOCK
							</div>
						</div>

						<div
							className="flex items-center gap-2 px-1 text-[9px] font-black tracking-tight
								text-fd-muted-foreground/60 uppercase"
						>
							<ChevronDown className="size-2.5" />
							Bottom anchor
						</div>
					</div>

					<div className="border-t border-fd-border/40 pt-4">
						<h4 className="text-xs font-bold tracking-widest text-fd-foreground uppercase opacity-70">
							Result
						</h4>
						<p className="mt-1 text-[11px]/relaxed font-medium text-fd-muted-foreground/90">
							Beam moves relative to children in the target.
						</p>
					</div>
				</article>
			</div>

			{isTeleported && (
				<Teleport to="#teleport-target" insertPosition={position}>
					<div
						className="flex w-full animate-in items-center justify-center gap-2 rounded-xl
							bg-fd-primary/20 px-4 py-2 text-[11px] font-black tracking-tight text-fd-primary
							shadow-2xl ring-1 ring-fd-primary/30 zoom-in-95 fade-in"
					>
						<Sparkles className="size-3.5 animate-bounce" />
						BEAM ACTIVE
					</div>
				</Teleport>
			)}
		</section>
	);
}

export default TeleportDemo;
