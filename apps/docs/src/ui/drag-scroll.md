# DragScroll

A utility component that adds mouse-drag scrolling behavior to containers with zero styling by default.

## Overview

The DragScroll component enables intuitive mouse-drag scrolling for content containers, enhancing user experience for scrollable content. It provides responsive options that can target specific device types, supports both horizontal and vertical scrolling, and includes built-in state management for navigation controls.

## Key Features

- **Orientation Options** - Support for horizontal, vertical, or both scroll directions
- **Responsive Behavior** - Configure to work on all screens, desktop only, or mobile/tablet only
- **Built-in Scroll Snap** - Automatic scroll snap functionality for smooth item alignment
- **State Management** - Store-based architecture for tracking scroll state (`canGoToNext`, `isDragging`, etc.)
- **Navigation Controls** - Helpers for implementing "Next" and "Previous" buttons easily
- **Zero Styling By Default** - Minimal default styling with complete customization control
- **Props Getter Pattern** - Clean API for applying behavior to existing components

## Basic Usage

```tsx
import { useDragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";

export function BasicDragScroll() {
	const { propGetters } = useDragScroll();

	return (
		<div {...propGetters.getRootProps()}>
			{[...Array(10).keys()].map((index) => (
				<div
					key={index}
					{...propGetters.getItemProps({ className: "flex-shrink-0 w-64 h-40 bg-gray-100 m-2 p-4" })}
				>
					Card {index + 1}
				</div>
			))}
		</div>
	);
}
```

## Navigation Buttons

The hook provides prop getters for navigation buttons and access to the scroll state via a store.

```tsx
import { useDragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";

export function NavigateDragScroll() {
	const { propGetters, useDragScrollStore } = useDragScroll();

	// Subscribe to state changes efficiently
	const canGoToPrev = useDragScrollStore((state) => state.canGoToPrev);
	const canGoToNext = useDragScrollStore((state) => state.canGoToNext);

	return (
		<div className="relative">
			<button
				{...propGetters.getBackButtonProps()}
				disabled={!canGoToPrev}
				className="disabled:opacity-50"
			>
				Previous
			</button>

			<div {...propGetters.getRootProps()}>{/* Items... */}</div>

			<button
				{...propGetters.getNextButtonProps()}
				disabled={!canGoToNext}
				className="disabled:opacity-50"
			>
				Next
			</button>
		</div>
	);
}
```

## Orientation Options

### Horizontal Scroll (Default)

```tsx
import { useDragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";

export function HorizontalDragScroll() {
	const { propGetters } = useDragScroll({
		orientation: "horizontal", // Default
	});

	return <div {...propGetters.getRootProps()}>{/* Scroll items */}</div>;
}
```

### Vertical Scroll

```tsx
import { useDragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";

export function VerticalDragScroll() {
	const { propGetters } = useDragScroll({
		orientation: "vertical",
	});

	return (
		<div {...propGetters.getRootProps()}>
			{[...Array(10).keys()].map((index) => (
				<div
					key={index}
					{...propGetters.getItemProps({ className: "w-full h-40 bg-gray-100 my-2 p-4" })}
				>
					Card {index + 1}
				</div>
			))}
		</div>
	);
}
```

## Responsive Behavior

### Desktop Only

```tsx
import { useDragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";

export function DesktopOnlyDragScroll() {
	const { propGetters } = useDragScroll({
		usage: "desktopOnly", // Only applies drag behavior on desktop screens
	});

	return <div {...propGetters.getRootProps()}>{/* Scroll items */}</div>;
}
```

### Mobile and Tablet Only

```tsx
import { useDragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";

export function MobileTabletDragScroll() {
	const { propGetters } = useDragScroll({
		usage: "mobileAndTabletOnly", // Only applies drag behavior on mobile/tablet screens
	});

	return <div {...propGetters.getRootProps()}>{/* Scroll items */}</div>;
}
```

## API Reference

### useDragScroll

```tsx
const { propGetters, useDragScrollStore, storeApi } = useDragScroll(options);
```

#### Options

| Option                             | Type                                                     | Default        | Description                                                            |
| ---------------------------------- | -------------------------------------------------------- | -------------- | ---------------------------------------------------------------------- |
| `orientation`                      | `"horizontal" \| "vertical" \| "both"`                   | `"horizontal"` | The direction of scrolling                                             |
| `usage`                            | `"allScreens" \| "desktopOnly" \| "mobileAndTabletOnly"` | `"allScreens"` | Target device types for drag behavior                                  |
| `scrollAmount`                     | `"item" \| number`                                       | `"item"`       | Amount to scroll when using nav buttons (`item` measures first child)  |
| `classNames`                       | `{ base?: string, item?: string }`                       | `undefined`    | CSS classes for styling                                                |
| `disableInternalStateSubscription` | `boolean`                                                | `false`        | Disable internal state subscription (useful for custom state handling) |

#### Return Value

| Property             | Type                          | Description                                                                                     |
| -------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| `propGetters`        | `DragScrollPropGetters`       | Object containing all prop getters (`getRootProps`, `getItemProps`, `getBackButtonProps`, etc.) |
| `useDragScrollStore` | `(selector) => SelectedState` | A hook to select state from the internal store (`canGoToNext`, `isDragging`, etc.)              |
| `storeApi`           | `StoreApi<DragScrollStore>`   | Direct access to the store API (getState, setState, subscribe)                                  |

#### DragScrollPropGetters

| Getter               | Description                                |
| -------------------- | ------------------------------------------ |
| `getRootProps`       | Props for the main scrollable container    |
| `getItemProps`       | Props for each scrollable item             |
| `getBackButtonProps` | Props for the "Previous" navigation button |
| `getNextButtonProps` | Props for the "Next" navigation button     |

## Default Styling

The DragScroll component applies minimal default styling to ensure basic functionality:

1. Root container:
   - `flex w-full`
   - `overflow-x-scroll` (for horizontal mode)
   - `snap-x snap-mandatory` for smooth snap behavior
   - CSS for hiding scrollbars

2. Items:
   - `snap-center snap-always` for positioning items
