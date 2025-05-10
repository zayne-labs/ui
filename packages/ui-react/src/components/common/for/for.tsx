import * as React from "react";

import type { DiscriminatedRenderProps, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { type Prettify, isArray, isNumber } from "@zayne-labs/toolkit-type-helpers";

// prettier-ignore
type RenderPropFn<TArrayItem> = (
	item:  TArrayItem,
	index: number,
	array: TArrayItem[]
) => React.ReactNode;

export type ForRenderProps<TArrayItem> = DiscriminatedRenderProps<RenderPropFn<TArrayItem>>;

/* eslint-disable perfectionist/sort-intersection-types -- Prefer the object to come first before the render props */
type ForProps<TArrayItem> = Prettify<
	{
		each: TArrayItem[];
		fallback?: React.ReactNode;
	} & ForRenderProps<TArrayItem>
>;

type ForPropsWithNumber<TNumber> = Prettify<
	{
		each: TNumber;
		fallback?: React.ReactNode;
	} & ForRenderProps<TNumber>
>;

/* eslint-enable perfectionist/sort-intersection-types -- Prefer the object to come first before the render props */

export function For<TArrayItem>(props: ForProps<TArrayItem> | ForPropsWithNumber<TArrayItem>) {
	const { children, each, fallback, render } = props;

	if (each == null || (isNumber(each) && each === 0) || (isArray(each) && each.length === 0)) {
		return fallback;
	}

	const resolvedArray = isNumber(each)
		? ([...Array(each).keys()] as TArrayItem[])
		: (each as TArrayItem[]);

	if (resolvedArray.length === 0) {
		return fallback;
	}

	const JSXElementList = resolvedArray.map((...params: Parameters<RenderPropFn<TArrayItem>>) => {
		if (typeof children === "function") {
			return children(...params);
		}

		return render(...params);
	});

	return JSXElementList;
}

type ForListProps<TArrayItem> = {
	className?: string;
} & (ForProps<TArrayItem> | ForPropsWithNumber<TArrayItem>);

export function ForWithWrapper<TArrayItem, TElement extends React.ElementType = "ul">(
	props: PolymorphicProps<TElement, ForListProps<TArrayItem>>
) {
	const { as: ListContainer = "ul", children, className, each, ref, render, ...restOfListProps } = props;

	return (
		<ListContainer ref={ref} className={className} {...restOfListProps}>
			<For {...({ children, each, render } as ForProps<TArrayItem>)} />
		</ListContainer>
	);
}
