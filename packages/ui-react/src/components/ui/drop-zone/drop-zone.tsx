"use client";

import * as React from "react";

import { Slot } from "@/components/common";
import { type GetSlotComponentProps, getSlotMap, withSlotNameAndSymbol } from "@/lib/utils/getSlotMap";
import type { DiscriminatedRenderProps, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { isArray, isFunction } from "@zayne-labs/toolkit-type-helpers";
import { Fragment as ReactFragment, isValidElement } from "react";
import { DropZoneContextProvider, useDropZoneContext } from "./drop-context";
import {
	type ContainerProps,
	type InputProps,
	type UseDropZoneProps,
	type UseDropZoneResult,
	useDropZone,
} from "./use-drop-zone";

export type DropZoneRenderPropType = DiscriminatedRenderProps<
	React.ReactNode | ((props: UseDropZoneResult) => React.ReactNode)
>;

export type DropZoneRootProps = DropZoneRenderPropType
	& UseDropZoneProps & {
		/**
		 * Controls whether to include internal elements (root and input) or not.
		 */
		withInternalElements?: boolean;
	};

export function DropZoneRoot(props: DropZoneRootProps) {
	const { children, render, withInternalElements = true, ...restOfProps } = props;

	const dropZone = useDropZone(restOfProps);

	const ContainerComponent = withInternalElements ? DropZoneContainer : ReactFragment;
	const InputComponent = withInternalElements ? DropZoneInput : ReactFragment;

	const selectedChildren = children ?? render;

	const resolvedChildren = isFunction(selectedChildren) ? selectedChildren(dropZone) : selectedChildren;

	const couldChildrenContainSlots =
		isArray(resolvedChildren)
		|| (isValidElement(resolvedChildren) && resolvedChildren.type === ReactFragment);

	const slots =
		withInternalElements && couldChildrenContainSlots
			? getSlotMap<SlotComponentProps>(resolvedChildren)
			: ({ default: resolvedChildren } as ReturnType<typeof getSlotMap<SlotComponentProps>>);

	return (
		<DropZoneContextProvider value={dropZone}>
			<ContainerComponent>
				<InputComponent />

				{slots.default}
			</ContainerComponent>

			{slots.preview}
		</DropZoneContextProvider>
	);
}

type DropZoneInputProps = InputProps & { asChild?: boolean };

export function DropZoneInput(props: DropZoneInputProps) {
	const { asChild, ...restOfProps } = props;

	const dropZoneContext = useDropZoneContext();

	const Component = asChild ? Slot : "input";

	return <Component {...dropZoneContext.getInputProps(restOfProps)} />;
}

type DropZoneContainerProps = ContainerProps & { asChild?: boolean };

export function DropZoneContainer<TElement extends React.ElementType = "div">(
	props: PolymorphicProps<TElement, DropZoneContainerProps>
) {
	const { as: Element = "div", asChild, ...restOfProps } = props;

	const dropZoneContext = useDropZoneContext();

	const Component = asChild ? Slot : Element;

	return <Component {...dropZoneContext.getContainerProps(restOfProps)} />;
}

type SlotComponentProps = GetSlotComponentProps<
	"preview",
	React.ReactNode | ((props: UseDropZoneResult) => React.ReactNode)
>;

export const DropZoneImagePreview = withSlotNameAndSymbol<SlotComponentProps>("preview", (props) => {
	const { children } = props;

	const dropZoneContext = useDropZoneContext();

	return isFunction(children) ? children(dropZoneContext) : children;
});
