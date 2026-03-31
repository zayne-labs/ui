export type ErrorFallbackRenderProps = {
	error: Error;
	resetErrorBoundary: (...args: unknown[]) => void;
};

export type ErrorBoundaryProps = {
	children: React.ReactNode;
	fallback?: React.ReactNode | ((props: ErrorFallbackRenderProps) => React.ReactNode);
	onError?: (context: { error: Error; info: React.ErrorInfo & { ownerStack?: string } }) => void;
	onErrorReset?: (
		context:
			| {
					args: unknown[];
					reason: "imperative-api";
			  }
			| {
					next: unknown[] | undefined;
					prev: unknown[] | undefined;
					reason: "keys";
			  }
	) => void;
	resetKeys?: unknown[];
};
