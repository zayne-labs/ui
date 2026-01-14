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

export const useDragScroll = <TElement extends HTMLElement>(
	props?: UseDragScrollProps
): UseDragScrollResult<TElement> => {
	const {
		classNames,
		disableInternalStateSubscription = false,
		orientation = "horizontal",
		scrollAmount = "item",
		usage = "allScreens",
	} = props ?? {};

	const containerRef = useRef<TElement>(null);

	const storeApi = useMemo(() => {
		return createDragScrollStore<TElement>({ orientation, scrollAmount, usage });
	}, [orientation, scrollAmount, usage]);

	const actions = storeApi.getState().actions;

	/* eslint-disable react-hooks/hooks -- ignore */
	const useDragScrollStore: UseDragScrollResult<TElement>["useDragScrollStore"] = (selector) => {
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

	const refCallback: React.RefCallback<TElement> = useCallbackRef((node) => {
		containerRef.current = node;
		actions.setContainerRef(node);

		if (!node) return;

		const cleanupMouseDown = on("mousedown", node, actions.handleMouseDown);
		const cleanupScroll = on("scroll", node as never, actions.handleScroll as never, {
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

	const getRootProps: DragScrollPropGetters<TElement>["getRootProps"] = useCallback(
		(innerProps) => {
			return {
				...getScopeAttrs("root"),
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
					classNames?.base,
					innerProps?.className
				),
				ref: composeRefs(refCallback, innerProps?.ref),
			} as never;
		},
		[classNames?.base, disableInternalStateSubscription, isDragging, orientation, refCallback, usage]
	);

	const getItemProps: DragScrollPropGetters<TElement>["getItemProps"] = useCallback(
		(innerProps) => {
			return {
				...getScopeAttrs("item"),
				...innerProps,
				className: cnMerge("snap-center snap-always", classNames?.item, innerProps?.className),
			};
		},
		[classNames?.item]
	);

	const getBackButtonProps: DragScrollPropGetters<TElement>["getBackButtonProps"] = useCallback(
		(innerProps) => {
			const isDisabled = innerProps?.disabled ?? !canGoToPrev;

			return {
				...getScopeAttrs("back-button"),
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

	const getNextButtonProps: DragScrollPropGetters<TElement>["getNextButtonProps"] = useCallback(
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

	const propGetters = useMemo<DragScrollPropGetters<TElement>>(
		() =>
			({
				getBackButtonProps,
				getItemProps,
				getNextButtonProps,
				getRootProps,
			}) satisfies DragScrollPropGetters<TElement>,
		[getBackButtonProps, getItemProps, getNextButtonProps, getRootProps]
	);

	const stableUseDragScrollStore = useCallbackRef(useDragScrollStore);

	const result = useMemo<UseDragScrollResult<TElement>>(
		() =>
			({
				containerRef,
				disableInternalStateSubscription,
				propGetters,
				storeApi,
				useDragScrollStore: stableUseDragScrollStore,
			}) satisfies UseDragScrollResult<TElement>,
		[propGetters, disableInternalStateSubscription, storeApi, stableUseDragScrollStore]
	);

	return result;
};
