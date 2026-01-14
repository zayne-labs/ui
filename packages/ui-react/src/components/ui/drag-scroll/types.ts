import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import type { useDragScrollStoreContext } from "./drag-scroll-context";
import type { createDragScrollStore } from "./drag-scroll-store";

type RecordForDataAttr = Record<`data-${string}`, unknown>;

// eslint-disable-next-line ts-eslint/consistent-type-definitions -- ignore
export interface PartProps<TElement extends HTMLElement> {
	backButton: {
		input: PartProps<TElement>["backButton"]["output"];
		output: InferProps<"button"> & RecordForDataAttr;
	};
	item: {
		input: PartProps<TElement>["item"]["output"];
		output: InferProps<HTMLElement> & RecordForDataAttr;
	};
	nextButton: {
		input: PartProps<TElement>["nextButton"]["output"];
		output: InferProps<"button"> & RecordForDataAttr;
	};
	root: {
		input: PartProps<TElement>["root"]["output"];
		output: InferProps<TElement> & RecordForDataAttr & { ref?: React.Ref<TElement> };
	};
}

export type DragScrollPropGetters<TElement extends HTMLElement> = {
	[Key in keyof PartProps<TElement> as `get${Capitalize<Key>}Props`]: (
		props?: PartProps<TElement>[Key]["input"]
	) => PartProps<TElement>[Key]["output"];
};

export type DragScrollState = {
	/** Whether the container can scroll forward (right/down) */
	canGoToNext: boolean;
	/** Whether the container can scroll backward (left/up) */
	canGoToPrev: boolean;
	/** Whether the user is currently dragging */
	isDragging: boolean;
};

export type DragScrollActions<TElement extends HTMLElement> = {
	actions: {
		cleanupDragListeners: () => void;
		goToNext: () => void;
		goToPrev: () => void;
		handleMouseDown: (event: MouseEvent) => void;
		handleMouseMove: (event: MouseEvent) => void;
		handleMouseUpOrLeave: () => void;
		handleScroll: () => void;
		initializeResizeObserver: () => (() => void) | undefined;
		setContainerRef: (element: TElement | null) => void;
		updateScrollState: () => void;
	};
};

export type DragScrollStore<TElement extends HTMLElement> = DragScrollActions<TElement> & DragScrollState;

export type UseDragScrollProps = {
	/**
	 * Custom class names for the root container and items
	 */
	classNames?: { base?: string; item?: string };
	/**
	 * Whether to disable the internal state subscription for setting things like data attributes
	 * - This is useful if you want to subscribe to the state yourself
	 * @default false
	 */
	disableInternalStateSubscription?: boolean;
	/**
	 * The direction in which scrolling is allowed.
	 * - `horizontal`: Only scroll horizontally
	 * - `vertical`: Only scroll vertically
	 * - `both`: Scroll in both directions
	 * @default "horizontal"
	 */
	orientation?: "both" | "horizontal" | "vertical";
	/**
	 * Amount to scroll when using goToNext/goToPrev.
	 * - `"item"`: Scroll by the width/height of the first child element
	 * - `number`: Scroll by a fixed pixel amount
	 * @default "item"
	 */
	scrollAmount?: "item" | number;
	/**
	 * Device usage constraints for drag behavior.
	 * - `allScreens`: Drag works on all devices
	 * - `desktopOnly`: Drag works only on desktop (width >= 768px)
	 * - `mobileAndTabletOnly`: Drag works only on mobile/tablet (width < 768px)
	 * @default "allScreens"
	 */
	usage?: "allScreens" | "desktopOnly" | "mobileAndTabletOnly";
};

export type UseDragScrollResult<TElement extends HTMLElement> = Pick<
	UseDragScrollProps,
	"disableInternalStateSubscription"
> & {
	containerRef: React.RefObject<TElement | null>;
	propGetters: DragScrollPropGetters<TElement>;
	storeApi: ReturnType<typeof createDragScrollStore<TElement>>;
	useDragScrollStore: typeof useDragScrollStoreContext;
};
