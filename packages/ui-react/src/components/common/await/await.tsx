"use client";

import * as React from "react";

import { type GetSlotComponentProps, getSlotMap, withSlotNameAndSymbol } from "@/lib/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import { Fragment as ReactFragment, Suspense, use, useMemo } from "react";
import { ErrorBoundary, type ErrorBoundaryProps, useErrorBoundaryContext } from "../error-boundary";
import { Slot } from "../slot";
import type { SuspenseWithBoundaryProps } from "../suspense-with-boundary";
import { AwaitContextProvider, useAwaitContext } from "./await-context";

type RenderPropFn<TValue> = (result: TValue) => React.ReactNode;

type ChildrenType<TValue> = React.ReactNode | RenderPropFn<TValue>;

type AwaitRootProps<TValue> = Pick<SuspenseWithBoundaryProps, "errorFallback" | "fallback"> & {
	asChild?: boolean;
	children: ChildrenType<TValue>;
	promise: Promise<TValue>;
	wrapperVariant?: "all" | "none" | "only-errorBoundary" | "only-suspense";
};

export function AwaitRoot<TValue>(props: AwaitRootProps<TValue>) {
	const { children, errorFallback, fallback, wrapperVariant = "all", ...restOfProps } = props;

	const withErrorBoundary = wrapperVariant === "all" || wrapperVariant === "only-errorBoundary";
	const withSuspense = wrapperVariant === "all" || wrapperVariant === "only-suspense";

	const WithErrorBoundary = withErrorBoundary ? ErrorBoundary : ReactFragment;
	const WithSuspense = withSuspense ? Suspense : ReactFragment;

	const slots = !isFunction(children)
		? getSlotMap<SlotComponentProps>(children)
		: ({ default: children } as unknown as ReturnType<typeof getSlotMap<SlotComponentProps>>);

	const selectedPendingFallback = slots.pending ?? fallback;
	const selectedErrorFallback = slots.error ?? errorFallback;

	return (
		<WithErrorBoundary {...(Boolean(selectedErrorFallback) && { fallback: selectedErrorFallback })}>
			<WithSuspense {...(Boolean(selectedPendingFallback) && { fallback: selectedPendingFallback })}>
				<AwaitRootInner {...restOfProps}>{slots.default}</AwaitRootInner>
			</WithSuspense>
		</WithErrorBoundary>
	);
}

type AwaitRootInnerProps<TValue> = Pick<AwaitRootProps<TValue>, "asChild" | "children" | "promise">;

function AwaitRootInner<TValue>(props: AwaitRootInnerProps<TValue>) {
	const { asChild, children, promise } = props;

	const result = use(promise);

	const resolvedChildren = isFunction(children) ? children(result) : children;

	const Component = asChild ? Slot.Root : ReactFragment;

	const contextValue = useMemo(() => ({ promise, result }), [promise, result]);

	return (
		<AwaitContextProvider value={contextValue}>
			<Component {...(asChild && contextValue)}>{resolvedChildren}</Component>
		</AwaitContextProvider>
	);
}

type SlotComponentProps = AwaitErrorProps | AwaitPendingProps | AwaitSuccessProps;

type AwaitSuccessProps<TValue = unknown> = GetSlotComponentProps<"default", ChildrenType<TValue>>;

export function AwaitSuccess<TPromiseOrValue, TValue = Awaited<TPromiseOrValue>>(
	props: Pick<AwaitSuccessProps<TValue>, "children">
) {
	if (isFunction(props.children)) {
		// eslint-disable-next-line react-hooks/rules-of-hooks -- This hook only uses `use` under the hood so this is safe
		const { result } = useAwaitContext<TValue>();

		return props.children(result);
	}

	return props.children;
}

Object.assign(AwaitSuccess, withSlotNameAndSymbol<AwaitSuccessProps>("default"));

type AwaitPendingProps = GetSlotComponentProps<"pending", React.SuspenseProps["fallback"]>;

export const AwaitPending = withSlotNameAndSymbol<AwaitPendingProps>("pending");

type AwaitErrorProps = GetSlotComponentProps<"error", ErrorBoundaryProps["fallback"]>;

export const AwaitError = withSlotNameAndSymbol<AwaitErrorProps, { asChild?: boolean }>(
	"error",
	(props) => {
		const { asChild, children } = props;

		const errorBoundaryContext = useErrorBoundaryContext();

		const Component = asChild ? Slot.Root : ReactFragment;

		const resolvedChildren = isFunction(children) ? children(errorBoundaryContext) : children;

		return <Component {...(asChild && errorBoundaryContext)}>{resolvedChildren}</Component>;
	}
);
