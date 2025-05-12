# Getting Started

## Quick Start

### 1. Installation

Install @zayne-labs/ui via your preferred package manager:

```bash
pnpm add @zayne-labs/ui-react    # recommended
npm install @zayne-labs/ui-react
yarn add @zayne-labs/ui-react
```

### 2. Setup Styles

#### With Tailwind CSS v4

Import our preset styles in your main Tailwind CSS entry file:

```css
/* styles/global.css or similar */
@import 'tailwindcss';
@import '@zayne-labs/ui-react/css/preset.css';
```

#### Without Tailwind CSS v4

Import our standalone styles in your main CSS file:

```css
/* styles/main.css or similar */
@import '@zayne-labs/ui-react/style.css';
```

### 3. Start Using Components

Import and use components from their specific modules:

```tsx
import { useState } from 'react';
import { Card } from '@zayne-labs/ui-react/ui/card';
import { Switch } from '@zayne-labs/ui-react/common/switch';

type Status = 'idle' | 'loading' | 'success' | 'error';

function App() {
  const [status, setStatus] = useState<Status>('idle');

  return (
    <div className="space-y-4">
      <Card>
        <Card.Header>
          <Card.Title>Welcome to Zayne UI</Card.Title>
        </Card.Header>
        <Card.Content>
          <Switch value={status}>
            <Switch.Match when="idle">
              <button onClick={() => setStatus('loading')}>
                Start Process
              </button>
            </Switch.Match>

            <Switch.Match when="loading">
              <div className="flex items-center gap-2">
                <div className="animate-spin">⏳</div>
                <p>Processing...</p>
              </div>
            </Switch.Match>

            <Switch.Match when="success">
              <div className="text-green-500">
               <p>✓ Process completed successfully!</p>

                <button onClick={() => setStatus('idle')}>
                  Reset
                </button>
              </div>
            </Switch.Match>

            <Switch.Match when="error">
              <div className="text-red-500">
               <p> ❌ Something went wrong</p>

                <button onClick={() => setStatus('idle')}>
                  Try Again
                </button>
              </div>
            </Switch.Match>

            <Switch.Default>
              <p>Unknown status</p>
            </Switch.Default>
          </Switch>
        </Card.Content>
      </Card>
    </div>
  );
}
```

## Best Practices

1. **Import from Specific Paths**
   - Import components from their specific paths (e.g., `@zayne-labs/ui-react/ui/card`)
   - This ensures better tree-shaking and smaller bundle sizes

## TypeScript Support

Zayne UI includes TypeScript definitions out of the box. No additional setup required.
