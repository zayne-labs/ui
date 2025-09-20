# Card

A composable and flexible card layout component with zero styling by default.

## Overview

The Card component provides a composable way to create card layouts with semantic HTML structure. It follows a compound component pattern, offering multiple specialized parts that can be composed together to create rich card interfaces.

Each part of the Card is built as a polymorphic component, allowing you to change the underlying HTML element while maintaining the component's functionality.

## Key Features

- **Composable Architecture** - Mix and match card parts to create the exact layout you need
- **Polymorphic Components** - Each card part can render as any HTML element via the `as` prop
- **Zero Styling by Default** - Complete freedom to apply your own styles
- **Semantic HTML** - Default elements follow appropriate HTML semantics (article, header, etc.)
- **Slot Support** - CardFooter and CardAction support the `asChild` pattern for advanced composition

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
import { Card } from '@zayne-labs/ui-react/ui/card'

function BasicCard() {
  return (
    <Card.Root className="border rounded-lg p-6 shadow-sm">
      <Card.Header className="space-y-1.5 pb-4">
        <Card.Title>Card Title</Card.Title>
        <Card.Description>Card description goes here</Card.Description>
      </Card.Header>

      <Card.Content className="py-4">
        This is the main content of the card.
      </Card.Content>

      <Card.Footer className="pt-4 flex justify-end">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Action</button>
      </Card.Footer>
    </Card.Root>
  )
}
```

## Advanced Usage

### Polymorphic Rendering

Change the underlying HTML element of any card part using the `as` prop:

```tsx
function PolymorphicCard() {
  return (
    <Card.Root as="div" className="border rounded-lg p-6">
      <Card.Header as="section">
        <Card.Title as="h2">Custom Elements</Card.Title>
        <Card.Description as="div">Using different HTML elements</Card.Description>
      </Card.Header>

      <Card.Content as="section">
        Content in a section instead of a div.
      </Card.Content>

      <Card.Footer as="div">
        Custom footer
      </Card.Footer>
    </Card.Root>
  )
}
```

### Using asChild with Footer

The `asChild` prop allows you to use your own component as the root element:

```tsx
function CardWithAsChild() {
  return (
    <Card.Root className="border rounded-lg p-6">
      {/* Other card parts */}

      <Card.Footer asChild>
        <div className="flex justify-between items-center pt-4">
          <button>Cancel</button>
          <button>Submit</button>
        </div>
      </Card.Footer>
    </Card.Root>
  )
}
```

### Card with Action Button

```tsx
function CardWithAction() {
  return (
    <Card.Root className="border rounded-lg p-6">
      <Card.Header>
        <Card.Title>Card with Action</Card.Title>
        <Card.Description>This card has an action button in the header</Card.Description>
        <Card.Action className="text-blue-500 hover:text-blue-700">
          Edit
        </Card.Action>
      </Card.Header>

      <Card.Content>
        Content of the card with an action button positioned in the top-right
        corner of the header.
      </Card.Content>
    </Card.Root>
  )
}
```

### Nested Cards

```tsx
function NestedCards() {
  return (
    <Card.Root className="border rounded-lg p-6">
      <Card.Header>
        <Card.Title>Parent Card</Card.Title>
      </Card.Header>

      <Card.Content className="py-4">
        <Card.Root className="border rounded-lg p-4 bg-gray-50">
          <Card.Header>
            <Card.Title>Nested Card</Card.Title>
          </Card.Header>
          <Card.Content>
            This is a nested card within the parent card.
          </Card.Content>
        </Card.Root>
      </Card.Content>
    </Card.Root>
  )
}
```

## API Reference

### Card.Root

The main container for the card.

**Props:**

- `as?: React.ElementType` - The element to render as (default: 'article')
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Card content
- `...props` - All other props are passed to the underlying element

### Card.Action

Action button or controls area positioned in the top-right corner of the header.

**Props:**

- `as?: React.ElementType` - The element to render as (default: 'div')
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Action content
- `...props` - All other props are passed to the underlying element

### Card.Footer

Container for the card footer content.

**Props:**

- `as?: React.ElementType` - The element to render as (default: 'footer')
- `asChild?: boolean` - Use your own component as the root element via the Slot pattern
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Card content
- `...props` - All other props are passed to the underlying element

### Card.Title

The title component for the card.

**Props:**

- `as?: React.ElementType` - The element to render as (default: 'h3')
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Title content
- `...props` - All other props are passed to the underlying element

**Default Styling:**

- `font-semibold` - Applied by default

### Card.Description

The description component for the card.

**Props:**

- `as?: React.ElementType` - The element to render as (default: 'p')
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Description content
- `...props` - All other props are passed to the underlying element

**Default Styling:**

- `text-zu-muted-foreground text-sm` - Applied by default

### Card.Content

Container for the main content of the card.

**Props:**

- `as?: React.ElementType` - The element to render as (default: 'div')
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Card content
- `...props` - All other props are passed to the underlying element

### Card.Footer

Container for the card footer content.

**Props:**

- `as?: React.ElementType` - The element to render as (default: 'footer')
- `asChild?: boolean` - Whether to merge props onto the immediate child (default: false)
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Footer content
- `...props` - All other props are passed to the underlying element

## Styling

### Approach

The Card component follows a zero-styling philosophy, with minimal default styles:

- `Card.Title` has a `font-semibold leading-none` style
- `Card.Description` has `text-zu-muted-foreground text-sm` styles

All other styling is entirely up to you, giving complete freedom to match your design system.

### Styling Best Practices

1. **Add border and padding to Card.Root:**

   ```tsx
   <Card.Root className="border rounded-lg p-6" />
   ```

2. **Use spacing between card sections:**

   ```tsx
   <Card.Header className="pb-4" />
   <Card.Content className="py-4" />
   <Card.Footer className="pt-4" />
   ```

3. **Consider using a consistent approach to shadows:**

   ```tsx
   <Card.Root className="shadow-sm hover:shadow-md transition-shadow duration-200" />
   ```

4. **For clickable cards, remember accessibility:**

   ```tsx
   <Card.Root
     as="button"
     className="block w-full text-left cursor-pointer hover:bg-gray-50"
     onClick={() => console.log('Card clicked')}
   />
   ```

## Accessibility

When using Card components, consider these accessibility best practices:

1. Use appropriate heading levels for `Card.Title` based on the document structure
2. Ensure sufficient color contrast between text and background
3. If creating clickable cards, ensure they have appropriate keyboard focus styles and ARIA attributes

## Example: Complete Card with Custom Styling

```tsx
import { Card } from '@zayne-labs/ui-react/ui'

function ProductCard({ product }) {
  return (
    <Card.Root className="overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      <Card.Header className="p-4">
        <Card.Title className="text-xl font-bold">{product.name}</Card.Title>
        <Card.Description className="text-gray-600">{product.category}</Card.Description>
      </Card.Header>

      <Card.Content className="px-4 pb-2">
        <p>{product.description}</p>
        <p className="font-bold text-lg mt-2">${product.price.toFixed(2)}</p>
      </Card.Content>

      <Card.Footer className="p-4 bg-gray-50 flex justify-between items-center">
        <button className="text-blue-500 hover:underline">Details</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add to Cart
        </button>
      </Card.Footer>
    </Card.Root>
  )
}
```
