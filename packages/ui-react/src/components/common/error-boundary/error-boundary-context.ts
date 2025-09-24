import { createCustomContext } from "@zayne-labs/toolkit-react";

export type ErrorBoundaryContextType = {
	error: unknown;
	hasError: boolean;
	resetErrorBoundary: (...args: unknown[]) => void;
};

const [ErrorBoundaryContext, useErrorBoundaryContext] = createCustomContext<ErrorBoundaryContextType>({
	hookName: "useErrorBoundaryContext",
	name: "ErrorBoundaryContext",
	providerName: "ErrorBoundaryContextProvider",
});

export { ErrorBoundaryContext, useErrorBoundaryContext };
