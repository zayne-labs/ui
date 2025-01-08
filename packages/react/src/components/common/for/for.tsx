import * as React from "react";

import type { DiscriminatedRenderProps, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { isArray } from "@zayne-labs/toolkit-type-helpers";

// prettier-ignore
type RenderPropFn<TArrayItem> = (
	item: TArrayItem,
	index: number,
	array: TArrayItem[]
) => React.ReactNode;

export type EachProp<TArrayItem> = { each: TArrayItem[] };

export type ForRenderProps<TArrayItem> = DiscriminatedRenderProps<RenderPropFn<TArrayItem>>;

type ForProps<TArrayItem> = EachProp<TArrayItem> & ForRenderProps<TArrayItem>;

export function ForBase<TArrayItem>(props: ForProps<TArrayItem>) {
	const { children, each, render } = props;

	if (!isArray(each)) {
		return each;
	}

	const JSXElementList = each.map((...params: Parameters<RenderPropFn<TArrayItem>>) => {
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
