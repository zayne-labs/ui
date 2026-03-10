# ClientGate

Render the children only after the JS has loaded client-side. Use an optional fallback component if the JS is not yet loaded.

## Example

**Render a Chart component if JS loads, renders a simple FakeChart component server-side or if there is no JS. The FakeChart can have only the UI without the behavior or be a loading spinner or skeleton.**

```tsx
import { ClientGate } from "@zayne-labs/ui-react/common/client-gate";

export default function App() {
	return (
		<ClientGate fallback={<FakeChart />}>
			<Chart />
		</ClientGate>
	);
}
```

## API

### Props

- `children`: `React.ReactNode | (() => React.ReactNode)` - The content to render after hydration
- `fallback?`: `React.ReactNode` - Optional fallback to render before hydration

## Use Cases

- Preventing hydration mismatches in SSR
- Loading client-only components like charts or interactive elements
- Showing loading states or skeletons server-side
