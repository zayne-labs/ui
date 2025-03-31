import * as React from "react";

import type { DiscriminatedRenderProps } from "@zayne-labs/toolkit-react/utils";
import { Fragment as ReactFragment, Suspense, use } from "react";
import { ErrorBoundary, type ErrorBoundaryProps } from "../error-boundary";

type RenderPropFn<Tvalue> = (result: Tvalue) => React.ReactNode;

export type AwaitInnerProps<Tvalue> = DiscriminatedRenderProps<RenderPropFn<Tvalue>> & {
	promise: Promise<Tvalue>;
};

type AwaitProps<Tvalue> = AwaitInnerProps<Tvalue> & {
	errorFallback?: ErrorBoundaryProps["fallback"];
	fallback?: React.ReactNode;
};

export function Await<Tvalue>(props: AwaitProps<Tvalue>) {
	const { errorFallback, fallback, ...restOfProps } = props;

	const WithErrorBoundary = errorFallback ? ErrorBoundary : ReactFragment;
	const WithSuspense = fallback ? Suspense : ReactFragment;

	const errorBoundaryProps = { fallback: errorFallback };
	const suspenseProps = { fallback };

	return (
		<WithErrorBoundary {...errorBoundaryProps}>
			<WithSuspense {...suspenseProps}>
				<AwaitInner {...restOfProps} />
			</WithSuspense>
		</WithErrorBoundary>
	);
}

function AwaitInner<TValue>(props: AwaitInnerProps<TValue>) {
	const { children, promise, render } = props;

	const result = use(promise);

	if (typeof children === "function") {
		return children(result);
	}

	return render(result);
}
