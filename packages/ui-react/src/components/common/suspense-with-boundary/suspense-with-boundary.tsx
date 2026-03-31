import { Suspense } from "react";
import { ErrorBoundary, type ErrorBoundaryProps } from "../error-boundary";

export type SuspenseWithBoundaryProps = {
	children: React.ReactNode;
	errorFallback?: ErrorBoundaryProps["fallback"];
	fallback?: React.ReactNode;
	onError?: ErrorBoundaryProps["onError"];
	onErrorReset?: ErrorBoundaryProps["onErrorReset"];
};

export function SuspenseWithBoundary(props: SuspenseWithBoundaryProps) {
	const { children, errorFallback, fallback, onError, onErrorReset } = props;

	return (
		<ErrorBoundary fallback={errorFallback} onError={onError} onErrorReset={onErrorReset}>
			<Suspense fallback={fallback}>{children}</Suspense>
		</ErrorBoundary>
	);
}
