import { createCustomContext } from "@zayne-labs/toolkit-react";

export type ErrorBoundaryContext = {
	error: unknown;
	hasError: boolean;
	resetErrorBoundary: (...args: unknown[]) => void;
};

export const [ErrorBoundaryContextProvider, useErrorBoundaryContext] =
	createCustomContext<ErrorBoundaryContext>({
		hookName: "useErrorBoundaryContext",
		name: "ErrorBoundaryContext",
		providerName: "ErrorBoundaryContextProvider",
	});
