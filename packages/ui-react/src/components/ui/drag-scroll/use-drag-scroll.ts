import { dataAttr, on } from "@zayne-labs/toolkit-core";
import { useCallbackRef, useStore } from "@zayne-labs/toolkit-react";
import { composeRefs, composeTwoEventHandlers } from "@zayne-labs/toolkit-react/utils";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { cnMerge } from "@/lib/utils/cn";
import { createDragScrollStore } from "./drag-scroll-store";
import type { DragScrollPropGetters, UseDragScrollProps, UseDragScrollResult } from "./types";

const getScopeAttrs = (part: string) =>
	({
		"data-part": part,
		"data-scope": "drag-scroll",
		"data-slot": `drag-scroll-${part}`,
	}) as const;

export const useDragScroll = <TContainerElement extends HTMLElement = HTMLElement>(
	props?: UseDragScrollProps
): UseDragScrollResult<TContainerElement> => {
	const {
		disableInternalStateSubscription = false,
		orientation = "horizontal",
		scrollAmount = "item",
		usage = "allScreens",
	} = props ?? {};

	const containerRef = useRef<TContainerElement>(null);

	const storeApi = useMemo(() => {
		return createDragScrollStore({ orientation, scrollAmount, usage });
	}, [orientation, scrollAmount, usage]);

	const actions = storeApi.getState().actions;

	/* eslint-disable react-hooks/hooks -- ignore */
	// eslint-disable-next-line react-x/component-hook-factories -- Ignore
	const useDragScrollStore: UseDragScrollResult<TContainerElement>["useDragScrollStore"] = (selector) => {
		return useStore(storeApi as never, selector);
	};

	const canGoToPrev = useDragScrollStore((state) =>
		!disableInternalStateSubscription ? state.canGoToPrev : null
	);

	const canGoToNext = useDragScrollStore((state) =>
		!disableInternalStateSubscription ? state.canGoToNext : null
	);

	const isDragging = useDragScrollStore((state) =>
		!disableInternalStateSubscription ? state.isDragging : null
	);
	/* eslint-enable react-hooks/hooks -- ignore */

	const refCallback: React.RefCallback<TContainerElement> = useCallbackRef((node) => {
		containerRef.current = node;
		actions.setContainerRef(node);

		if (!node) return;

		const cleanupMouseDown = on(node, "mousedown", actions.handleMouseDown);
		const cleanupScroll = on(node, "scroll", actions.handleScroll, {
			passive: true,
		});

		return () => {
			cleanupMouseDown();
			cleanupScroll();
		};
	});

	// == Update scroll state when children might change (e.g., async loaded content)
	useEffect(() => {
		const cleanup = actions.initializeResizeObserver();

		return cleanup;
	}, [actions]);

	const getRootProps: DragScrollPropGetters<TContainerElement>["getRootProps"] = useCallbackRef(
		(innerProps) => {
			return {
				...getScopeAttrs("root"),
				...innerProps,
				className: cnMerge("relative", innerProps?.className),
			};
		}
	);

	const getContainerProps: DragScrollPropGetters<TContainerElement>["getContainerProps"] = useCallback(
		(innerProps) => {
			return {
				...getScopeAttrs("container"),
				...(!disableInternalStateSubscription && {
					"data-dragging": dataAttr(isDragging),
				}),
				...innerProps,
				className: cnMerge(
					`scrollbar-hidden flex w-full cursor-grab snap-x snap-mandatory overflow-x-scroll overflow-y-hidden`,
					orientation === "horizontal" && "flex-row",
					orientation === "vertical" && "flex-col",
					usage === "mobileAndTabletOnly" && "md:cursor-default md:flex-col",
					usage === "desktopOnly" && "max-md:cursor-default max-md:flex-col",
					innerProps?.className
				),
				ref: composeRefs(
					refCallback,
					(innerProps as { ref?: React.Ref<TContainerElement> } | undefined)?.ref
				),
			} as never;
		},
		[disableInternalStateSubscription, isDragging, orientation, refCallback, usage]
	);

	const getItemProps: DragScrollPropGetters<TContainerElement>["getItemProps"] = useCallbackRef(
		(innerProps) => {
			return {
				...getScopeAttrs("item"),
				...innerProps,
				className: cnMerge("snap-center snap-always", innerProps?.className),
			};
		}
	);

	const getPrevButtonProps: DragScrollPropGetters<TContainerElement>["getPrevButtonProps"] = useCallback(
		(innerProps) => {
			const isDisabled = innerProps?.disabled ?? !canGoToPrev;

			return {
				...getScopeAttrs("prev-button"),
				type: "button",
				...innerProps,
				"aria-disabled": dataAttr(isDisabled),
				"aria-label": innerProps?.["aria-label"] ?? "Scroll back",
				"data-disabled": dataAttr(isDisabled),
				disabled: isDisabled,
				onClick: composeTwoEventHandlers(actions.goToPrev, innerProps?.onClick),
			};
		},
		[actions.goToPrev, canGoToPrev]
	);

	const getNextButtonProps: DragScrollPropGetters<TContainerElement>["getNextButtonProps"] = useCallback(
		(innerProps) => {
			const isDisabled = innerProps?.disabled ?? !canGoToNext;

			return {
				...getScopeAttrs("next-button"),
				type: "button",
				...innerProps,
				"aria-disabled": dataAttr(isDisabled),
				"aria-label": innerProps?.["aria-label"] ?? "Scroll forward",
				"data-disabled": dataAttr(isDisabled),
				disabled: isDisabled,
				onClick: composeTwoEventHandlers(actions.goToNext, innerProps?.onClick),
			};
		},
		[actions.goToNext, canGoToNext]
	);

	const propGetters = useMemo<DragScrollPropGetters<TContainerElement>>(
		() =>
			({
				getContainerProps,
				getItemProps,
				getNextButtonProps,
				getPrevButtonProps,
				getRootProps,
			}) satisfies DragScrollPropGetters<TContainerElement>,
		[getPrevButtonProps, getContainerProps, getItemProps, getNextButtonProps, getRootProps]
	);

	const stableUseDragScrollStore = useCallbackRef(useDragScrollStore);

	const result = useMemo<UseDragScrollResult<TContainerElement>>(
		() =>
			({
				containerRef,
				disableInternalStateSubscription,
				propGetters,
				storeApi,
				useDragScrollStore: stableUseDragScrollStore,
			}) satisfies UseDragScrollResult<TContainerElement>,
		[propGetters, disableInternalStateSubscription, storeApi, stableUseDragScrollStore]
	);

	return result;
};
