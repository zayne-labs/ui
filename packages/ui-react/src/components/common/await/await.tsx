"use client";

import {
	getSlotMap,
	withSlotNameAndSymbol,
	type GetSlotComponentProps,
} from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import { Fragment as ReactFragment, Suspense, use, useMemo } from "react";
import { ErrorBoundary, useErrorBoundaryContext, type ErrorBoundaryProps } from "../error-boundary";
import { Slot } from "../slot";
import type { SuspenseWithBoundaryProps } from "../suspense-with-boundary";
import { AwaitContextProvider, useAwaitContext } from "./await-context";

type RenderPropFn<TValue> = (result: TValue) => React.ReactNode;

type ChildrenType<TValue> = React.ReactNode | RenderPropFn<TValue>;

export type AwaitRootProps<TValue> = Omit<SuspenseWithBoundaryProps, "children"> & {
	asChild?: boolean;
	children: ChildrenType<TValue>;
	promise: Promise<TValue>;
	withErrorBoundary?: boolean;
	withSuspense?: boolean;
};

export function AwaitRoot<TValue>(props: AwaitRootProps<TValue>) {
	const {
		children,
		errorFallback,
		fallback,
		onError,
		onErrorReset,
		withErrorBoundary = true,
		withSuspense = true,
		...restOfProps
	} = props;

	const WithErrorBoundary = withErrorBoundary ? ErrorBoundary : ReactFragment;
	const WithSuspense = withSuspense ? Suspense : ReactFragment;

	const slots =
		!isFunction(children) ?
			getSlotMap<SlotComponentProps>(children)
		:	({ default: children } as unknown as ReturnType<typeof getSlotMap<SlotComponentProps>>);

	const resolvedPendingFallback = slots.pending ?? fallback;
	const resolvedErrorFallback = slots.error ?? errorFallback;

	return (
		<WithErrorBoundary
			{...(withErrorBoundary && {
				fallback: resolvedErrorFallback,
				onError,
				onErrorReset,
			})}
		>
			<WithSuspense {...(withSuspense && { fallback: resolvedPendingFallback })}>
				<AwaitRootImpl {...restOfProps}>{slots.default}</AwaitRootImpl>
			</WithSuspense>
		</WithErrorBoundary>
	);
}

type AwaitRootImplProps<TValue> = Pick<AwaitRootProps<TValue>, "asChild" | "children" | "promise">;

function AwaitRootImpl<TValue>(props: AwaitRootImplProps<TValue>) {
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
	const { children } = props;

	if (isFunction(children)) {
		// eslint-disable-next-line react-x/rules-of-hooks, react-hooks/hooks -- This hook only uses `use` under the hood so this is safe
		const { result } = useAwaitContext<TValue>();

		return children(result);
	}

	return children;
}

Object.assign(AwaitSuccess, withSlotNameAndSymbol<AwaitSuccessProps>("default"));

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

type AwaitPendingProps = GetSlotComponentProps<"pending", React.SuspenseProps["fallback"]>;

export const AwaitPending = withSlotNameAndSymbol<AwaitPendingProps>("pending");
