"use client";

import { ErrorBoundary } from "@zayne-labs/ui-react/common/error-boundary";
import { useState } from "react";

function ErrorBoundaryDemo() {
	const [shouldError, setShouldError] = useState(false);
	const [resetKey, setResetKey] = useState(0);

	const handleTriggerError = () => {
		setShouldError(true);
	};

	const handleReset = () => {
		setShouldError(false);
		setResetKey((prev) => prev + 1);
	};

	return (
		<div className="flex w-full max-w-md flex-col gap-4">
			<div className="flex gap-2">
				<button
					type="button"
					onClick={handleTriggerError}
					disabled={shouldError}
					className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm
						transition-all hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed
						disabled:opacity-50"
				>
					Trigger Error
				</button>
				<button
					type="button"
					onClick={handleReset}
					className="rounded-lg border border-fd-border bg-fd-card px-4 py-2 text-sm font-medium
						transition-all hover:bg-fd-muted active:scale-95"
				>
					Reset
				</button>
			</div>

			<ErrorBoundary
				onErrorReset={handleReset}
				errorResetKeys={[resetKey]}
				errorFallback={({ error, resetErrorBoundary }) => (
					<div
						className="rounded-xl border border-red-200 bg-red-50/50 p-6 shadow-sm backdrop-blur-sm
							dark:border-red-900/50 dark:bg-red-950/50"
					>
						<div className="mb-3 flex items-center gap-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10">
								<svg
									className="size-4 text-red-600 dark:text-red-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							</div>
							<p className="font-semibold text-red-900 dark:text-red-100">Error Caught</p>
						</div>
						<p className="mb-4 text-sm text-red-800 dark:text-red-200">{error.message}</p>
						<button
							type="button"
							onClick={resetErrorBoundary}
							className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm
								transition-all hover:bg-red-700 active:scale-95 dark:bg-red-700
								dark:hover:bg-red-600"
						>
							Try Again
						</button>
					</div>
				)}
			>
				<BuggyComponent shouldError={shouldError} />
			</ErrorBoundary>
		</div>
	);
}

export default ErrorBoundaryDemo;

function BuggyComponent(props: { shouldError: boolean }) {
	const { shouldError } = props;

	if (shouldError) {
		throw new Error("Component crashed unexpectedly!");
	}

	return (
		<div className="rounded-xl border border-fd-border bg-fd-card/40 p-6 shadow-sm backdrop-blur-sm">
			<div className="mb-2 flex items-center gap-2">
				<div className="flex size-8 items-center justify-center rounded-lg bg-green-500/10">
					<svg
						className="size-4 text-green-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<p className="font-semibold text-fd-foreground">Component Active</p>
			</div>
			<p className="text-sm text-fd-muted-foreground">Everything is running smoothly!</p>
		</div>
	);
}
