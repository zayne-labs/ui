"use client";

import { ClientGate } from "@zayne-labs/ui-react/common/client-gate";
import { Clock, Cpu, Globe, Layers, Monitor, RefreshCcw, ShieldCheck, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function ClientGateDemo() {
	const [key, setKey] = useState(0);

	return (
		<section className="flex w-full flex-col items-center justify-center gap-8 py-8">
			<ClientGate key={key} fallback={<DiagnosticFallback />}>
				<SystemDiagnostics />
			</ClientGate>

			<nav className="flex justify-center" aria-label="Demo controls">
				<Button
					theme="outline"
					size="sm"
					onClick={() => setKey((prev) => prev + 1)}
					className="group h-10 rounded-full px-6 font-bold shadow-sm ring-1 ring-fd-border
						hover:ring-fd-primary/50"
				>
					<RefreshCcw className="mr-2 size-4 transition-transform group-hover:rotate-180" />
					Refresh Runtime Context
				</Button>
			</nav>
		</section>
	);
}

export default ClientGateDemo;

function SystemDiagnostics() {
	const [time, setTime] = useState(() => new Date().toLocaleTimeString());

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date().toLocaleTimeString());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const systemInfo = [
		{
			icon: <Monitor className="size-4 text-blue-500" />,
			label: "Resolution",
			value: `${window.innerWidth} × ${window.innerHeight}`,
		},
		{
			icon: <Layers className="size-4 text-orange-500" />,
			label: "Pixel Ratio",
			value: `${window.devicePixelRatio.toFixed(1)}x`,
		},
		{
			icon: <Cpu className="size-4 text-purple-500" />,
			label: "Platform",
			value: navigator.platform || "Unknown",
		},
		{
			icon: <Globe className="size-4 text-emerald-500" />,
			label: "Language",
			value: navigator.language,
		},
		{
			icon: <Wifi className="size-4 text-cyan-500" />,
			label: "Network",
			value: navigator.onLine ? "Online" : "Offline",
		},
		{
			icon: <Clock className="size-4 text-amber-500" />,
			label: "Local Time",
			value: time,
		},
	];

	return (
		<article
			className="flex w-full max-w-md animate-in flex-col gap-4 rounded-2xl border border-fd-border
				bg-fd-card/50 p-6 shadow-xl backdrop-blur-sm duration-500 fade-in slide-in-from-bottom-2"
		>
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span
						className="flex size-8 items-center justify-center rounded-lg bg-fd-primary/10"
						aria-hidden="true"
					>
						<ShieldCheck className="size-5 text-fd-primary" />
					</span>
					<h3 className="font-bold tracking-tight text-fd-foreground">System Diagnostics</h3>
				</div>
				<span
					className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px]
						font-bold tracking-wider text-emerald-500 uppercase"
				>
					<span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
					Client Live
				</span>
			</header>

			<dl className="grid grid-cols-2 gap-3">
				{systemInfo.map((info, idx) => (
					<div
						key={info.label}
						className="group flex animate-in flex-col gap-1.5 rounded-xl border border-fd-border
							bg-fd-card p-3 transition-colors zoom-in-95 fade-in hover:border-fd-primary/30"
						style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
					>
						<div className="flex items-center gap-2 text-fd-muted-foreground">
							{info.icon}
							<dt className="text-[10px] font-medium tracking-wider uppercase">{info.label}</dt>
						</div>
						<dd className="truncate text-sm font-semibold text-fd-foreground">{info.value}</dd>
					</div>
				))}
			</dl>

			<footer className="rounded-lg bg-fd-muted/30 p-3">
				<div className="flex items-start gap-3">
					<span className="mt-0.5 rounded-sm bg-fd-background p-1.5" aria-hidden="true">
						<Cpu className="size-3 text-fd-muted-foreground" />
					</span>
					<div className="min-w-0 flex-1">
						<span
							className="text-[10px] font-medium tracking-widest text-fd-muted-foreground uppercase"
						>
							User Agent
						</span>
						<p
							className="mt-0.5 truncate text-[11px] leading-relaxed text-fd-muted-foreground
								italic"
						>
							{navigator.userAgent}
						</p>
					</div>
				</div>
			</footer>
		</article>
	);
}

function DiagnosticFallback() {
	return (
		<article
			className="flex w-full max-w-md animate-pulse flex-col gap-4 rounded-2xl border border-fd-border
				bg-fd-card/50 p-6 shadow-sm"
		>
			<div className="flex items-center gap-3">
				<span className="size-8 rounded-lg bg-fd-muted" />
				<span className="h-5 w-32 rounded-sm bg-fd-muted" />
			</div>
			<div className="grid grid-cols-2 gap-3">
				{[...Array(6).keys()].map((i) => (
					<span key={i} className="h-16 rounded-xl bg-fd-muted" />
				))}
			</div>
			<span className="h-12 rounded-lg bg-fd-muted" />
		</article>
	);
}
