import { Suspense } from "react";
import { ErrorBoundary, type ErrorBoundaryProps } from "../error-boundary";

export type SuspenseWithBoundaryProps = {
	children: React.ReactNode;
	errorFallback?: ErrorBoundaryProps["fallback"];
	fallback?: React.ReactNode;
};

export function SuspenseWithBoundaryRoot(props: SuspenseWithBoundaryProps) {
	const { children, errorFallback, fallback } = props;

	const errorBoundaryProps = Boolean(errorFallback) && { fallback: errorFallback };
	const suspenseProps = Boolean(fallback) && { fallback };

	return (
		<ErrorBoundary {...errorBoundaryProps}>
			<Suspense {...suspenseProps}>{children}</Suspense>
		</ErrorBoundary>
	);
}
