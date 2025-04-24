"use client";

import * as React from "react";

import {
	type GetSlotComponentProps,
	getSlotMap,
	withSlotNameAndSymbol,
} from "@zayne-labs/toolkit-react/utils";
import { isArray } from "@zayne-labs/toolkit-type-helpers";
import { Fragment as ReactFragment, isValidElement } from "react";
import { type UseDropZoneProps, useDropZone } from "./use-drop-zone";

type DropZoneProps = UseDropZoneProps & {
	/**
	 * Controls whether to include internal elements (root and input) or not.
	 */
	withInternalElements?: boolean;
};

export function DropZoneRoot(props: DropZoneProps) {
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
		condition: withInternalElements && couldChildrenContainSlots,
	});

	return (
		<>
			<RootComponent {...rootComponentProps}>
				<InputComponent {...inputComponentProps} />

				{slots.default}
			</RootComponent>

			{slots.preview}
		</>
	);
}

type SlotComponentProps = GetSlotComponentProps<"preview">;

export const DropZoneImagePreview = withSlotNameAndSymbol<SlotComponentProps>("preview");
