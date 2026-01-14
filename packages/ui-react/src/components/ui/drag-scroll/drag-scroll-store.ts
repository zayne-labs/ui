import { createStore, on, throttleByFrame } from "@zayne-labs/toolkit-core";
import { isNumber } from "@zayne-labs/toolkit-type-helpers";
import type { DragScrollStore, UseDragScrollProps } from "./types";
import { handleScrollSnap, resetCursor, updateCursor } from "./utils";

type RequiredUseDragScrollProps = {
	[Key in keyof Required<UseDragScrollProps>]: UseDragScrollProps[Key] | undefined;
};

type InitStoreValues = Pick<RequiredUseDragScrollProps, "orientation" | "scrollAmount" | "usage">;

export const createDragScrollStore = <TElement extends HTMLElement = HTMLElement>(
	initStoreValues: InitStoreValues
) => {
	const { orientation = "horizontal", scrollAmount = "item", usage = "allScreens" } = initStoreValues;

	const containerRef: React.RefObject<TElement | null> = { current: null };
	const positionRef = { left: 0, top: 0, x: 0, y: 0 };

	const abortControllers = {
		current: {
			mouseLeave: new AbortController(),
			mouseMove: new AbortController(),
			mouseUp: new AbortController(),
		},
	};

	// == Calculate scroll amount based on orientation and settings
	const getScrollAmount = (container: TElement): number => {
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

	const store = createStore<DragScrollStore<TElement>>((set, get) => ({
		canGoToNext: true,
		canGoToPrev: false,
		isDragging: false,

		// eslint-disable-next-line perfectionist/sort-objects -- actions should be last
		actions: {
			cleanupDragListeners: () => {
				abortControllers.current.mouseMove.abort();
				abortControllers.current.mouseUp.abort();
				abortControllers.current.mouseLeave.abort();
			},

			goToNext: () => {
				if (!containerRef.current) return;

				const { canGoToNext } = get();
				if (!canGoToNext) return;

				const amount = getScrollAmount(containerRef.current);

				containerRef.current.scrollBy({
					behavior: "smooth",
					left: orientation === "vertical" ? 0 : amount,
					top: orientation === "vertical" || orientation === "both" ? amount : 0,
				});
			},

			goToPrev: () => {
				if (!containerRef.current) return;

				const { canGoToPrev } = get();
				if (!canGoToPrev) return;

				const amount = getScrollAmount(containerRef.current);

				containerRef.current.scrollBy({
					behavior: "smooth",
					left: orientation === "vertical" ? 0 : -amount,
					top: orientation === "vertical" || orientation === "both" ? -amount : 0,
				});
			},

			handleMouseDown: (event) => {
				if (usage === "mobileAndTabletOnly" && window.innerWidth >= 768) return;
				if (usage === "desktopOnly" && window.innerWidth < 768) return;

				if (!containerRef.current) return;

				// == Create fresh AbortControllers for each drag session (they cannot be reused after abort)
				abortControllers.current = {
					mouseLeave: new AbortController(),
					mouseMove: new AbortController(),
					mouseUp: new AbortController(),
				};

				// == Update all initial position properties
				if (orientation === "horizontal" || orientation === "both") {
					positionRef.x = event.clientX;
					positionRef.left = containerRef.current.scrollLeft;
				}

				if (orientation === "vertical" || orientation === "both") {
					positionRef.y = event.clientY;
					positionRef.top = containerRef.current.scrollTop;
				}

				updateCursor(containerRef.current);
				set({ isDragging: true });

				const { actions } = get();

				on("mousemove", containerRef.current, actions.handleMouseMove, {
					signal: abortControllers.current.mouseMove.signal,
				});
				on("mouseup", containerRef.current, actions.handleMouseUpOrLeave, {
					signal: abortControllers.current.mouseUp.signal,
				});
				on("mouseleave", containerRef.current, actions.handleMouseUpOrLeave, {
					signal: abortControllers.current.mouseLeave.signal,
				});

				// == Document-level mouseup fallback for when user releases outside the container
				on("mouseup", document, actions.handleMouseUpOrLeave, {
					once: true,
					signal: abortControllers.current.mouseUp.signal,
				});
			},

			handleMouseMove: (event) => {
				if (!containerRef.current) return;

				if (orientation === "horizontal" || orientation === "both") {
					const dx = event.clientX - positionRef.x;
					containerRef.current.scrollLeft = positionRef.left - dx;
				}

				if (orientation === "vertical" || orientation === "both") {
					const dy = event.clientY - positionRef.y;
					containerRef.current.scrollTop = positionRef.top - dy;
				}
			},

			handleMouseUpOrLeave: () => {
				if (!containerRef.current) return;

				resetCursor(containerRef.current);
				set({ isDragging: false });

				const { actions } = get();
				actions.cleanupDragListeners();
			},

			handleScroll: throttleByFrame(() => {
				const { actions } = get();
				actions.updateScrollState();
			}),

			initializeResizeObserver: () => {
				if (!containerRef.current) return;

				const { actions } = get();

				// == Use ResizeObserver to detect when container or children resize
				const resizeObserver = new ResizeObserver(() => actions.updateScrollState());

				resizeObserver.observe(containerRef.current);

				// == Also observe children for size changes
				for (const child of containerRef.current.children) {
					resizeObserver.observe(child);
				}

				const cleanup = () => {
					resizeObserver.disconnect();
				};

				return cleanup;
			},

			setContainerRef: (element) => {
				containerRef.current = element;

				if (!element) return;

				handleScrollSnap(element);

				const { actions } = get();
				actions.updateScrollState();
			},

			updateScrollState: () => {
				if (!containerRef.current) return;

				if (orientation === "horizontal" || orientation === "both") {
					const { clientWidth, scrollLeft, scrollWidth } = containerRef.current;

					set({
						canGoToNext: Math.ceil(scrollLeft + clientWidth) < scrollWidth,
						canGoToPrev: Math.floor(scrollLeft) > 0,
					});
				}

				if (orientation === "vertical") {
					const { clientHeight, scrollHeight, scrollTop } = containerRef.current;

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
