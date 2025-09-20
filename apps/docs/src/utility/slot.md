# Slot

A utility component for flexible component composition through prop merging.

## Credits

This was inspired entirely by the [Slot](https://www.radix-ui.com/primitives/docs/utilities/slot) component from Radix UI, but has been optimized in certain areas.

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
import { Slot } from "@zayne-labs/ui-react/common/slot";

// Basic prop merging
function Example() {
	return (
		<Slot.Root className="parent-class">
			<div className="child-class">Content</div>
		</Slot.Root>
	);
}

// Using Slottable for explicit slot designation
function ComplexExample() {
	return (
		<Slot.Root className="wrapper">
			<Slot.Slottable>
				<div className="target">This will receive merged props</div>
			</Slot.Slottable>
			<div>This is rendered normally</div>
		</Slot.Root>
	);
}
```

## API Reference

### Slot Props

Accepts all valid HTML element props which will be merged with the child element's props.

### Slottable Props

| Prop       | Type              | Description                         |
| ---------- | ----------------- | ----------------------------------- |
| `children` | `React.ReactNode` | The element to receive merged props |

## Implementation Details

The Slot component works by:

1. Checking for Slottable children and handling them specially
2. Merging props between parent and child elements
3. Composing refs if both parent and child have them
4. Special handling for React fragments
5. Validation of child counts and element types
