"use client";

import * as React from "react";

import type { DiscriminatedRenderProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import { Fragment as ReactFragment, Suspense, use } from "react";
import { ErrorBoundary } from "../error-boundary";
import { Slot } from "../slot";
import type { SuspenseWithBoundaryProps } from "../suspense-with-boundary";

type RenderPropFn<TValue> = (result: TValue) => React.ReactNode;

type AwaitProps<TValue> = AwaitInnerProps<TValue>
	& Pick<SuspenseWithBoundaryProps, "errorFallback" | "fallback"> & {
		withErrorBoundary?: boolean;
	};

// TODO - Add Support for Slot components
export function Await<TValue>(props: AwaitProps<TValue>) {
	const { errorFallback, fallback, withErrorBoundary = true, ...restOfProps } = props;

	const WithErrorBoundary = withErrorBoundary ? ErrorBoundary : ReactFragment;

	const errorBoundaryProps = Boolean(errorFallback) && { fallback: errorFallback };

	return (
		<WithErrorBoundary {...errorBoundaryProps}>
			<Suspense fallback={fallback}>
				<AwaitInner {...restOfProps} />
			</Suspense>
		</WithErrorBoundary>
	);
}

export type AwaitInnerProps<TValue> = DiscriminatedRenderProps<React.ReactNode | RenderPropFn<TValue>> & {
	asChild?: boolean;
	promise: Promise<TValue>;
};

function AwaitInner<TValue>(props: AwaitInnerProps<TValue>) {
	const { asChild, children, promise, render } = props;

	const result = use(promise);

	const Component = asChild ? Slot : ReactFragment;

	const slotProps = asChild && { promise, result };

	const selectedChildren = typeof children === "function" ? children : render;

	const resolvedChildren = isFunction(selectedChildren) ? selectedChildren(result) : selectedChildren;

	return <Component {...slotProps}>{resolvedChildren}</Component>;
}
