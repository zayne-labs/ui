import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { tv, type VariantProps } from "tailwind-variants";

export const shadcnButtonVariants = tv({
	base: `inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap
	ring-offset-shadcn-background transition-colors focus-visible:ring-2 focus-visible:ring-shadcn-ring
	focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none
	disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`,

	defaultVariants: {
		size: "default",
		variant: "default",
	},
	variants: {
		size: {
			default: "h-10 px-4 py-2",
			icon: "size-10",
			lg: "h-11 rounded-md px-8",
			sm: "h-9 rounded-md px-3",
		},
		variant: {
			default: "bg-shadcn-primary text-shadcn-primary-foreground hover:bg-shadcn-primary/90",
			ghost: "hover:bg-shadcn-accent hover:text-shadcn-accent-foreground",
			link: "text-shadcn-primary underline-offset-4 hover:underline",
			outline: `border border-shadcn-input bg-shadcn-background hover:bg-shadcn-accent
			hover:text-shadcn-accent-foreground`,
			secondary: "bg-shadcn-secondary text-shadcn-secondary-foreground hover:bg-shadcn-secondary/80",
		},
	},
});

export type ShadcnButtonProps = InferProps<"button"> & VariantProps<typeof shadcnButtonVariants>;
