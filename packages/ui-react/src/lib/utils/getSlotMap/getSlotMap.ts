import { toArray } from "@zayne-labs/toolkit-core";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import {
	type CallbackFn,
	type EmptyObject,
	type Prettify,
	type UnionToIntersection,
	type UnknownObject,
	isFunction,
} from "@zayne-labs/toolkit-type-helpers";
import { Fragment as ReactFragment, isValidElement } from "react";

type GetSlotName<TSlotComponentProps extends GetSlotComponentProps> =
	string extends TSlotComponentProps["name"] ? never
	: "default" extends TSlotComponentProps["name"] ? never
	: TSlotComponentProps["name"];

type GetSpecificSlotsType<TSlotComponentProps extends GetSlotComponentProps> = {
	// This conditional before the remapping will prevent an Indexed Record type from showing up if the props are not passed, enhancing type safety
	[TName in keyof TSlotComponentProps as GetSlotName<TSlotComponentProps>]: Extract<
		TSlotComponentProps["children"],
		React.ReactNode
	>;
};

/**
 * Maps slot names to their corresponding children types
 */
export type GetSlotMapResult<TSlotComponentProps extends GetSlotComponentProps> = UnionToIntersection<
	GetSpecificSlotsType<TSlotComponentProps>
> & { default: React.ReactNode[] };

/**
 * Symbol used to identify SlotComponent instances
 */
export const slotComponentSymbol = Symbol("slot-component");

/**
 * @description Creates a map of named slots from React children. Returns an object mapping slot names to their children,
 * with a default slot for unmatched children.
 *
 * @example
 * ```tsx
 * import { type GetSlotComponentProps, SlotComponent } from "@zayne-labs/toolkit-react/utils"
 *
 * type SlotProps = GetSlotComponentProps<"header" | "footer">;
 *
 * function Parent({ children }: { children: React.ReactNode }) {
 *   const slots = getSlotMap<SlotProps>(children);
 *
 *   return (
 *     <div>
 *       <header>{slots.header}</header>
 *       <main>{slots.default}</main>
 *       <footer>{slots.footer}</footer>
 *     </div>
 *   );
 * }
 * ```
 *
 * Usage:
 * ```tsx
 * <Parent>
 *   <SlotComponent name="header">Header Content</SlotComponent>
 *   <div>Random stuff</div>
 *   <SlotComponent name="footer">Footer Content</SlotComponent>
 * </Parent>
 * ```
 */
export const getSlotMap = <TSlotComponentProps extends GetSlotComponentProps>(
	children: React.ReactNode
): Prettify<GetSlotMapResult<TSlotComponentProps>> => {
	const slots: Record<string, TSlotComponentProps["children"]> & { default: React.ReactNode[] } = {
		default: [],
	};

	const isFragment = isValidElement<InferProps<HTMLElement>>(children) && children.type === ReactFragment;

	const actualChildren = isFragment ? children.props.children : children;

	const childrenArray = toArray<React.ReactNode>(actualChildren);

	for (const child of childrenArray) {
		if (!isValidElement<TSlotComponentProps>(child) || !isFunction(child.type)) {
			slots.default.push(child);
			continue;
		}

		const childType = child.type as SlotWithNameAndSymbol;

		const isSlotElement =
			childType.slotSymbol === slotComponentSymbol && Boolean(childType.slotName ?? child.props.name);

		if (!isSlotElement) {
			slots.default.push(child);
			continue;
		}

		const slotName = childType.slotName ?? child.props.name;

		if (slotName === "default") {
			slots.default.push(child);
			continue;
		}

		slots[slotName] = child;
	}

	return slots as GetSlotMapResult<TSlotComponentProps>;
};

/**
 * @description Produce props for the SlotComponent
 *
 * @example
 * ```ts
 * // Pattern One (slot or slots have same children type, which is just React.ReactNode by default)
 * type SlotProps = GetSlotComponentProps<"header" | "content" | "footer">;
 *
 * // Pattern Two (some slots can have different children type)
 * type SlotProps =  GetSlotComponentProps<"header", React.ReactNode> | GetSlotComponentProps<"header", (renderProp: RenderProp) => React.ReactNode>;
 * ```
 */
export type GetSlotComponentProps<
	TName extends string = string,
	TChildren extends CallbackFn<never, React.ReactNode> | React.ReactNode =
		| CallbackFn<never, React.ReactNode>
		| React.ReactNode,
> = {
	children: TChildren;
	/**
	 * Name of the slot where content should be rendered
	 */
	name: TName;
};

/**
 * @description Creates a slot component
 */
export const createSlotComponent = <TSlotComponentProps extends GetSlotComponentProps>() => {
	const SlotComponent = (props: TSlotComponentProps) => props.children as React.ReactNode;

	SlotComponent.slotSymbol = slotComponentSymbol;

	return SlotComponent;
};

type SlotWithNameAndSymbol<
	TSlotComponentProps extends GetSlotComponentProps = GetSlotComponentProps,
	TOtherProps extends UnknownObject = EmptyObject,
> = {
	(props: Pick<TSlotComponentProps, "children"> & TOtherProps): React.ReactNode;
	readonly slotName?: TSlotComponentProps["name"];
	readonly slotSymbol?: symbol;
};

function DefaultSlotComponent(props: Pick<GetSlotComponentProps, "children">): React.ReactNode {
	return props.children as React.ReactNode;
}

/**
 * @description Adds a slot symbol and name to a slot component passed in
 */
export const withSlotNameAndSymbol = <
	TSlotComponentProps extends GetSlotComponentProps,
	TOtherProps extends UnknownObject = EmptyObject,
>(
	name: TSlotComponentProps["name"],
	SlotComponent: SlotWithNameAndSymbol<TSlotComponentProps, TOtherProps> = DefaultSlotComponent
) => {
	/* eslint-disable no-param-reassign -- This is necessary */
	// @ts-expect-error -- This is necessary for the time being, to prevent type errors and accidental overrides on consumer side
	SlotComponent.slotSymbol = slotComponentSymbol;
	// @ts-expect-error -- This is necessary for the time being, to prevent type errors and accidental overrides on consumer side
	SlotComponent.slotName = name;

	/* eslint-enable no-param-reassign -- This is necessary */

	return SlotComponent;
};
