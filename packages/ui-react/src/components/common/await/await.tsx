import * as React from "react";

import type { DiscriminatedRenderProps } from "@zayne-labs/toolkit-react/utils";
import { Fragment as ReactFragment, Suspense, use } from "react";
import { ErrorBoundary } from "../error-boundary";
import type { SuspenseWithBoundaryProps } from "../suspense-with-boundary";

type RenderPropFn<Tvalue> = (result: Tvalue) => React.ReactNode;

type AwaitProps<Tvalue> = AwaitInnerProps<Tvalue>
	& Pick<SuspenseWithBoundaryProps, "errorFallback" | "fallback"> & {
		wrapperVariant?: "none" | "only-boundary" | "only-suspense" | "suspense-and-boundary";
	};

export function Await<Tvalue>(props: AwaitProps<Tvalue>) {
	const { errorFallback, fallback, wrapperVariant = "suspense-and-boundary", ...restOfProps } = props;

	const WithErrorBoundary =
		wrapperVariant === "only-boundary" || wrapperVariant === "suspense-and-boundary"
			? ErrorBoundary
			: ReactFragment;

	const WithSuspense =
		wrapperVariant === "only-suspense" || wrapperVariant === "suspense-and-boundary"
			? Suspense
			: ReactFragment;

	const errorBoundaryProps = Boolean(errorFallback) && { fallback: errorFallback };

	const suspenseProps = Boolean(fallback) && { fallback };

	return (
		<WithErrorBoundary {...errorBoundaryProps}>
			<WithSuspense {...suspenseProps}>
				<AwaitInner {...restOfProps} />
			</WithSuspense>
		</WithErrorBoundary>
	);
}

export type AwaitInnerProps<Tvalue> = DiscriminatedRenderProps<RenderPropFn<Tvalue>> & {
	promise: Promise<Tvalue>;
};

function AwaitInner<TValue>(props: AwaitInnerProps<TValue>) {
	const { children, promise, render } = props;

	const result = use(promise);

	if (typeof children === "function") {
		return children(result);
	}

	return render(result);
}
