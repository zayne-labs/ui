import { composeRefs, type InferProps, mergeProps } from "@zayne-labs/toolkit-react/utils";
import { isArray, type UnknownObject } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { Children, cloneElement, isValidElement, Fragment as ReactFragment } from "react";

type SlotProps = InferProps<HTMLElement> & { ref?: React.Ref<HTMLElement> };

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

	if (Children.count(newElement) > 1) {
		return Children.only(null);
	}

	const resolvedNewElement = isArray(newElement) ? newElement[0] : newElement;

	if (!isValidElement(resolvedNewElement)) {
		return null;
	}

	const newChildren = childrenArray.map((child) => {
		if (child === slottable) {
			// == Because the new element will be the one rendered, we are only interested in grabbing its children (`newElement.props.children`)
			return (resolvedNewElement.props as SlotProps).children;
		}

		return child;
	});

	return (
		<SlotClone {...restOfSlotProps}>
			{cloneElement(resolvedNewElement, undefined, newChildren)}
		</SlotClone>
	);
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
type SlotCloneProps = Pick<SlotProps, "children" | "ref">;

function SlotClone(props: SlotCloneProps) {
	const { children, ref: forwardedRef, ...restOfSlotProps } = props;

	if (Children.count(children) > 1) {
		return Children.only(null);
	}

	const resolvedChildren = isArray(children) ? children[0] : children;

	if (!isValidElement<UnknownObject>(resolvedChildren)) {
		return null;
	}

	const childRef = (resolvedChildren.props.ref
		?? (resolvedChildren as unknown as UnknownObject).ref) as React.Ref<HTMLElement>;

	const ref = composeRefs(forwardedRef, childRef);

	const clonedProps = {
		...mergeProps(restOfSlotProps, resolvedChildren.props),
		...(resolvedChildren.type !== ReactFragment && { ref }),
	};

	return cloneElement(resolvedChildren, clonedProps);
}
