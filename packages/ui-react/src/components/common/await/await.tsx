"use client";

import * as React from "react";

import type { DiscriminatedRenderProps } from "@zayne-labs/toolkit-react/utils";
import { Fragment as ReactFragment, Suspense, use } from "react";
import { ErrorBoundary } from "../error-boundary";
import { Slot } from "../slot";
import type { SuspenseWithBoundaryProps } from "../suspense-with-boundary";

type RenderPropFn<TValue> = (result: TValue) => React.ReactNode;

type AwaitProps<TValue> = AwaitInnerProps<TValue>
	& Pick<SuspenseWithBoundaryProps, "errorFallback" | "fallback"> & {
		asChild?: boolean;
		wrapperVariant?: "none" | "only-boundary" | "only-suspense" | "suspense-and-boundary";
	};

export function Await<TValue>(props: AwaitProps<TValue>) {
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

export type AwaitInnerProps<TValue> = DiscriminatedRenderProps<React.ReactNode | RenderPropFn<TValue>> & {
	asChild?: boolean;
	promise: Promise<TValue>;
};

function AwaitInner<TValue>(props: AwaitInnerProps<TValue>) {
	const { asChild, children, promise, render } = props;

	const result = use(promise);

	const Component = asChild ? Slot : ReactFragment;

	const componentProps = asChild && { promise, result };

	let resolvedChildren: React.ReactNode;

	switch (true) {
		case typeof children === "function": {
			resolvedChildren = children(result);
			break;
		}
		case typeof render === "function": {
			resolvedChildren = render(result);
			break;
		}
		default: {
			resolvedChildren = children ?? render;
			break;
		}
	}

	return <Component {...componentProps}>{resolvedChildren}</Component>;
}
