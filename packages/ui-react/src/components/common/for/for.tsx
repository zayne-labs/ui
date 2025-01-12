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

export function ForBase<TArrayItem>(props: ForProps<TArrayItem>): React.ReactNode[];

export function ForBase<TNumber>(props: ForPropsWithNumber<TNumber>): React.ReactNode[];

export function ForBase<TArrayItem>(props: ForProps<TArrayItem>) {
	const { children, each, fallback, render } = props;

	// eslint-disable-next-line ts-eslint/no-unnecessary-condition -- Each can be undefined or null if user ignores TS
	if (each == null || (isNumber(each) && each === 0) || (isArray(each) && each.length === 0)) {
		return fallback;
	}

	const resolvedArray = isNumber(each) ? ([...Array(each).keys()] as TArrayItem[]) : each;

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

export function ForList<TArrayItem, TElement extends React.ElementType = "ul">(
	props: PolymorphicProps<TElement, ForProps<TArrayItem> & { className?: string }>
) {
	const { as: ListContainer = "ul", children, className, each, ref, render, ...restOfListProps } = props;

	return (
		<ListContainer ref={ref} className={className} {...restOfListProps}>
			<ForBase {...({ children, each, render } as ForProps<TArrayItem>)} />
		</ListContainer>
	);
}
