export type FallbackProps = {
	error: unknown;
	resetErrorBoundary: (...args: unknown[]) => void;
};

export type ErrorBoundaryProps = {
	children: React.ReactNode;
	fallback?: React.ReactNode | ((props: FallbackProps) => React.ReactNode);
	onError?: (context: { error: Error; info: React.ErrorInfo & { ownerStack?: string } }) => void;
	onReset?: (
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
