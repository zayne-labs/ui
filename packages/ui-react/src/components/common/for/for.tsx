import type {
	DiscriminatedRenderItemProps,
	PolymorphicPropsStrict,
} from "@zayne-labs/toolkit-react/utils";
import { isArray, isNumber, type Prettify } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";

type ArrayOrNumber = number | readonly unknown[];

type GetArrayItemType<TArray extends ArrayOrNumber> =
	TArray extends readonly unknown[] ? TArray[number]
	: TArray extends number ? number
	: unknown;

type RenderPropFn<TArray extends ArrayOrNumber> = (
	item: GetArrayItemType<TArray>,
	index: number,
	array: Array<GetArrayItemType<TArray>>
) => React.ReactNode;

export type ForRenderProps<TArray extends ArrayOrNumber> = DiscriminatedRenderItemProps<
	RenderPropFn<TArray>
>;

/* eslint-disable perfectionist/sort-intersection-types -- Prefer the object to come first before the render props */
type ForProps<TArray extends ArrayOrNumber> = Prettify<
	{
		each: TArray;
		fallback?: React.ReactNode;
	} & ForRenderProps<TArray>
>;
/* eslint-enable perfectionist/sort-intersection-types -- Prefer the object to come first before the render props */

export function For<const TArray extends ArrayOrNumber>(props: ForProps<TArray>) {
	const { children, each, fallback = null, renderItem } = props;

	// eslint-disable-next-line ts-eslint/no-unnecessary-condition -- Allow
	if (each == null || (isNumber(each) && each === 0) || (isArray(each) && each.length === 0)) {
		return fallback;
	}

	const resolvedArray = isNumber(each) ? [...Array(each).keys()] : (each as unknown[]);

	if (resolvedArray.length === 0) {
		return fallback;
	}

	const selectedChildren = typeof children === "function" ? children : renderItem;

	const elementList = resolvedArray.map((...params) => {
		type Params = Parameters<RenderPropFn<TArray>>;

		return selectedChildren(...(params as Params));
	});

	return elementList;
}

export function ForWithWrapper<
	const TArray extends ArrayOrNumber,
	TElement extends React.ElementType = "ul",
>(props: PolymorphicPropsStrict<TElement, ForProps<TArray>>) {
	const { as: ListContainer = "ul", children, each, renderItem, ...restOfListProps } = props;

	return (
		<ListContainer {...restOfListProps}>
			<For {...({ children, each, renderItem } as ForProps<TArray>)} />
		</ListContainer>
	);
}
