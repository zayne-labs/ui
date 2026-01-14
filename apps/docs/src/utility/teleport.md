# Teleport

A utility component that uses React portals to render content at any DOM location, perfect for modals, tooltips, and overlays.

## Key Features

- **DOM Portal** - Render content anywhere in the DOM hierarchy
- **CSS Selector Targeting** - Target elements using CSS selectors
- **Insertion Position Control** - Specify where content should be inserted relative to the target
- **Event Bubbling Preservation** - Maintain React's event system across portals
- **Client-Side Rendering** - Works in client-side environments with DOM access

## Usage

### Basic Usage

You can target elements using either a CSS selector string or a direct element reference:

```tsx
import { Teleport } from "@zayne-labs/ui-react/common/teleport";

export function App() {
	// Using CSS selector
	return (
		<div>
			<Teleport to="body">
				<div>Renders to body</div>
			</Teleport>
		</div>
	);
}

export function AppWithRef() {
	// Using element reference
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<div>
			<div ref={containerRef} />

			<Teleport to={containerRef}>
				<div>Renders to the referenced element</div>
			</Teleport>
		</div>
	);
}
```

### Target Specific Elements

```tsx
import { Teleport } from "@zayne-labs/ui-react/common/teleport";

export default function App() {
	return (
		<div>
			<Teleport to="body > #notifications">
				<div>New message!</div>
			</Teleport>
		</div>
	);
}
```

### Control Insert Position

Control where content is inserted relative to the target element using the `insertPosition` prop. The values match the DOM's `insertAdjacentElement` positions since this component uses the `insertAdjacentElement` method under the hood:

- `beforebegin`: Before the target element
- `afterbegin`: Inside the target, before its first child
- `beforeend`: Inside the target, after its last child
- `afterend`: After the target element

```tsx
import { Teleport } from "@zayne-labs/ui-react/common/teleport";

export default function App() {
	return (
		<div>
			<div id="menu">
				<h2>Menu</h2>
			</div>

			<Teleport to="#menu" insertPosition="afterbegin">
				<div>Appears first in menu</div>
			</Teleport>

			<Teleport to="#menu" insertPosition="beforeend">
				<div>Appears last in menu</div>
			</Teleport>
		</div>
	);
}
```

## Common Use Cases

### Modal Dialog

```tsx
import { Teleport } from "@zayne-labs/ui-react/common/teleport";

export function Modal({ isOpen, onClose, children }) {
	if (!isOpen) return null;

	return (
		<Teleport to="body > #modal-container">
			<div onClick={onClose}>{children}</div>
		</Teleport>
	);
}
```

## Props

| Prop             | Type                                                         | Description                                        |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| `to`             | `string \| HTMLElement`                                      | Target element (CSS selector or element reference) |
| `insertPosition` | `'beforebegin' \| 'afterbegin' \| 'beforeend' \| 'afterend'` | Where to insert relative to target                 |
| `children`       | `React.ReactNode`                                            | Content to render                                  |

## Notes

- Client-side only - uses DOM APIs, won't work during SSR
- Maintains React event bubbling and context
- Cleans up automatically on unmount
- Target element must exist when component mounts

## Best Practices

1. Use for UI that needs to escape layout constraints (modals, tooltips)
2. Keep portals close to where they're used in the React tree
3. Handle cases where target elements don't exist
4. Consider accessibility - keyboard navigation and focus management
