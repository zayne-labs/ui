import { composeRefs, type InferProps, mergeProps } from "@zayne-labs/toolkit-react/utils";
import { isArray, type UnknownObject } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { Children, cloneElement, isValidElement, Fragment as ReactFragment } from "react";

type SlotProps = InferProps<HTMLElement>;

/* -------------------------------------------------------------------------------------------------
 * Slot
 * ----------------------------------------------------------------------------------------------- */

export function SlotRoot(props: SlotProps) {
	const { children, ...restOfSlotProps } = props;

	const childrenArray = isArray<React.ReactNode>(children) ? children : [children];

	const slottable = childrenArray.find((element) => isSlottable(element));

	if (!slottable) {
		return <SlotClone {...restOfSlotProps}>{children}</SlotClone>;
	}

	if (!isValidElement<SlotProps>(slottable)) {
		return null;
	}

	// == The new element to render is the one passed as a child of `Slot.Slottable`
	const newElement = slottable.props.children;

	if (!isValidElement(newElement)) {
		return null;
	}

	if (Children.count(newElement) > 1) {
		return Children.only(null);
	}

	const newChildren = childrenArray.map((child) => {
		if (child === slottable) {
			// == Because the new element will be the one rendered, we are only interested in grabbing its children (`newElement.props.children`)
			return (newElement.props as SlotProps).children;
		}

		return child;
	});

	return <SlotClone {...restOfSlotProps}>{cloneElement(newElement, undefined, newChildren)}</SlotClone>;
}

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * ----------------------------------------------------------------------------------------------- */

export function SlotSlottable({ children }: Pick<SlotProps, "children">) {
	return children;
}

const isSlottable = (child: React.ReactNode): child is React.ReactElement => {
	return isValidElement(child) && child.type === SlotSlottable;
};

/* -------------------------------------------------------------------------------------------------
 * SlotClone
 * ----------------------------------------------------------------------------------------------- */
type SlotCloneProps = {
	children: React.ReactNode;
	ref?: React.RefObject<HTMLElement>;
};

function SlotClone(props: SlotCloneProps) {
	const { children, ref: forwardedRef, ...restOfSlotProps } = props;

	const resolvedChild = children;

	if (!isValidElement<UnknownObject>(resolvedChild)) {
		return null;
	}

	if (Children.count(resolvedChild) > 1) {
		return Children.only(null);
	}

	const childRef = (resolvedChild.props.ref
		?? (resolvedChild as unknown as UnknownObject).ref) as React.Ref<HTMLElement>;

	const ref = forwardedRef ? composeRefs(forwardedRef, childRef) : childRef;

	const clonedProps = {
		...mergeProps(restOfSlotProps, resolvedChild.props),
		...(resolvedChild.type !== ReactFragment && { ref }),
	};

	return cloneElement(resolvedChild, clonedProps);
}
