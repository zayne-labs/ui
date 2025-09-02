"use client";

import { dataAttr } from "@zayne-labs/toolkit-core";
import type { PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction, type SelectorFn } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { useMemo } from "react";
import { Slot } from "@/components/common/slot";
import {
	DropZonePropGettersContextProvider,
	DropZoneStoreContextProvider,
	FileItemContextProvider,
	type FileItemContextType,
	useDropZoneStoreContext,
	useFileItemContext,
	usePropGettersContext,
} from "./drop-zone-context";
import type { DropZoneStore } from "./drop-zone-store";
import type { PartInputProps, UseDropZoneProps } from "./types";
import { useDropZone } from "./use-drop-zone";

export type DropZoneRootProps = UseDropZoneProps & { children: React.ReactNode };

export function DropZoneRoot(props: DropZoneRootProps) {
	const { children, ...restOfProps } = props;

	const dropZone = useDropZone(restOfProps);

	return (
		<DropZoneStoreContextProvider store={dropZone.storeApi}>
			<DropZonePropGettersContextProvider value={dropZone.propGetters}>
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

type DropZoneContainerProps = PartInputProps["container"] & { asChild?: boolean };

export function DropZoneContainer<TElement extends React.ElementType = "div">(
	props: PolymorphicProps<TElement, DropZoneContainerProps>
) {
	const { as: Element = "div", asChild, ...restOfProps } = props;

	const propGetters = usePropGettersContext();

	const isDraggingOver = useDropZoneStoreContext((store) => store.isDraggingOver);

	const Component = asChild ? Slot.Root : Element;

	return (
		<Component
			{...propGetters.getContainerProps({ "data-drag-over": dataAttr(isDraggingOver), ...restOfProps })}
		/>
	);
}

type DropZoneInputProps = PartInputProps["input"] & { asChild?: boolean };

export function DropZoneInput(props: DropZoneInputProps) {
	const { asChild, ...restOfProps } = props;

	const propGetters = usePropGettersContext();

	const isDraggingOver = useDropZoneStoreContext((store) => store.isDraggingOver);

	const Component = asChild ? Slot.Root : "input";

	return (
		<Component
			{...propGetters.getInputProps({ "data-drag-over": dataAttr(isDraggingOver), ...restOfProps })}
		/>
	);
}

type DropZoneAreaProps<TSlice> = {
	children: React.ReactNode | ((props: TSlice) => React.ReactNode);
	classNames?: Partial<Record<Extract<keyof PartInputProps, "container" | "input">, string>>;
	extraProps?: Pick<PartInputProps, "container" | "input">;
	selector?: SelectorFn<DropZoneStore, TSlice>;
};

export function DropZoneArea<TSlice = DropZoneStore>(props: DropZoneAreaProps<TSlice>) {
	const { children, classNames, extraProps, selector } = props;

	return (
		<DropZoneContainer {...extraProps?.container} className={classNames?.container}>
			<DropZoneInput {...extraProps?.input} className={classNames?.input} />

			<DropZoneContext selector={selector}>{children}</DropZoneContext>
		</DropZoneContainer>
	);
}

type DropZoneTriggerProps = PartInputProps["trigger"] & { asChild?: boolean };

export function DropZoneTrigger(props: DropZoneTriggerProps) {
	const { asChild, ...restOfProps } = props;

	const propGetters = usePropGettersContext();

	const Component = asChild ? Slot.Root : "button";

	return <Component {...propGetters.getTriggerProps(restOfProps)} />;
}

type DropZoneFileGroupProps = Omit<PartInputProps["fileGroup"], "children"> & {
	asChild?: boolean;
	children:
		| React.ReactNode
		| ((props: Pick<DropZoneStore, "actions" | "fileStateArray">) => React.ReactNode);
	forceMount?: boolean;
};

export function DropZoneFileGroup(props: DropZoneFileGroupProps) {
	const { asChild, children, forceMount = false, ...restOfProps } = props;

	const fileStateArray = useDropZoneStoreContext((store) => store.fileStateArray);
	const actions = useDropZoneStoreContext((store) => store.actions);

	const propGetters = usePropGettersContext();

	const hasFiles = fileStateArray.length > 0;

	const shouldRender = forceMount || hasFiles;

	if (!shouldRender) {
		return null;
	}

	const resolvedChildren = isFunction(children) ? children({ actions, fileStateArray }) : children;

	const Component = asChild ? Slot.Root : "ul";

	return (
		<Component
			{...propGetters.getFileGroupProps({
				"data-state": hasFiles ? "active" : "inactive",
				...restOfProps,
			})}
		>
			{resolvedChildren}
		</Component>
	);
}

type DropZoneFileItemProps = Partial<FileItemContextType>
	& PartInputProps["fileItem"] & { asChild?: boolean };

export function DropZoneFileItem(props: DropZoneFileItemProps) {
	const { asChild, fileItemOrID, ...restOfProps } = props;

	const propGetters = usePropGettersContext();

	const Component = asChild ? Slot.Root : "li";

	const contextValue = useMemo(() => ({ fileItemOrID }), [fileItemOrID]);

	return (
		<FileItemContextProvider value={contextValue}>
			<Component {...propGetters.getFileItemProps(restOfProps)} />
		</FileItemContextProvider>
	);
}

type DropZoneFileItemDeleteProps = PartInputProps["fileItemDelete"] & { asChild?: boolean };

export function DropZoneFileItemDelete(props: DropZoneFileItemDeleteProps) {
	const { asChild, fileItemOrID, ...restOfProps } = props;

	const propGetters = usePropGettersContext();

	const fileItemContextValue = useFileItemContext();

	const Component = asChild ? Slot.Root : "button";

	return (
		<Component
			{...propGetters.getFileItemDeleteProps({
				fileItemOrID: fileItemOrID ?? fileItemContextValue?.fileItemOrID,
				...restOfProps,
			})}
		/>
	);
}

type DropZoneErrorGroupProps = {
	children: React.ReactNode | ((props: Pick<DropZoneStore, "actions" | "errors">) => React.ReactNode);
	forceMount?: boolean;
};

export function DropZoneErrorGroup(props: DropZoneErrorGroupProps) {
	const { children, forceMount = false } = props;

	const errors = useDropZoneStoreContext((store) => store.errors);
	const actions = useDropZoneStoreContext((store) => store.actions);

	const hasErrors = errors.length > 0;

	const shouldRender = forceMount || hasErrors;

	if (!shouldRender) {
		return null;
	}

	const resolvedChildren = isFunction(children) ? children({ actions, errors }) : children;

	return resolvedChildren;
}
