"use client";

import { ErrorBoundary } from "@zayne-labs/ui-react/common/error-boundary";
import { AlertTriangle, Bug, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function ErrorBoundaryDemo() {
	const [shouldError, setShouldError] = useState(false);
	const [resetKey, setResetKey] = useState(0);

	const handleTriggerError = () => setShouldError(true);

	const handleReset = () => {
		setShouldError(false);
		setResetKey((prev) => prev + 1);
	};

	return (
		<section className="flex w-full max-w-md flex-col gap-6 py-4">
			<nav className="flex flex-wrap gap-2" aria-label="ErrorBoundary controls">
				<Button
					theme="destructive"
					onClick={handleTriggerError}
					disabled={shouldError}
					className="min-w-32"
				>
					<Bug className="mr-2 size-4" />
					Trigger Crash
				</Button>
				<Button theme="outline" onClick={handleReset}>
					<RefreshCw className="mr-2 size-4" />
					Reset Demo
				</Button>
			</nav>

			<div className="relative min-h-40">
				<ErrorBoundary
					onErrorReset={handleReset}
					errorResetKeys={[resetKey]}
					errorFallback={({ error, resetErrorBoundary }) => (
						<article
							className="group w-full animate-in rounded-2xl border border-red-500/20 bg-red-500/5
								p-6 shadow-xl shadow-red-500/5 backdrop-blur-sm fade-in slide-in-from-top-2"
						>
							<header className="flex items-start gap-4">
								<span className="rounded-full bg-red-500/10 p-2.5" aria-hidden="true">
									<XCircle className="size-6 text-red-600 dark:text-red-400" />
								</span>
								<div className="flex-1">
									<h4 className="text-lg font-bold tracking-tight text-red-900 dark:text-red-100">
										Boundary Caught Error
									</h4>
									<p className="mt-1 text-sm/relaxed text-red-800/80 dark:text-red-200/80">
										{error.message}
									</p>
								</div>
							</header>

							<div className="mt-6 flex flex-col gap-3">
								<div
									className="rounded-lg bg-red-500/10 p-3 font-geist-mono text-[11px] text-red-700
										dark:text-red-300"
								>
									Stack trace suppressed for demo safety.
								</div>
								<Button theme="destructive" onClick={resetErrorBoundary}>
									<RefreshCw className="mr-2 size-4" />
									Attempt Recovery
								</Button>
							</div>
						</article>
					)}
				>
					<BuggyComponent shouldError={shouldError} />
				</ErrorBoundary>
			</div>
		</section>
	);
}
export default ErrorBoundaryDemo;

function BuggyComponent({ shouldError }: { shouldError: boolean }) {
	if (shouldError) {
		throw new Error("Critical system failure: BuggyComponent met an unhandled exception.");
	}

	return (
		<article
			className="flex w-full animate-in flex-col gap-4 rounded-2xl border border-fd-border bg-fd-card/50
				p-6 shadow-xl backdrop-blur-sm zoom-in-95 fade-in"
		>
			<header className="flex items-center gap-3">
				<span
					className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10"
					aria-hidden="true"
				>
					<CheckCircle2 className="size-5 text-emerald-500" />
				</span>
				<div>
					<h4 className="font-bold tracking-tight text-fd-foreground">System Operational</h4>
					<p className="text-xs font-medium text-fd-muted-foreground/80">
						Component lifecycle is stable
					</p>
				</div>
			</header>

			<div className="flex items-center gap-3 rounded-xl bg-fd-muted/30 p-4">
				<AlertTriangle className="size-4 animate-pulse text-amber-500" />
				<p className="text-sm font-medium text-fd-foreground">Waiting for an error trigger...</p>
			</div>
		</article>
	);
}
