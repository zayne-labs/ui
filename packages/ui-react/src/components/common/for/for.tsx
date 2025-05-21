import * as React from "react";

import type { DiscriminatedRenderProps, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { type ExtractUnion, type Prettify, isArray, isNumber } from "@zayne-labs/toolkit-type-helpers";

// prettier-ignore
type RenderPropFn<TArray> = (
	item: TArray extends readonly unknown[] ? ExtractUnion<TArray> : TArray extends number ? number : unknown,
	index: number,
	array: TArray extends readonly unknown[] ? TArray : TArray extends number ? number[] : unknown[]
) => React.ReactNode;

export type ForRenderProps<TArrayItem> = DiscriminatedRenderProps<RenderPropFn<TArrayItem>>;

/* eslint-disable perfectionist/sort-intersection-types -- Prefer the object to come first before the render props */
type ForProps<TArray> = Prettify<
	{
		each: TArray;
		fallback?: React.ReactNode;
	} & ForRenderProps<TArray>
>;

/* eslint-enable perfectionist/sort-intersection-types -- Prefer the object to come first before the render props */

export function For<const TArray>(props: ForProps<TArray>) {
	const { children, each, fallback = null, render } = props;

	if (each == null || (isNumber(each) && each === 0) || (isArray(each) && each.length === 0)) {
		return fallback;
	}

	const resolvedArray = isNumber(each) ? [...Array(each).keys()] : (each as unknown[]);

	if (resolvedArray.length === 0) {
		return fallback;
	}

	const JSXElementList = resolvedArray.map((...params) => {
		type Params = Parameters<RenderPropFn<TArray>>;

		return typeof children === "function"
			? children(...(params as Params))
			: render(...(params as Params));
	});

	return JSXElementList;
}

export function ForWithWrapper<TArrayItem, TElement extends React.ElementType = "ul">(
	props: PolymorphicProps<TElement, ForProps<TArrayItem>>
) {
	const { as: ListContainer = "ul", children, className, each, ref, render, ...restOfListProps } = props;

	return (
		<ListContainer ref={ref} className={className} {...restOfListProps}>
			<For {...({ children, each, render } as ForProps<TArrayItem>)} />
		</ListContainer>
	);
}
