"use client";

import { useShallowComparedSelector } from "@zayne-labs/toolkit-react";
import type { PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction, type SelectorFn } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { Slot } from "@/components/common";
import {
	DropZonePropGettersContextProvider,
	DropZoneStoreContextProvider,
	useDropZoneStoreContext,
	usePropGettersContext,
} from "./drop-zone-context";
import type { DropZoneStore } from "./drop-zone-store";
import { type ExtraProps, type UseDropZoneProps, useDropZone } from "./use-drop-zone";

export type DropZoneRootProps = UseDropZoneProps & { children: React.ReactNode };

export function DropZoneRoot(props: DropZoneRootProps) {
	const { children, ...restOfProps } = props;

	const { propGetters, storeApi } = useDropZone(restOfProps);

	return (
		<DropZoneStoreContextProvider store={storeApi}>
			<DropZonePropGettersContextProvider value={propGetters}>
				{children}
			</DropZonePropGettersContextProvider>
		</DropZoneStoreContextProvider>
	);
}

export type DropZoneContextProps<TSlice> = {
	children: React.ReactNode | ((props: TSlice) => React.ReactNode);
	selector?: SelectorFn<DropZoneStore, TSlice>;
};

export function DropZoneContext<TSlice = DropZoneStore>(props: DropZoneContextProps<TSlice>) {
	const { children, selector } = props;

	const dropZoneCtx = useDropZoneStoreContext(selector);

	const resolvedChildren = isFunction(children) ? children(dropZoneCtx) : children;

	return resolvedChildren;
}

type DropZoneContainerProps = ExtraProps["container"] & { asChild?: boolean };

export function DropZoneContainer<TElement extends React.ElementType = "div">(
	props: PolymorphicProps<TElement, DropZoneContainerProps>
) {
	const { as: Element = "div", asChild, ...restOfProps } = props;

	const propGetters = usePropGettersContext();

	const Component = asChild ? Slot.Root : Element;

	return <Component {...propGetters.getContainerProps(restOfProps)} />;
}

type DropZoneInputProps = ExtraProps["input"] & { asChild?: boolean };

export function DropZoneInput(props: DropZoneInputProps) {
	const { asChild, ...restOfProps } = props;

	const propGetters = usePropGettersContext();

	const Component = asChild ? Slot.Root : "input";

	return <Component {...propGetters.getInputProps(restOfProps)} />;
}

type DropZoneAreaProps<TSlice> = {
	children: React.ReactNode | ((props: TSlice) => React.ReactNode);
	extraProps?: Pick<ExtraProps, "container" | "input">;
	selector?: SelectorFn<DropZoneStore, TSlice>;
};

export function DropZoneArea<TSlice = DropZoneStore>(props: DropZoneAreaProps<TSlice>) {
	const { children, extraProps, selector } = props;

	return (
		<DropZoneContainer {...extraProps?.container}>
			<DropZoneInput {...extraProps?.input} />

			<DropZoneContext selector={selector}>{children}</DropZoneContext>
		</DropZoneContainer>
	);
}

type DropZoneTriggerProps = ExtraProps["trigger"] & { asChild?: boolean };

export function DropZoneTrigger(props: DropZoneTriggerProps) {
	const { asChild, ...restOfProps } = props;

	const propGetters = usePropGettersContext();

	const Component = asChild ? Slot.Root : "button";

	return <Component {...propGetters.getTriggerProps(restOfProps)} />;
}

type DropZoneFilePreviewProps = {
	children:
		| React.ReactNode
		| ((props: Pick<DropZoneStore, "actions" | "fileStateArray">) => React.ReactNode);
};

export function DropZoneFilePreview(props: DropZoneFilePreviewProps) {
	const { children } = props;

	const filePreviewCtx = useDropZoneStoreContext(
		useShallowComparedSelector(({ actions, fileStateArray }) => ({ actions, fileStateArray }))
	);

	if (filePreviewCtx.fileStateArray.length === 0) return;

	const resolvedChildren = isFunction(children) ? children(filePreviewCtx) : children;

	return resolvedChildren;
}

type DropZoneErrorViewProps = {
	children: React.ReactNode | ((props: Pick<DropZoneStore, "actions" | "errors">) => React.ReactNode);
};

export function DropZoneErrorView(props: DropZoneErrorViewProps) {
	const { children } = props;

	const errorViewCtx = useDropZoneStoreContext(
		useShallowComparedSelector(({ actions, errors }) => ({ actions, errors }))
	);

	if (errorViewCtx.errors.length === 0) return;

	const resolvedChildren = isFunction(children) ? children(errorViewCtx) : children;

	return resolvedChildren;
}
