"use client";

import * as React from "react";

import type { DiscriminatedRenderProps } from "@zayne-labs/toolkit-react/utils";
import { Suspense, use } from "react";
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

	const awaitedInnerElement = <AwaitInner {...restOfProps} />;

	switch (true) {
		// eslint-disable-next-line ts-eslint/prefer-nullish-coalescing -- || makes more sense here
		case (errorFallback && fallback) || errorFallback: {
			return (
				<ErrorBoundary fallback={errorFallback}>
					<Suspense fallback={fallback}>{awaitedInnerElement}</Suspense>;
				</ErrorBoundary>
			);
		}

		case fallback: {
			return <Suspense fallback={fallback}>{awaitedInnerElement}</Suspense>;
		}

		default: {
			return awaitedInnerElement;
		}
	}
}

function AwaitInner<TValue>(props: AwaitInnerProps<TValue>) {
	const { children, promise, render } = props;

	const result = use(promise);

	if (typeof children === "function") {
		return children(result);
	}

	return render(result);
}
