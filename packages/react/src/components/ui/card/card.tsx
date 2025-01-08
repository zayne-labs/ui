import * as React from "react";

import { Slot } from "@/components/common/slot";
import { cnMerge } from "@/lib/utils/cn";
import type { PolymorphicProps } from "@zayne-labs/toolkit-react/utils";

export function CardRoot<TElement extends React.ElementType = "article">(
	props: PolymorphicProps<TElement>
) {
	const { as: Element = "article", ...restOfProps } = props;

	return <Element {...restOfProps} />;
}

export function CardHeader<TElement extends React.ElementType = "header">(
	props: PolymorphicProps<TElement>
) {
	const { as: Element = "header", ...restOfProps } = props;

	return <Element {...restOfProps} />;
}

export function CardTitle<TElement extends React.ElementType = "h3">(props: PolymorphicProps<TElement>) {
	const { as: Element = "h3", className, ...restOfProps } = props;

	return <Element className={cnMerge("font-semibold", className)} {...restOfProps} />;
}

export function CardDescription<TElement extends React.ElementType = "p">(
	props: PolymorphicProps<TElement>
) {
	const { as: Element = "p", className, ...restOfProps } = props;

	return (
		<Element className={cnMerge("text-sm text-shadcn-muted-foreground", className)} {...restOfProps} />
	);
}

export function CardContent<TElement extends React.ElementType = "div">(
	props: PolymorphicProps<TElement>
) {
	const { as: Element = "div", ...restOfProps } = props;

	return <Element {...restOfProps} />;
}

export function CardFooter<TElement extends React.ElementType = "footer">(
	props: PolymorphicProps<TElement, { asChild?: boolean }>
) {
	const { as: Element = "footer", asChild, ...restOfProps } = props;

	const Component = asChild ? Slot : Element;

	return <Component {...restOfProps} />;
}
