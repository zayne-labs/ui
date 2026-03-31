"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cnMerge } from "@/lib/utils/cn";

export type TabsVariant = "default" | "underline";

export function TabsRoot(props: TabsPrimitive.Root.Props) {
	const { className, ...restOfProps } = props;

	return (
		<TabsPrimitive.Root
			data-slot="tabs-root"
			className={cnMerge(
				"flex flex-col gap-2 data-[orientation=vertical]:flex-row",
				className as string
			)}
			{...restOfProps}
		/>
	);
}

export function TabsList(
	props: TabsPrimitive.List.Props & {
		variant?: TabsVariant;
	}
) {
	const { children, className, variant = "default", ...restOfProps } = props;

	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cnMerge(
				"relative z-0 flex w-fit items-center justify-center gap-x-0.5 text-shadcn-muted-foreground",
				"data-[orientation=vertical]:flex-col",
				variant === "default" ?
					"rounded-lg bg-shadcn-muted p-0.5 text-shadcn-muted-foreground/72"
				:	`data-[orientation=horizontal]:py-1 data-[orientation=vertical]:px-1
					*:data-[slot=tabs-trigger]:hover:bg-shadcn-accent`,
				className as string
			)}
			{...restOfProps}
		>
			{children}
			<TabsPrimitive.Indicator
				className={cnMerge(
					`absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width)
					translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom)
					transition-[width,translate] duration-200 ease-in-out`,
					variant === "underline" ?
						`z-10 bg-shadcn-primary data-[orientation=horizontal]:h-0.5
							data-[orientation=horizontal]:translate-y-px data-[orientation=vertical]:w-0.5
							data-[orientation=vertical]:-translate-x-px`
					:	"-z-1 rounded-md bg-shadcn-background shadow-sm/5 dark:bg-shadcn-input"
				)}
				data-slot="tab-indicator"
			/>
		</TabsPrimitive.List>
	);
}

export function TabsTrigger(props: TabsPrimitive.Tab.Props) {
	const { className, ...restOfProps } = props;
	return (
		<TabsPrimitive.Tab
			data-slot="tabs-trigger"
			className={cnMerge(
				`relative flex h-9 shrink-0 grow cursor-pointer items-center justify-center gap-1.5 rounded-md
				border border-transparent px-[calc(--spacing(2.5)-1px)] text-base font-medium whitespace-nowrap
				transition-[color,background-color,box-shadow] outline-none hover:text-shadcn-muted-foreground
				focus-visible:ring-2 focus-visible:ring-shadcn-ring data-active:text-shadcn-foreground
				data-disabled:pointer-events-none data-disabled:opacity-64 data-[orientation=vertical]:w-full
				data-[orientation=vertical]:justify-start sm:h-8 sm:text-sm [&_svg]:pointer-events-none
				[&_svg]:-mx-0.5 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5
				sm:[&_svg:not([class*='size-'])]:size-4`,
				className as string
			)}
			{...restOfProps}
		/>
	);
}

export function TabsContent(props: TabsPrimitive.Panel.Props) {
	const { className, ...restOfProps } = props;

	return (
		<TabsPrimitive.Panel
			data-slot="tabs-content"
			className={cnMerge("grow outline-none", className as string)}
			{...restOfProps}
		/>
	);
}

export const Root = TabsRoot;
export const List = TabsList;
export const Trigger = TabsTrigger;
export const Content = TabsContent;
