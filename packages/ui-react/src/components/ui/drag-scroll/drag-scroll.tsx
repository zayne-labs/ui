"use client";

import { useCompareSelector } from "@zayne-labs/toolkit-react";
import type { PolymorphicPropsStrict } from "@zayne-labs/toolkit-react/utils";
import { isFunction, type SelectorFn } from "@zayne-labs/toolkit-type-helpers";
import { useMemo } from "react";
import { Slot } from "@/components/common/slot";
import {
	DragScrollRootContextProvider,
	DragScrollStoreContextProvider,
	useDragScrollRootContext,
	useDragScrollStoreContext,
	type DragScrollRootContextType,
} from "./drag-scroll-context";
import type { DragScrollStore, PartInputProps, UseDragScrollProps } from "./types";
import { useDragScroll } from "./use-drag-scroll";

/* eslint-disable perfectionist/sort-intersection-types -- I need non-standard props to come first */

export type DragScrollRootProps = UseDragScrollProps & {
	asChild?: boolean;
	children: React.ReactNode;
} & PartInputProps["root"];

export function DragScrollRoot<TElement extends React.ElementType = "div">(
	props: PolymorphicPropsStrict<TElement, DragScrollRootProps>
) {
	const { as: Element = "div", asChild, children, ...restOfProps } = props;

	const { containerRef, disableInternalStateSubscription, propGetters, storeApi } =
		useDragScroll(restOfProps);

	const rootContextValue = useMemo<DragScrollRootContextType>(
		() =>
			({
				containerRef,
				disableInternalStateSubscription,
				propGetters,
			}) satisfies DragScrollRootContextType,
		[containerRef, disableInternalStateSubscription, propGetters]
	);

	const Component = asChild ? Slot.Root : Element;

	return (
		<DragScrollStoreContextProvider store={storeApi}>
			<DragScrollRootContextProvider value={rootContextValue}>
				<Component {...propGetters.getRootProps(restOfProps)}>{children}</Component>
			</DragScrollRootContextProvider>
		</DragScrollStoreContextProvider>
	);
}

export type DragScrollContextProps<TSlice> = {
	children: React.ReactNode | ((context: TSlice) => React.ReactNode);
	selector?: SelectorFn<DragScrollStore, TSlice>;
};

export function DragScrollContext<TSlice = DragScrollStore>(props: DragScrollContextProps<TSlice>) {
	const { children, selector } = props;

	const dragScrollCtx = useDragScrollStoreContext(useCompareSelector(selector));

	const resolvedChildren = isFunction(children) ? children(dragScrollCtx) : children;

	return resolvedChildren;
}

export type DragScrollContainerProps = {
	asChild?: boolean;
} & PartInputProps["container"];

export function DragScrollContainer<TElement extends React.ElementType = "ul">(
	props: PolymorphicPropsStrict<TElement, DragScrollContainerProps>
) {
	const { as: Element = "ul", asChild, ...restOfProps } = props;

	const { propGetters } = useDragScrollRootContext();

	const Component = asChild ? Slot.Root : Element;

	return <Component {...propGetters.getContainerProps(restOfProps)} />;
}

export type DragScrollItemProps = {
	asChild?: boolean;
} & PartInputProps["item"];

export function DragScrollItem<TElement extends React.ElementType = "li">(
	props: PolymorphicPropsStrict<TElement, DragScrollItemProps>
) {
	const { as: Element = "li", asChild, ...restOfProps } = props;

	const { propGetters } = useDragScrollRootContext();

	const Component = asChild ? Slot.Root : Element;

	return <Component {...propGetters.getItemProps(restOfProps)} />;
}

export type DragScrollPrevProps = {
	asChild?: boolean;
} & PartInputProps["prevButton"];

export function DragScrollPrev(props: DragScrollPrevProps) {
	const { asChild, ...restOfProps } = props;

	const { propGetters } = useDragScrollRootContext();

	const Component = asChild ? Slot.Root : "button";

	return <Component {...propGetters.getPrevButtonProps(restOfProps)} />;
}

export type DragScrollNextProps = {
	asChild?: boolean;
} & PartInputProps["nextButton"];

export function DragScrollNext(props: DragScrollNextProps) {
	const { asChild, ...restOfProps } = props;

	const { propGetters } = useDragScrollRootContext();

	const Component = asChild ? Slot.Root : "button";

	return <Component {...propGetters.getNextButtonProps(restOfProps)} />;
}

/* eslint-enable perfectionist/sort-intersection-types -- I need non-standard props to come first */
