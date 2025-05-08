"use client";

import * as React from "react";

import { type GetSlotComponentProps, getSlotMap, withSlotNameAndSymbol } from "@/lib/utils/getSlotMap";
import { isArray, isFunction } from "@zayne-labs/toolkit-type-helpers";
import { Fragment as ReactFragment, isValidElement } from "react";
import { type DropZoneProps, type RenderProps, useDropZone } from "./use-drop-zone";

type DropZoneWrapperProps = DropZoneProps & {
	/**
	 * Controls whether to include internal elements (root and input) or not.
	 */
	withInternalElements?: boolean;
};

export function DropZoneRoot(props: DropZoneWrapperProps) {
	const { withInternalElements = true, ...restOfProps } = props;

	const api = useDropZone(restOfProps);

	const RootComponent = withInternalElements ? "div" : ReactFragment;
	const InputComponent = withInternalElements ? "input" : ReactFragment;

	const rootComponentProps = RootComponent === "div" && api.getRootProps();
	const inputComponentProps = InputComponent === "input" && api.getInputProps();

	const resolvedChildren = api.getResolvedChildren();

	/**
	 * Whether the children could contain slots.
	 */
	const couldChildrenContainSlots =
		isArray(resolvedChildren)
		|| (isValidElement(resolvedChildren) && resolvedChildren.type === ReactFragment);

	const slots = getSlotMap<SlotComponentProps>(resolvedChildren, {
		// == This is to prevent the slots from being searched for if the the condition is not met
		// == Instead it will render the children as is from `slots.default`
		condition: withInternalElements || couldChildrenContainSlots,
	});

	return (
		<>
			<RootComponent {...rootComponentProps}>
				<InputComponent {...inputComponentProps} />

				{slots.default}
			</RootComponent>

			{isFunction(slots.preview) ? slots.preview(api.getRenderProps()) : slots.preview}
		</>
	);
}

type SlotComponentProps = GetSlotComponentProps<
	"preview",
	React.ReactNode | ((props: RenderProps) => React.ReactNode)
>;

export const DropZoneImagePreview = withSlotNameAndSymbol<SlotComponentProps>("preview");
