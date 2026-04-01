import { Suspense, type SuspenseProps } from "react";
import { ErrorBoundary, type ErrorBoundaryProps } from "../error-boundary";

export type SuspenseWithBoundaryProps = ErrorBoundaryProps & SuspenseProps;

export function SuspenseWithBoundary(props: SuspenseWithBoundaryProps) {
	const { children, fallback, name, ...restOfErrorBoundaryProps } = props;

	return (
		<ErrorBoundary {...restOfErrorBoundaryProps}>
			<Suspense fallback={fallback} name={name}>
				{children}
			</Suspense>
		</ErrorBoundary>
	);
}
