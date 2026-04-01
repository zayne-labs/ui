"use client";

import { Await } from "@zayne-labs/ui-react/common/await";
import { SuspenseWithBoundary } from "@zayne-labs/ui-react/common/suspense-with-boundary";
import { AlertCircle, RefreshCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchData = async (shouldError: boolean) => {
	await waitFor(2000);

	if (shouldError) {
		throw new Error("Critical synchronization failure");
	}

	return { latency: "24ms", status: "Active" };
};

function SuspenseWithBoundaryDemo() {
	const [shouldError, setShouldError] = useState(false);
	const [dataPromise, setDataPromise] = useState(() => fetchData(false));

	const handleReload = () => {
		setShouldError(false);
		setDataPromise(fetchData(false));
	};

	const triggerError = () => {
		setShouldError(true);
		setDataPromise(fetchData(true));
	};

	return (
		<section className="flex w-full max-w-md flex-col gap-8 py-4">
			<nav className="flex flex-wrap gap-2" aria-label="Demo controls">
				<Button theme="outline" onClick={handleReload} className="font-bold">
					<RefreshCcw className="mr-2 size-4" />
					Sync Data
				</Button>
				<Button
					theme="ghost"
					onClick={triggerError}
					className="font-bold text-red-500 hover:bg-red-500/5 hover:text-red-600"
				>
					<AlertCircle className="mr-2 size-4" />
					Trigger Error
				</Button>
			</nav>

			<div className="relative min-h-40">
				<SuspenseWithBoundary
					key={shouldError ? "error" : "success"}
					errorResetKeys={[dataPromise]}
					fallback={
						<div
							className="flex w-full animate-pulse flex-col gap-4 rounded-2xl border
								border-fd-border bg-fd-muted/10 p-6 shadow-sm"
						>
							<div className="flex items-center gap-3">
								<span className="size-10 rounded-xl bg-fd-muted/30" />
								<div className="flex flex-col gap-2">
									<div className="h-4 w-32 rounded-sm bg-fd-muted/30" />
									<div className="h-3 w-16 rounded-sm bg-fd-muted/20" />
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<div className="h-3 w-full rounded-sm bg-fd-muted/20" />
								<div className="h-3 w-3/4 rounded-sm bg-fd-muted/20" />
							</div>
						</div>
					}
					errorFallback={({ error, resetErrorBoundary }) => (
						<article
							className="flex w-full animate-in flex-col items-center justify-center gap-4
								rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center shadow-lg
								backdrop-blur-sm zoom-in-95 fade-in"
						>
							<span
								className="flex size-14 items-center justify-center rounded-full bg-red-500/10
									shadow-inner"
							>
								<AlertCircle className="size-7 text-red-500" />
							</span>
							<div className="flex flex-col gap-1">
								<h3 className="text-base font-bold text-fd-foreground">Processing Interrupted</h3>
								<p className="text-xs font-medium text-red-500/80">{error.message}</p>
							</div>
							<Button
								theme="destructive"
								size="sm"
								onClick={resetErrorBoundary}
								className="mt-2 font-bold shadow-lg shadow-red-500/20"
							>
								Restore Connection
							</Button>
						</article>
					)}
				>
					<Await.Root promise={dataPromise} withErrorBoundary={false} withSuspense={false}>
						{(data) => <DataDisplay data={data} />}
					</Await.Root>
				</SuspenseWithBoundary>
			</div>
		</section>
	);
}

export default SuspenseWithBoundaryDemo;

function DataDisplay({ data }: { data: { latency: string; status: string } }) {
	return (
		<article
			className="flex w-full animate-in flex-col gap-4 rounded-2xl border border-fd-border bg-fd-card/50
				p-6 shadow-xl backdrop-blur-sm fade-in slide-in-from-bottom-2"
		>
			<header className="flex items-center gap-3">
				<span className="flex size-10 items-center justify-center rounded-xl bg-fd-primary/10">
					<Sparkles className="size-5 text-fd-primary" />
				</span>
				<div>
					<h3 className="text-sm font-bold tracking-tight text-fd-foreground">
						Cloud Synchronization
					</h3>
					<p className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
						System {data.status}
					</p>
				</div>
			</header>

			<div className="flex flex-col gap-2">
				<p className="text-[13px] leading-relaxed font-medium text-fd-muted-foreground/90">
					All data packets have been successfully synchronized with the primary node. Data integrity
					is verified.
				</p>
				<div className="mt-2 flex items-center gap-2">
					<span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
					<span className="text-[11px] font-bold text-fd-muted-foreground/60 uppercase">
						Latency: {data.latency}
					</span>
				</div>
			</div>
		</article>
	);
}
