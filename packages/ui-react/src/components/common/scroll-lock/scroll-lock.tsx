"use client";

import { useComposeRefs, useScrollLock, type UseScrollLockOptions } from "@zayne-labs/toolkit-react";
import type { PolymorphicPropsStrict } from "@zayne-labs/toolkit-react/utils";
import { useRef } from "react";
import { Slot } from "../slot";

export type ScrollLockProps = Omit<UseScrollLockOptions, "ref"> & {
	/**
	 * Apply the lock to the child element instead of rendering a wrapper `div`.
	 */
	asChild?: boolean;
	children?: React.ReactNode;
	/**
	 * Ref to the rendered element
	 */
	ref?: React.Ref<HTMLElement>;
};

/**
 * @description Stops the page from scrolling while mounted. Scrolling still works inside this element and any `shards`.
 *
 * @example
 * ```tsx
 * <ScrollLock enabled={isOpen} className="fixed inset-0 overflow-y-auto">
 *   <DialogContent />
 * </ScrollLock>
 * ```
 */
function ScrollLock<TElement extends React.ElementType = "div">(
	props: PolymorphicPropsStrict<TElement, ScrollLockProps>
) {
	const {
		allowPinchZoom,
		as: Element = "div",
		asChild,
		enabled = true,
		gapMode,
		inert,
		noIsolation,
		noRelative,
		ref: forwardedRef,
		removeScrollBar,
		shards,
		...restOfProps
	} = props;

	const lockRef = useRef<HTMLElement>(null);

	useScrollLock({
		allowPinchZoom,
		enabled,
		gapMode,
		inert,
		noIsolation,
		noRelative,
		ref: lockRef,
		removeScrollBar,
		shards,
	});

	const ref = useComposeRefs(lockRef, forwardedRef);

	const Component = asChild ? Slot.Root : Element;

	return <Component ref={ref} {...restOfProps} />;
}

export { ScrollLock };
