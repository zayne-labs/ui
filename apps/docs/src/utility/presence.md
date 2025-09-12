# Presence

Manage component presence with animation support, handling mount/unmount states gracefully.

## Example

```tsx
import { Presence } from "@zayne-labs/ui-react/common/presence";

function AnimatedDialog({ isOpen, onClose }) {
 return (
  <Presence present={isOpen} onExitComplete={onClose}>
   <div className="dialog animate-in fade-in">
    <h2>Dialog Title</h2>
    <p>Dialog content...</p>
   </div>
  </Presence>
 );
}
```

## API

### Props

- `children`: `React.ReactElement | ((props: { present: boolean }) => React.ReactElement)` - The content to conditionally render
- `present`: `boolean` - Whether the component should be present
- `forceMount?`: `boolean` - Force the component to stay mounted even when not present
- `onExitComplete?`: `() => void` - Callback when exit animation completes

## Features

- Handles CSS animations and transitions automatically
- Prevents layout shift by managing mount/unmount timing
- Supports both animation and transition properties
- Compatible with any animation library
