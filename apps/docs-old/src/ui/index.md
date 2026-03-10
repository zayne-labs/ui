# UI Components

A collection of composable, unstyled UI components that provide powerful building blocks for your React applications.

## Overview

This directory contains UI components that follow these key principles:

- **Zero Styling by Default** - Complete freedom to apply your own styles
- **Composable Architecture** - Mix and match component parts to create exactly what you need
- **Polymorphic Components** - Components can render as any HTML element via the `as` prop
- **Semantic HTML** - Default elements follow appropriate HTML semantics
- **Accessibility First** - Built with ARIA support and keyboard navigation

## Components

- `Card` - Composable card layouts with header, content, footer, and action sections
- `Carousel` - Accessible slider/carousel with keyboard and touch support
- `useDragScroll` - Hook to add drag-to-scroll behavior to any scrollable container
- `DropZone` - File upload zone with drag-and-drop support
- `Form` - Flexible form handling with field validation and subscriptions

## Installation

```bash
pnpm add @zayne-labs/ui-react
```

## Usage

Import components from their specific paths:

```tsx
import { Card } from "@zayne-labs/ui-react/ui/card";
import { Carousel } from "@zayne-labs/ui-react/ui/carousel";
import { useDragScroll } from "@zayne-labs/ui-react/ui/drag-scroll";
import { DropZone } from "@zayne-labs/ui-react/ui/drop-zone";
import { Form } from "@zayne-labs/ui-react/ui/form";
```

## Documentation

Each component has its own detailed documentation with examples, API reference, and best practices. Click through to the individual docs above to learn more.
