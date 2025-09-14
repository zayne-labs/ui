import type { PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import * as React from "react";
import { Slot } from "@/components/common/slot";
import { cnMerge } from "@/lib/utils/cn";

export function CardRoot<TElement extends React.ElementType = "article">(
	props: PolymorphicProps<TElement>
) {
	const { as: Element = "article", ...restOfProps } = props;

	return (
		<Element
			data-scope="card"
			data-part="root"
			data-slot="card-root"
			className="flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
			{...restOfProps}
		/>
	);
}

export function CardHeader<TElement extends React.ElementType = "header">(
	props: PolymorphicProps<TElement>
) {
	const { as: Element = "header", className, ...restOfProps } = props;

	return (
		<Element
			data-scope="card"
			data-part="header"
			data-slot="card-header"
			className={cnMerge(
				`@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6
				has-data-[slot=card-action]:grid-cols-[1fr_auto]`,
				className
			)}
			{...restOfProps}
		/>
	);
}

export function CardTitle<TElement extends React.ElementType = "h3">(props: PolymorphicProps<TElement>) {
	const { as: Element = "h3", className, ...restOfProps } = props;

	return (
		<Element
			data-scope="card"
			data-part="title"
			data-slot="card-title"
			className={cnMerge("leading-none font-semibold", className)}
			{...restOfProps}
		/>
	);
}

export function CardDescription<TElement extends React.ElementType = "p">(
	props: PolymorphicProps<TElement>
) {
	const { as: Element = "p", className, ...restOfProps } = props;

	return (
		<Element
			data-scope="card"
			data-part="description"
			data-slot="card-description"
			className={cnMerge("text-sm text-zu-muted-foreground", className)}
			{...restOfProps}
		/>
	);
}

export function CardContent<TElement extends React.ElementType = "div">(
	props: PolymorphicProps<TElement>
) {
	const { as: Element = "div", className, ...restOfProps } = props;

	return (
		<Element
			data-scope="card"
			data-part="content"
			data-slot="card-content"
			className={cnMerge("px-6", className)}
			{...restOfProps}
		/>
	);
}

export function CardAction<TElement extends React.ElementType = "div">(props: PolymorphicProps<TElement>) {
	const { as: Element = "div", className, ...restOfProps } = props;

	return (
		<Element
			data-scope="card"
			data-part="action"
			data-slot="card-action"
			className={cnMerge("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
			{...restOfProps}
		/>
	);
}

export function CardFooter<TElement extends React.ElementType = "footer">(
	props: PolymorphicProps<TElement, { asChild?: boolean }>
) {
	const { as: Element = "footer", asChild, className, ...restOfProps } = props;

	const Component = asChild ? Slot.Root : Element;

	return (
		<Component
			data-scope="card"
			data-part="footer"
			data-slot="card-footer"
			className={cnMerge("px-6", className)}
			{...restOfProps}
		/>
	);
}
