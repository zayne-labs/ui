import { createStore, on, throttleByFrame } from "@zayne-labs/toolkit-core";
import { isNumber } from "@zayne-labs/toolkit-type-helpers";
import type { DragScrollStore, UseDragScrollProps } from "./types";
import { handleScrollSnap, resetCursor, updateCursor } from "./utils";

type RequiredUseDragScrollProps = {
	[Key in keyof Required<UseDragScrollProps>]: UseDragScrollProps[Key] | undefined;
};

type InitStoreValues = Pick<RequiredUseDragScrollProps, "orientation" | "scrollAmount" | "usage">;

export const createDragScrollStore = (initStoreValues: InitStoreValues) => {
	const { orientation = "horizontal", scrollAmount = "item", usage = "allScreens" } = initStoreValues;

	const listRef: React.RefObject<HTMLElement | null> = {
		current: null,
	};

	const positionRef = {
		current: {
			left: 0,
			top: 0,
			x: 0,
			y: 0,
		},
	};

	const abortControllerRef = {
		current: {
			mouseLeave: new AbortController(),
			mouseMove: new AbortController(),
			mouseUp: new AbortController(),
		},
	};

	// == Calculate scroll amount based on orientation and settings
	const getScrollAmount = (container: HTMLElement): number => {
		if (isNumber(scrollAmount)) {
			return scrollAmount;
		}

		const firstChild = container.children[0] as HTMLElement | undefined;

		if (!firstChild) {
			return 0;
		}

		return orientation === "vertical" || orientation === "both" ?
				firstChild.offsetHeight
			:	firstChild.offsetWidth;
	};

	const store = createStore<DragScrollStore>((set, get) => ({
		canGoToNext: true,
		canGoToPrev: false,
		isDragging: false,

		// eslint-disable-next-line perfectionist/sort-objects -- actions should be last
		actions: {
			cleanupDragListeners: () => {
				abortControllerRef.current.mouseMove.abort();
				abortControllerRef.current.mouseUp.abort();
				abortControllerRef.current.mouseLeave.abort();
			},

			goToNext: () => {
				if (!listRef.current) return;

				const { canGoToNext } = get();
				if (!canGoToNext) return;

				const amount = getScrollAmount(listRef.current);

				listRef.current.scrollBy({
					behavior: "smooth",
					left: orientation === "vertical" ? 0 : amount,
					top: orientation === "vertical" || orientation === "both" ? amount : 0,
				});
			},

			goToPrev: () => {
				if (!listRef.current) return;

				const { canGoToPrev } = get();
				if (!canGoToPrev) return;

				const amount = getScrollAmount(listRef.current);

				listRef.current.scrollBy({
					behavior: "smooth",
					left: orientation === "vertical" ? 0 : -amount,
					top: orientation === "vertical" || orientation === "both" ? -amount : 0,
				});
			},

			handleMouseDown: (event) => {
				if (usage === "mobileAndTabletOnly" && window.innerWidth >= 768) return;
				if (usage === "desktopOnly" && window.innerWidth < 768) return;

				if (!listRef.current) return;

				// == Create fresh AbortControllers for each drag session (they cannot be reused after abort)
				abortControllerRef.current = {
					mouseLeave: new AbortController(),
					mouseMove: new AbortController(),
					mouseUp: new AbortController(),
				};

				// == Update all initial position properties
				if (orientation === "horizontal" || orientation === "both") {
					positionRef.current.x = event.clientX;
					positionRef.current.left = listRef.current.scrollLeft;
				}

				if (orientation === "vertical" || orientation === "both") {
					positionRef.current.y = event.clientY;
					positionRef.current.top = listRef.current.scrollTop;
				}

				updateCursor(listRef.current);
				set({ isDragging: true });

				const { actions } = get();

				on(listRef.current, "mousemove", actions.handleMouseMove, {
					signal: abortControllerRef.current.mouseMove.signal,
				});
				on(listRef.current, "mouseup", actions.handleMouseUpOrLeave, {
					signal: abortControllerRef.current.mouseUp.signal,
				});
				on(listRef.current, "mouseleave", actions.handleMouseUpOrLeave, {
					signal: abortControllerRef.current.mouseLeave.signal,
				});
				// == Document-level mouseup fallback for when user releases outside the container
				on(document, "mouseup", actions.handleMouseUpOrLeave, {
					once: true,
					signal: abortControllerRef.current.mouseUp.signal,
				});
			},

			handleMouseMove: (event) => {
				if (!listRef.current) return;

				if (orientation === "horizontal" || orientation === "both") {
					const dx = event.clientX - positionRef.current.x;
					listRef.current.scrollLeft = positionRef.current.left - dx;
				}

				if (orientation === "vertical" || orientation === "both") {
					const dy = event.clientY - positionRef.current.y;
					listRef.current.scrollTop = positionRef.current.top - dy;
				}
			},

			handleMouseUpOrLeave: () => {
				if (!listRef.current) return;

				resetCursor(listRef.current);
				set({ isDragging: false });

				const { actions } = get();
				actions.cleanupDragListeners();
			},

			handleScroll: throttleByFrame(() => {
				const { actions } = get();
				actions.updateScrollState();
			}),

			initializeResizeObserver: () => {
				if (!listRef.current) return;

				const { actions } = get();

				// == Use ResizeObserver to detect when container or children resize
				const resizeObserver = new ResizeObserver(() => actions.updateScrollState());

				resizeObserver.observe(listRef.current);

				// == Also observe children for size changes
				for (const child of listRef.current.children) {
					resizeObserver.observe(child);
				}

				const cleanup = () => {
					resizeObserver.disconnect();
				};

				return cleanup;
			},

			setListRef: (element) => {
				listRef.current = element as HTMLElement;

				if (!element) return;

				handleScrollSnap(element);

				const { actions } = get();
				actions.updateScrollState();
			},

			updateScrollState: () => {
				if (!listRef.current) return;

				if (orientation === "horizontal" || orientation === "both") {
					const { clientWidth, scrollLeft, scrollWidth } = listRef.current;

					set({
						canGoToNext: Math.ceil(scrollLeft + clientWidth) < scrollWidth,
						canGoToPrev: Math.floor(scrollLeft) > 0,
					});
				}

				if (orientation === "vertical") {
					const { clientHeight, scrollHeight, scrollTop } = listRef.current;

					set({
						canGoToNext: Math.ceil(scrollTop + clientHeight) < scrollHeight,
						canGoToPrev: Math.floor(scrollTop) > 0,
					});
				}
			},
		},
	}));

	return store;
};
