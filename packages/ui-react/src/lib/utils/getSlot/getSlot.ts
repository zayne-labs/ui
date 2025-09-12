import { toArray } from "@zayne-labs/toolkit-core";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import {
	type AnyFunction,
	AssertionError,
	type Prettify,
	type UnknownObject,
	isArray,
	isFunction,
} from "@zayne-labs/toolkit-type-helpers";
import { Fragment as ReactFragment, isValidElement } from "react";

export type FunctionalComponent<TProps extends UnknownObject = never> = React.FunctionComponent<TProps>;

const isWithSlotSymbol = <TFunction extends AnyFunction>(
	component: TFunction
): component is Record<"slotSymbol", unknown> & TFunction => {
	return "slotSymbol" in component && Boolean(component.slotSymbol);
};

const isWithSlotReference = <TFunction extends AnyFunction>(
	component: TFunction
): component is Record<"slotReference", unknown> & TFunction => {
	return "slotReference" in component && Boolean(component.slotReference);
};
/**
 * @description Checks if a react child (within the children array) matches the provided SlotComponent using multiple matching strategies:
 * 1. Matches by slot symbol property
 * 2. Matches by component name
 */

export const matchesSlotComponent = (child: React.ReactNode, SlotComponent: FunctionalComponent) => {
	if (!isValidElement(child) || !isFunction(child.type)) {
		return false;
	}

	const resolvedChildType =
		isWithSlotReference(child.type) ? (child.type.slotReference as FunctionalComponent) : child.type;

	const hasMatchingSlotSymbol =
		isWithSlotSymbol(resolvedChildType)
		&& isWithSlotSymbol(SlotComponent)
		&& resolvedChildType.slotSymbol === SlotComponent.slotSymbol;

	if (hasMatchingSlotSymbol) {
		return true;
	}

	if (child.type.name === SlotComponent.name) {
		return true;
	}

	return false;
};

/**
 * @description Checks if a react child (within the children array) matches any of the provided SlotComponents.
 */
export const matchesAnySlotComponent = (child: React.ReactNode, SlotComponents: FunctionalComponent[]) => {
	const matchesSlot = SlotComponents.some((SlotComponent) => matchesSlotComponent(child, SlotComponent));

	return matchesSlot;
};

type SlotOptions = {
	/**
	 * @description The error message to throw when multiple slots are found for a given slot component
	 */
	errorMessage?: string;
	/**
	 * @description When true, an AssertionError will be thrown if multiple slots are found for a given slot component
	 */
	throwOnMultipleSlotMatch?: boolean;
};

/**
 * @description Counts how many times a given slot component appears in an array of children
 * @internal
 */
const calculateSlotOccurrences = (
	childrenArray: React.ReactNode[],
	SlotComponent: FunctionalComponent
) => {
	let count = 0;

	for (const child of childrenArray) {
		if (!matchesSlotComponent(child, SlotComponent)) continue;

		count += 1;
	}

	return count;
};

/**
 * @description Retrieves a single slot element from a collection of React children that matches the provided SlotComponent component.
 *
 * @throws { AssertionError } when throwOnMultipleSlotMatch is true and multiple slots are found
 */
export const getSingleSlot = (
	children: React.ReactNode,
	SlotComponent: FunctionalComponent,
	options: SlotOptions = {}
) => {
	const {
		errorMessage = "Only one instance of the SlotComponent is allowed",
		throwOnMultipleSlotMatch = false,
	} = options;

	const actualChildren =
		isValidElement<InferProps<typeof ReactFragment>>(children) && children.type === ReactFragment ?
			children.props.children
		:	children;

	const childrenArray = toArray<React.ReactNode>(actualChildren);

	const shouldThrow =
		throwOnMultipleSlotMatch && calculateSlotOccurrences(childrenArray, SlotComponent) > 1;

	if (shouldThrow) {
		throw new AssertionError(errorMessage);
	}

	const slotElement = childrenArray.find((child) => matchesSlotComponent(child, SlotComponent));

	return slotElement;
};

// NOTE -  You can imitate const type parameter by extending readonly[] | []

type MultipleSlotsOptions = {
	/**
	 * @description The error message to throw when multiple slots are found for a given slot component
	 * If a string is provided, the same message will be used for all slot components
	 * If an array is provided, each string in the array will be used as the errorMessage for the corresponding slot component
	 */
	errorMessage?: string | string[];
	/**
	 * @description When true, an AssertionError will be thrown if multiple slots are found for a given slot component
	 * If a boolean is provided, the same value will be used for all slot components
	 * If an array is provided, each boolean in the array will be used as the throwOnMultipleSlotMatch value for the corresponding slot component
	 */
	throwOnMultipleSlotMatch?: boolean | boolean[];
};

type GetMultipleSlotsResult<TSlotComponents extends FunctionalComponent[]> = {
	regularChildren: React.ReactNode[];
	slots: { [Key in keyof TSlotComponents]: ReturnType<TSlotComponents[Key]> };
};

/**
 * @description The same as getSingleSlot, but for multiple slot components
 */
export const getMultipleSlots = <const TSlotComponents extends FunctionalComponent[]>(
	children: React.ReactNode,
	SlotComponents: TSlotComponents,
	options?: MultipleSlotsOptions
): Prettify<GetMultipleSlotsResult<TSlotComponents>> => {
	const { errorMessage, throwOnMultipleSlotMatch } = options ?? {};

	const slots = SlotComponents.map((SlotComponent, index) =>
		getSingleSlot(children, SlotComponent, {
			errorMessage: isArray(errorMessage) ? errorMessage[index] : errorMessage,
			throwOnMultipleSlotMatch:
				isArray(throwOnMultipleSlotMatch) ? throwOnMultipleSlotMatch[index] : throwOnMultipleSlotMatch,
		})
	);

	const regularChildren = getRegularChildren(children, SlotComponents);

	return { regularChildren, slots } as GetMultipleSlotsResult<TSlotComponents>;
};

/**
 * @description Returns all children that are not slot elements (i.e., don't match any of the provided slot components)
 */
export const getRegularChildren = (
	children: React.ReactNode,
	SlotComponentOrComponents: FunctionalComponent | FunctionalComponent[]
) => {
	const actualChildren =
		isValidElement<InferProps<typeof ReactFragment>>(children) && children.type === ReactFragment ?
			children.props.children
		:	children;

	const childrenArray = toArray<React.ReactNode>(actualChildren);

	const regularChildren = childrenArray.filter(
		(child) => !matchesAnySlotComponent(child, toArray(SlotComponentOrComponents))
	);

	return regularChildren;
};
