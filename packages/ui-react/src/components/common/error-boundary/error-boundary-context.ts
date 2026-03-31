import { createCustomContext } from "@zayne-labs/toolkit-react";
import type { ErrorFallbackRenderProps } from "./types";

export type ErrorBoundaryContextType = ErrorFallbackRenderProps & {
	hasError: boolean;
};

const [ErrorBoundaryContext, useErrorBoundaryContext] = createCustomContext<ErrorBoundaryContextType>({
	hookName: "useErrorBoundaryContext",
	name: "ErrorBoundaryContext",
	providerName: "ErrorBoundaryContextProvider",
});

export { ErrorBoundaryContext, useErrorBoundaryContext };
