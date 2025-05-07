# DragScroll

A utility component that adds mouse-drag scrolling behavior to containers with zero styling by default.

## Overview

The DragScroll component enables intuitive mouse-drag scrolling for content containers, enhancing user experience for scrollable content. It provides responsive options that can target specific device types and supports both horizontal and vertical scrolling.

## Key Features

- **Orientation Options** - Support for horizontal, vertical, or both scroll directions
- **Responsive Behavior** - Configure to work on all screens, desktop only, or mobile/tablet only
- **Built-in Scroll Snap** - Automatic scroll snap functionality for smooth item alignment
- **Cursor Feedback** - Automatic cursor state management during drag operations
- **Zero Styling By Default** - Minimal default styling with complete customization control
- **Props Getter Pattern** - Clean API for applying behavior to existing components

## Installation

```bash
# Using pnpm (recommended)
pnpm add @zayne-labs/ui-react

# Using npm
npm install @zayne-labs/ui-react

# Using yarn
yarn add @zayne-labs/ui-react
```

## Basic Usage

```tsx
import { useDragScroll } from '@zayne-labs/ui-react/ui/drag-scroll'

function BasicDragScroll() {
  const { getRootProps, getItemProps } = useDragScroll()

  return (
    <div {...getRootProps()}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} {...getItemProps({ className: "flex-shrink-0 w-64 h-40 bg-gray-100 m-2 p-4" })}>
          Card {i + 1}
        </div>
      ))}
    </div>
  )
}
```

## Orientation Options

### Horizontal Scroll (Default)

```tsx
import { useDragScroll } from '@zayne-labs/ui-react/drag-scroll'

function HorizontalDragScroll() {
  const { getRootProps, getItemProps } = useDragScroll({
    orientation: "horizontal" // Default
  })

  return (
    <div {...getRootProps()}>
      {/* Scroll items */}
    </div>
  )
}
```

### Vertical Scroll

```tsx
import { useDragScroll } from '@zayne-labs/ui-react/ui/drag-scroll'

function VerticalDragScroll() {
  const { getRootProps, getItemProps } = useDragScroll({
    orientation: "vertical"
  })

  return (
    <div {...getRootProps()}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} {...getItemProps({ className: "w-full h-40 bg-gray-100 my-2 p-4" })}>
          Card {i + 1}
        </div>
      ))}
    </div>
  )
}
```

### Both Directions

```tsx
import { useDragScroll } from '@zayne-labs/ui-react/ui/drag-scroll'

function BidirectionalDragScroll() {
  const { getRootProps, getItemProps } = useDragScroll({
    orientation: "both"
  })

  return (
    <div {...getRootProps({ className: "h-96 flex-wrap" })}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} {...getItemProps({ className: "w-64 h-40 bg-gray-100 m-2 p-4" })}>
          Card {i + 1}
        </div>
      ))}
    </div>
  )
}
```

## Responsive Behavior

### Desktop Only

```tsx
import { useDragScroll } from '@zayne-labs/ui-react/ui/drag-scroll'

function DesktopOnlyDragScroll() {
  const { getRootProps, getItemProps } = useDragScroll({
    usage: "desktopOnly" // Only applies drag behavior on desktop screens
  })

  return (
    <div {...getRootProps()}>
      {/* Scroll items */}
    </div>
  )
}
```

### Mobile and Tablet Only

```tsx
import { useDragScroll } from '@zayne-labs/ui-react/ui/drag-scroll'

function MobileTabletDragScroll() {
  const { getRootProps, getItemProps } = useDragScroll({
    usage: "mobileAndTabletOnly" // Only applies drag behavior on mobile/tablet screens
  })

  return (
    <div {...getRootProps()}>
      {/* Scroll items */}
    </div>
  )
}
```

## Customization

### With Custom Styling

```tsx
import { useDragScroll } from '@zayne-labs/ui-react/ui/drag-scroll'

function StyledDragScroll() {
  const { getRootProps, getItemProps } = useDragScroll({
    classNames: {
      base: "bg-gray-50 rounded-lg p-4 shadow-inner",
      item: "rounded-md shadow-sm bg-white hover:shadow-md transition-shadow"
    }
  })

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Scrollable Content</h2>
      <div {...getRootProps()}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            {...getItemProps({
              className: "flex-shrink-0 w-64 h-40 m-2 p-4 flex items-center justify-center"
            })}
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### With Extra Props

```tsx
import { useDragScroll } from '@zayne-labs/ui-react/ui/drag-scroll'

function DragScrollWithExtraProps() {
  const { getRootProps, getItemProps } = useDragScroll({
    extraRootProps: {
      "aria-label": "Scrollable content",
      id: "scroll-container",
      onMouseEnter: () => console.log("Mouse entered scroll area")
    },
    extraItemProps: {
      role: "listitem",
      tabIndex: 0
    }
  })

  return (
    <div {...getRootProps()}>
      {/* Scroll items */}
    </div>
  )
}
```

## API Reference

### useDragScroll

```tsx
const { getRootProps, getItemProps } = useDragScroll(options?)
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical" \| "both"` | `"horizontal"` | The direction of scrolling |
| `usage` | `"allScreens" \| "desktopOnly" \| "mobileAndTabletOnly"` | `"allScreens"` | Target device types for drag behavior |
| `classNames` | `{ base?: string, item?: string }` | `undefined` | CSS classes for styling |
| `extraRootProps` | `object` | `undefined` | Additional props to apply to the root element |
| `extraItemProps` | `object` | `undefined` | Additional props to apply to item elements |

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `getRootProps` | `(props?: object) => object` | Function to get props for the scrollable container |
| `getItemProps` | `(props?: object) => object` | Function to get props for each scrollable item |

## Default Styling

The DragScroll component applies minimal default styling to ensure basic functionality:

1. Root container:
   - `flex w-full`
   - `overflow-x-scroll` (for horizontal mode)
   - `overflow-y-hidden` (for horizontal mode)
   - `cursor-grab` during drag operations
   - `snap-x snap-mandatory` for smooth snap behavior
   - CSS for hiding scrollbars

2. Items:
   - `snap-center snap-always` for positioning items

## Implementation Details

### Scroll Snap

The component automatically applies CSS scroll snap points for a smooth scrolling experience:

- `snap-x` or `snap-y` on the container (based on orientation)
- `snap-center snap-always` on items

### Cursor Management

The cursor is automatically updated during drag operations:

- Default: `cursor-grab` indicates draggable content
- During drag: Changes to `cursor-grabbing`
- Returns to normal after drag completes

### Event Handling

The implementation uses these key events:

- `mousedown` - Initiates the drag operation
- `mousemove` - Updates scroll position based on mouse movement
- `mouseup`/`mouseleave` - Ends the drag operation

## Accessibility Considerations

When implementing DragScroll, consider these accessibility enhancements:

- Add keyboard navigation alternatives for non-mouse users
- Ensure items are properly focusable with `tabIndex`
- Add `aria-label` to identify the scrollable region
- Consider providing pagination controls for keyboard users

## Summary

The DragScroll component provides an intuitive way to add mouse-based scrolling to your content containers. With support for different orientations, device-specific behavior, and automatic scroll snap functionality, it enhances the user experience while giving you complete control over styling and behavior.
