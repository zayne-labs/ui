# Slot

A utility component for flexible component composition through prop merging.

## Credits

This was inspired entirely by the [Slot](https://www.radix-ui.com/primitives/docs/utilities/slot) component from Radix UI and works exactly the same way, but has been optimized in certain areas.

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
