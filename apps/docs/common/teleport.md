# Teleport

A utility component that renders React content anywhere in the DOM tree.

## Overview

The Teleport component provides a convenient wrapper around React's portal functionality, allowing you to render components at any location in the DOM tree while maintaining React's event handling and state management. This is particularly useful for components like modals, tooltips, and popovers that need to escape layout constraints of their parent components.

## Key Features

- **DOM Portal** - Render content anywhere in the DOM hierarchy
- **CSS Selector Targeting** - Target elements using CSS selectors
- **Insertion Position Control** - Specify where content should be inserted relative to the target
- **Event Bubbling Preservation** - Maintain React's event system across portals
- **Client-Side Rendering** - Works in client-side environments with DOM access

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
import { Teleport } from '@zayne-labs/ui-react/common/teleport';

function App() {
  return (
    <div>
      <h1>Main Application</h1>

      {/* Content will render to the body */}
      <Teleport to="body">
        <div className="notification">
          This notification renders directly to the body!
        </div>
      </Teleport>
    </div>
  );
}
```

## With Custom Container Element

You can target a specific element by CSS selector:

```tsx
import { Teleport } from '@zayne-labs/ui-react/common';

function ComponentWithPortal() {
  return (
    <div>
      <h2>Component content</h2>

      {/* Content will render to an element with id="portal-root" */}
      <Teleport to="#portal-root">
        <div className="portal-content">
          This content is rendered in a different part of the DOM!
        </div>
      </Teleport>
    </div>
  );
}
```

## Using Insert Position

You can control where the portal content is inserted relative to the target using the `insertPosition` prop:

```tsx
import { Teleport } from '@zayne-labs/ui-react/common';

function AppWithInsertPositions() {
  return (
    <div>
      <h1>Insertion Positions Demo</h1>

      <div id="target-element">
        <p>This is the target element's original content</p>
      </div>

      {/* Insert at the beginning of the target element */}
      <Teleport to="#target-element" insertPosition="afterbegin">
        <div className="inserted-first">I appear first inside the target</div>
      </Teleport>

      {/* Insert at the end of the target element */}
      <Teleport to="#target-element" insertPosition="beforeend">
        <div className="inserted-last">I appear last inside the target</div>
      </Teleport>

      {/* Insert before the target element */}
      <Teleport to="#target-element" insertPosition="beforebegin">
        <div className="inserted-before">I appear before the target element</div>
      </Teleport>

      {/* Insert after the target element */}
      <Teleport to="#target-element" insertPosition="afterend">
        <div className="inserted-after">I appear after the target element</div>
      </Teleport>
    </div>
  );
}
```

## Modal Implementation

Teleport is perfect for implementing modals that need to render outside their parent component's stacking context:

```tsx
import { Teleport } from '@zayne-labs/ui-react/common';
import { useState } from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <Teleport to="body">
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          onClick={e => e.stopPropagation()}
        >
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    </Teleport>
  );
}

function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="app">
      <h1>Modal Example</h1>
      <button onClick={() => setModalOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <h2>Modal Content</h2>
        <p>This modal is rendered directly to the body!</p>
      </Modal>
    </div>
  );
}
```

## Tooltip Implementation

Teleport is ideal for tooltips that need to escape overflow constraints:

```tsx
import { Teleport } from '@zayne-labs/ui-react/common';
import { useState, useRef } from 'react';

function Tooltip({ text, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && triggerRef.current && (
        <Teleport to="body">
          <div
            className="tooltip"
            style={{
              position: 'absolute',
              top: `${triggerRef.current.getBoundingClientRect().bottom + window.scrollY + 5}px`,
              left: `${triggerRef.current.getBoundingClientRect().left + window.scrollX}px`,
            }}
          >
            {text}
          </div>
        </Teleport>
      )}
    </>
  );
}

function App() {
  return (
    <div style={{ overflow: 'hidden', padding: '20px' }}>
      <Tooltip text="This tooltip can escape the overflow container!">
        <button>Hover me</button>
      </Tooltip>
    </div>
  );
}
```

## Using HTML Element Reference

You can also teleport to a direct HTML element reference:

```tsx
import { Teleport } from '@zayne-labs/ui-react/common';
import { useRef, useEffect, useState } from 'react';

function DynamicPortalContainer() {
  const containerRef = useRef(null);
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainer(containerRef.current);
    }
  }, []);

  return (
    <div>
      <div ref={containerRef} className="portal-container">
        <h2>Portal Container</h2>
        <p>Portal content will be inserted here</p>
      </div>

      {container && (
        <Teleport to={container}>
          <div className="teleported-content">
            This content is teleported into the container!
          </div>
        </Teleport>
      )}
    </div>
  );
}
```

## Common Use Cases

### 1. Notifications/Toasts

```tsx
function Notifications({ notifications }) {
  return (
    <Teleport to="#notifications-container">
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification">
            {notification.message}
          </div>
        ))}
      </div>
    </Teleport>
  );
}
```

### 2. Dropdown Menus

```tsx
function Dropdown({ trigger, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </button>

      {isOpen && triggerRef.current && (
        <Teleport to="body">
          <div
            className="dropdown-menu"
            style={{
              position: 'absolute',
              top: `${triggerRef.current.getBoundingClientRect().bottom + window.scrollY}px`,
              left: `${triggerRef.current.getBoundingClientRect().left + window.scrollX}px`,
            }}
          >
            {items.map((item) => (
              <div key={item.id} className="dropdown-item">
                {item.label}
              </div>
            ))}
          </div>
        </Teleport>
      )}
    </>
  );
}
```

### 3. Floating UI Integration

Teleport works great with libraries like Floating UI:

```tsx
import { Teleport } from '@zayne-labs/ui-react/common';
import { useFloating, shift, offset } from '@floating-ui/react';

function FloatingPopover({ trigger, content }) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), shift()]
  });

  return (
    <>
      <button ref={refs.setReference} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </button>

      {isOpen && (
        <Teleport to="body">
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="popover"
          >
            {content}
          </div>
        </Teleport>
      )}
    </>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `string \| HTMLElement \| null` | *Required* | Target element CSS selector or HTML Element reference |
| `insertPosition` | `InsertPosition` | `undefined` | Where to insert content relative to target ('beforebegin', 'afterbegin', 'beforeend', 'afterend') |
| `children` | `React.ReactNode` | *Required* | Content to render at the target location |

### Insert Position Values

| Value | Description |
|-------|-------------|
| `'beforebegin'` | Before the target element itself |
| `'afterbegin'` | Inside the target element, before its first child |
| `'beforeend'` | Inside the target element, after its last child |
| `'afterend'` | After the target element itself |

### Type Definitions

```tsx
type ValidHtmlTags = keyof HTMLElementTagNameMap;

type PortalProps = {
  children: React.ReactNode;
  insertPosition?: InsertPosition;
  to: string | HTMLElement | ValidHtmlTags | null;
};
```

## Implementation Details

The Teleport component uses React's `createPortal` function to render children to a different part of the DOM. When an `insertPosition` is provided, it will:

1. Create a temporary wrapper div with `display: contents`
2. Insert that wrapper at the specified position
3. Portal the content into that wrapper
4. Clean up and remove the wrapper when the component unmounts

Without an `insertPosition`, it will simply render directly to the targeted element.

## Client-Side Only

Because Teleport manipulates the DOM directly, it's marked with `"use client"` and will only function in client-side environments where the DOM is available. It won't work during server-side rendering.

## Accessibility Considerations

When using Teleport, keep these accessibility considerations in mind:

1. **Keyboard Navigation** - Ensure teleported UI is keyboard navigable, especially for modals
2. **Focus Management** - Manage focus correctly when teleporting interactive content
3. **Screen Reader Announcements** - Use ARIA live regions when needed for dynamic content
4. **DOM Order** - Be aware that visual position may not match DOM order, which can affect keyboard tab order

## Best Practices

1. **Error Handling** - Handle cases where the target element doesn't exist
2. **Clean Up** - The component automatically cleans up inserted elements, but be mindful of any side effects
3. **Performance** - Minimize the number of portals used, as each requires DOM manipulation
4. **Styling** - Remember that teleported content won't inherit styles from its original location in the component tree

## Comparison with Other Portal Solutions

| Solution | Pros | Cons |
|----------|------|------|
| **React.createPortal** | Direct React API, lightweight | No insert position control |
| **Teleport** | Simple API, insert position control | Slightly more overhead |
| **react-portal** | Well-established, many features | Extra dependency |
| **CSS Solutions** | No JS required | Limited functionality, can break React events |

## Summary

Teleport provides a simple yet powerful way to render React components anywhere in the DOM tree. By maintaining React's event system and providing precise control over insertion position, it solves common UI challenges like modals, tooltips, and other floating elements that need to break out of their parent container's layout constraints.
