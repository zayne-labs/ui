import type { PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { Slot } from "@/components/common/slot";
import { cnMerge } from "@/lib/utils/cn";

export function CardRoot<TElement extends React.ElementType = "article">(
	props: PolymorphicProps<TElement, { asChild?: boolean; className?: string }>
) {
	const { as: Element = "article", asChild, className, ...restOfProps } = props;

	const Component = asChild ? Slot.Root : Element;

	return (
		<Component
			data-slot="card-root"
			data-scope="card"
			data-part="root"
			className={cnMerge("flex flex-col", className)}
			{...restOfProps}
		/>
	);
}

export function CardHeader<TElement extends React.ElementType = "header">(
	props: PolymorphicProps<TElement, { asChild?: boolean; className?: string }>
) {
	const { as: Element = "header", asChild, className, ...restOfProps } = props;

	const Component = asChild ? Slot.Root : Element;

	return (
		<Component
			data-slot="card-header"
			data-scope="card"
			data-part="header"
			className={className}
			{...restOfProps}
		/>
	);
}

export function CardTitle<TElement extends React.ElementType = "h3">(
	props: PolymorphicProps<TElement, { className?: string }>
) {
	const { as: Element = "h3", className, ...restOfProps } = props;

	return (
		<Element
			data-slot="card-title"
			data-scope="card"
			data-part="title"
			className={cnMerge("leading-none font-semibold", className)}
			{...restOfProps}
		/>
	);
}

export function CardDescription<TElement extends React.ElementType = "p">(
	props: PolymorphicProps<TElement, { className?: string }>
) {
	const { as: Element = "p", className, ...restOfProps } = props;

	return (
		<Element
			data-slot="card-description"
			data-scope="card"
			data-part="description"
			className={cnMerge("text-sm text-zu-muted-foreground", className)}
			{...restOfProps}
		/>
	);
}

export function CardContent<TElement extends React.ElementType = "div">(
	props: PolymorphicProps<TElement, { className?: string }>
) {
	const { as: Element = "div", className, ...restOfProps } = props;

	return (
		<Element
			data-slot="card-content"
			data-scope="card"
			data-part="content"
			className={className}
			{...restOfProps}
		/>
	);
}

export function CardAction<TElement extends React.ElementType = "button">(
	props: PolymorphicProps<TElement, { className?: string }>
) {
	const { as: Element = "button", className, ...restOfProps } = props;

	return (
		<Element
			data-slot="card-action"
			data-scope="card"
			data-part="action"
			type="button"
			className={className}
			{...restOfProps}
		/>
	);
}

export function CardFooter<TElement extends React.ElementType = "footer">(
	props: PolymorphicProps<TElement, { asChild?: boolean; className?: string }>
) {
	const { as: Element = "footer", asChild, className, ...restOfProps } = props;

	const Component = asChild ? Slot.Root : Element;

	return (
		<Component
			data-slot="card-footer"
			data-scope="card"
			data-part="footer"
			className={className}
			{...restOfProps}
		/>
	);
}
