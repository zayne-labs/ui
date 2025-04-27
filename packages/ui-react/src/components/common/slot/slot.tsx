import * as React from "react";

import { type InferProps, composeRefs, mergeProps } from "@zayne-labs/toolkit-react/utils";
import { isArray } from "@zayne-labs/toolkit-type-helpers";
import { Children, Fragment as ReactFragment, cloneElement, isValidElement } from "react";

type SlotProps = InferProps<HTMLElement>;

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * ----------------------------------------------------------------------------------------------- */

export function Slottable({ children }: Pick<SlotProps, "children">) {
	return children;
}

const isSlottable = (child: React.ReactNode): child is React.ReactElement => {
	return isValidElement(child) && child.type === Slottable;
};

/* -------------------------------------------------------------------------------------------------
 * Slot
 * ----------------------------------------------------------------------------------------------- */

export function Slot(props: SlotProps) {
	const { children, ...restOfSlotProps } = props;

	const childrenArray = isArray<React.ReactNode>(children) ? children : [children];
	const slottable = childrenArray.find((element) => isSlottable(element));

	if (slottable) {
		// == The new element to render is the one passed as a child of `Slottable`
		const newElement = (slottable.props as SlotProps).children;

		if (Children.count(newElement) > 1) {
			return Children.only(null);
		}

		const newElementChildren = childrenArray.map((child) => {
			if (child === slottable) {
				// == Because the new element will be the one rendered, we are only interested in grabbing its children (`newElement.props.children`)
				return isValidElement<SlotProps>(newElement) && newElement.props.children;
			}

			return child;
		});

		return (
			<SlotClone {...restOfSlotProps}>
				{isValidElement(newElement) && cloneElement(newElement, undefined, newElementChildren)}
			</SlotClone>
		);
	}

	return <SlotClone {...restOfSlotProps}>{children}</SlotClone>;
}

type SlotCloneProps = {
	children: React.ReactNode;
	ref?: React.RefObject<HTMLElement>;
};

type UnknownProps = Record<string, unknown>;

function SlotClone(props: SlotCloneProps) {
	const { children, ref: forwardedRef, ...restOfSlotProps } = props;

	if (!isValidElement<UnknownProps>(children)) {
		return Children.count(children) > 1 ? Children.only(null) : null;
	}

	const childRef = (children.props.ref
		?? (children as unknown as UnknownProps).ref) as React.Ref<HTMLElement>;

	const mergedRef = forwardedRef ? composeRefs(forwardedRef, childRef) : childRef;

	const clonedProps = {
		...mergeProps(restOfSlotProps, children.props),
		...(children.type !== ReactFragment && { ref: mergedRef }),
	};

	return cloneElement(children, clonedProps);
}
