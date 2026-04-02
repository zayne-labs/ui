import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import type { useDragScrollStoreContext } from "./drag-scroll-context";
import type { createDragScrollStore } from "./drag-scroll-store";

type RecordForDataAttr = Record<`data-${string}`, unknown>;

type SharedInputProps = {
	/**
	 * Set to `true` to disable the default styling
	 */
	unstyled?: boolean;
};

/* eslint-disable perfectionist/sort-intersection-types -- I need non-stand props to come first */
export type PartProps<TContainerElement extends HTMLElement = HTMLElement> = {
	item: {
		input: PartProps<TContainerElement>["item"]["output"] & SharedInputProps;
		output: InferProps<HTMLElement> & RecordForDataAttr;
	};
	list: {
		input: PartProps<TContainerElement>["list"]["output"] & SharedInputProps;
		output: RecordForDataAttr & InferProps<TContainerElement>;
	};
	nextButton: {
		input: PartProps<TContainerElement>["nextButton"]["output"] & SharedInputProps;
		output: RecordForDataAttr & InferProps<"button">;
	};
	prevButton: {
		input: PartProps<TContainerElement>["prevButton"]["output"] & SharedInputProps;
		output: RecordForDataAttr & InferProps<"button">;
	};
	root: {
		input: PartProps<TContainerElement>["root"]["output"] & SharedInputProps;
		output: RecordForDataAttr & InferProps<"div">;
	};
};
/* eslint-enable perfectionist/sort-intersection-types -- I need non-stand props to come first */

export type DragScrollPropGetters<TContainerElement extends HTMLElement = HTMLElement> = {
	[Key in keyof PartProps<TContainerElement> as `get${Capitalize<Key>}Props`]: (
		props?: PartProps<TContainerElement>[Key]["input"]
	) => PartProps<TContainerElement>[Key]["output"];
};

export type PartInputProps<TContainerElement extends HTMLElement = HTMLElement> = {
	[Key in keyof PartProps<TContainerElement>]: PartProps<TContainerElement>[Key]["input"];
};

export type DragScrollState = {
	/** Whether the container can scroll forward (right/down) */
	canGoToNext: boolean;
	/** Whether the container can scroll backward (left/up) */
	canGoToPrev: boolean;
	/** Whether the user is currently dragging */
	isDragging: boolean;
};

export type DragScrollActions = {
	actions: {
		cleanupDragListeners: () => void;
		goToNext: () => void;
		goToPrev: () => void;
		handleMouseDown: (event: MouseEvent) => void;
		handleMouseMove: (event: MouseEvent) => void;
		handleMouseUpOrLeave: () => void;
		handleScroll: () => void;
		initializeResizeObserver: () => (() => void) | undefined;
		setListRef: (element: HTMLElement | null) => void;
		updateScrollState: () => void;
	};
};

export type DragScrollStore = DragScrollActions & DragScrollState;

export type UseDragScrollProps = {
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
};

export type UseDragScrollResult<TContainerElement extends HTMLElement> = Pick<
	UseDragScrollProps,
	"disableInternalStateSubscription"
> & {
	listRef: React.RefObject<TContainerElement | null>;
	propGetters: DragScrollPropGetters<TContainerElement>;
	storeApi: ReturnType<typeof createDragScrollStore>;
	useDragScrollStore: typeof useDragScrollStoreContext;
};
