# Carousel

A flexible and accessible carousel/slider component with auto-sliding capabilities and zero styling by default.

## Overview

The Carousel component provides a comprehensive solution for implementing image sliders and content carousels. It offers a compound component pattern with specialized parts that work together to create a fully functional carousel experience.

## Key Features

- **Auto-Sliding** - Optional automatic slide transitions with configurable intervals
- **Navigation Controls** - Customizable previous/next buttons for manual navigation
- **Slide Indicators** - Visual indicators showing the current slide and allowing direct navigation
- **Zero Styling by Default** - Complete freedom to style the carousel to match your design system
- **Store-Based State Management** - Powered by Zustand for reliable state synchronization
- **Accessibility Ready** - Built with a11y considerations in mind
- **Pause on Hover** - Option to pause auto-sliding when hovering over the carousel
- **Highly Customizable** - Each component part can be styled independently

## Installation

```bash
# Using pnpm (recommended)
pnpm add @zayne-labs/ui-react

# Using npm
npm install @zayne-labs/ui-react

# Using yarn
yarn add @zayne-labs/ui-react
```

## Component Structure

The Carousel consists of several composable parts:

- **Carousel.Root** - Provider component that initializes the carousel state
- **Carousel.Content** - The main carousel container
- **Carousel.Controls** - Container for navigation buttons
- **Carousel.Button** - Individual prev/next buttons
- **Carousel.ItemGroup** - Container for carousel items that handles animation
- **Carousel.Item** - Individual carousel item/slide
- **Carousel.Caption** - Optional caption overlay for slides
- **Carousel.IndicatorGroup** - Container for slide indicators
- **Carousel.Indicator** - Individual indicator for each slide

## Basic Usage

```tsx
import { Carousel } from '@zayne-labs/ui-react/carousel'

function BasicCarousel() {
  // Images array for the carousel
  const images = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
    '/image4.jpg',
  ]

  return (
    <Carousel.Root images={images}>
      <Carousel.Content
        className="relative h-64 w-full overflow-hidden rounded-lg"
      >
        <Carousel.Controls
          classNames={{
            base: "h-full"
          }}
        />

        <Carousel.ItemGroup>
          {(imageSrc, index) => (
            <Carousel.Item key={index}>
              <img
                src={imageSrc}
                alt={`Slide ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </Carousel.Item>
          )}
        </Carousel.ItemGroup>

        <Carousel.IndicatorGroup>
          {(_, index) => (
            <Carousel.Indicator
              key={index}
              currentIndex={index}
              classNames={{
                base: "cursor-pointer",
                isActive: "bg-blue-500",
                button: "bg-gray-300 transition-all duration-300"
              }}
            />
          )}
        </Carousel.IndicatorGroup>
      </Carousel.Content>
    </Carousel.Root>
  )
}
```

## Auto-Sliding Carousel Example

```tsx
import { Carousel } from '@zayne-labs/ui-react/ui'

function AutoSlidingCarousel() {
  const images = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
  ]

  return (
    <Carousel.Root images={images}>
      <Carousel.Content
        className="relative h-64 w-full overflow-hidden rounded-lg"
        hasAutoSlide
        autoSlideInterval={5000} // 5 seconds
        shouldPauseOnHover
      >
        <Carousel.Controls />

        <Carousel.ItemGroup>
          {(imageSrc, index) => (
            <Carousel.Item key={index}>
              <img
                src={imageSrc}
                alt={`Slide ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </Carousel.Item>
          )}
        </Carousel.ItemGroup>

        <Carousel.IndicatorGroup>
          {(_, index) => (
            <Carousel.Indicator
              key={index}
              currentIndex={index}
            />
          )}
        </Carousel.IndicatorGroup>
      </Carousel.Content>
    </Carousel.Root>
  )
}
```

## Carousel with Captions

```tsx
import { Carousel } from '@zayne-labs/ui-react/ui'

function CaptionedCarousel() {
  const slides = [
    { image: '/image1.jpg', title: 'Mountain View', description: 'Beautiful landscape' },
    { image: '/image2.jpg', title: 'Beach Sunset', description: 'Relaxing evening' },
    { image: '/image3.jpg', title: 'City Skyline', description: 'Urban adventure' },
  ]

  return (
    <Carousel.Root images={slides}>
      <Carousel.Content className="relative h-80 w-full overflow-hidden rounded-lg">
        <Carousel.Controls />

        <Carousel.ItemGroup>
          {(slide, index) => (
            <Carousel.Item key={index}>
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />

              <Carousel.Caption className="bottom-0 left-0 right-0 bg-black/50 p-4 text-white">
                <h3 className="text-lg font-bold">{slide.title}</h3>
                <p>{slide.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          )}
        </Carousel.ItemGroup>

        <Carousel.IndicatorGroup />
      </Carousel.Content>
    </Carousel.Root>
  )
}
```

## Custom Navigation Controls

```tsx
import { Carousel } from '@zayne-labs/ui-react/ui'

function CustomControlsCarousel() {
  const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg']

  // Custom icon component
  const ArrowIcon = ({ className }) => (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <Carousel.Root images={images}>
      <Carousel.Content className="relative h-64 w-full overflow-hidden rounded-lg">
        <Carousel.Controls
          icon={{
            icon: <ArrowIcon className="h-8 w-8 text-white drop-shadow-md" />,
            iconType: "prevIcon" // Use the same icon for both prev/next buttons
          }}
          classNames={{
            base: "h-full",
            iconContainer: "bg-black/20 rounded-full p-2 hover:bg-black/30 transition-colors"
          }}
        />

        <Carousel.ItemGroup>
          {(imageSrc, index) => (
            <Carousel.Item key={index}>
              <img
                src={imageSrc}
                alt={`Slide ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </Carousel.Item>
          )}
        </Carousel.ItemGroup>
      </Carousel.Content>
    </Carousel.Root>
  )
}
```

## API Reference

### Carousel.Root

Provides the carousel context and state management.

**Props:**

- `images: string[] | Array<Record<string, string>>` - Array of image URLs or objects containing image data
- `onSlideBtnClick?: () => void` - Optional callback triggered when a slide button is clicked
- `children: React.ReactNode` - Carousel content

### Carousel.Content

The main carousel container.

**Props:**

- `as?: React.ElementType` - The element to render as (default: 'article')
- `hasAutoSlide?: boolean` - Enable auto-sliding (default: false)
- `autoSlideInterval?: number` - Interval in milliseconds between slides when auto-sliding (default: 3000)
- `shouldPauseOnHover?: boolean` - Pause auto-sliding on hover (default: true)
- `classNames?: { base?: string; scrollContainer?: string }` - Optional class names for styling
- `children: React.ReactNode` - Carousel content components

### Carousel.Controls

Container for navigation buttons.

**Props:**

- `classNames?: { base?: string; defaultIcon?: string; iconContainer?: string }` - Optional class names for styling
- `icon?` - Custom icons for prev/next buttons
  - Option 1: `{ icon?: React.ReactElement; iconType: "nextIcon" | "prevIcon" }` - Use same icon for both buttons
  - Option 2: `{ iconType?: null; next?: React.ReactElement; prev?: React.ReactElement }` - Use different icons

### Carousel.Button

Individual navigation button.

**Props:**

- `variant: "next" | "prev"` - Button variant
- `classNames?: { base?: string; defaultIcon?: string; iconContainer?: string }` - Optional class names for styling
- `icon?: React.ReactElement` - Custom icon element

### Carousel.ItemGroup

Container for carousel items.

**Props:**

- `className?: string` - Additional CSS classes
- `each?: TArrayItem[]` - Optional array of items to render
- `children?: (item: TArrayItem, index: number, array: TArrayItem[]) => React.ReactNode` - Render function for child items
- `render?: (item: TArrayItem, index: number, array: TArrayItem[]) => React.ReactNode` - Alternative render function

### Carousel.Item

Individual carousel item/slide.

**Props:**

- `className?: string` - Additional CSS classes
- `children?: React.ReactNode` - Item content
- `style?: React.CSSProperties` - Additional inline styles

### Carousel.Caption

Optional caption overlay for slides.

**Props:**

- `as?: React.ElementType` - The element to render as (default: 'div')
- `className?: string` - Additional CSS classes
- `children?: React.ReactNode` - Caption content

### Carousel.IndicatorGroup

Container for slide indicators.

**Props:**

- `className?: string` - Additional CSS classes
- `each?: TArrayItem[]` - Optional array of items to render
- `children?: (item: TArrayItem, index: number, array: TArrayItem[]) => React.ReactNode` - Render function for child items
- `render?: (item: TArrayItem, index: number, array: TArrayItem[]) => React.ReactNode` - Alternative render function

### Carousel.Indicator

Individual indicator for each slide.

**Props:**

- `currentIndex: number` - The index of the slide this indicator represents
- `classNames?: { base?: string; button?: string; isActive?: string }` - Optional class names for styling

## State Management

The Carousel uses Zustand for state management with the following state properties:

- `currentSlide: number` - Current slide index
- `maxSlide: number` - Last slide index
- `images: string[] | Array<Record<string, string>>` - Image data for slides
- `actions` - Methods to control the carousel:
  - `goToNextSlide()` - Navigate to the next slide
  - `goToPreviousSlide()` - Navigate to the previous slide
  - `goToSlide(index: number)` - Navigate to a specific slide

## Styling Guide

### Minimal Styling Setup

```tsx
<Carousel.Root images={images}>
  <Carousel.Content className="relative h-64 w-full overflow-hidden rounded-lg">
    <Carousel.Controls
      classNames={{
        base: "h-full px-2",
        iconContainer: "bg-white/80 rounded-full p-2 shadow-sm"
      }}
    />

    <Carousel.ItemGroup>
      {/* Item rendering */}
    </Carousel.ItemGroup>

    <Carousel.IndicatorGroup className="bottom-4">
      {(imageSrc, index) => (
        <Carousel.Indicator
          key={imageSrc}
          currentIndex={index}
          classNames={{
            button: "bg-white/50 shadow-sm hover:bg-white/80",
            isActive: "bg-white shadow-md"
          }}
        />
      )}
    </Carousel.IndicatorGroup>
  </Carousel.Content>
</Carousel.Root>
```

### Styling Recommendations

1. **Container**: Add `relative`, `overflow-hidden`, and specific dimensions to the Carousel.Content
2. **Controls**: Use `h-full` for the controls container to make buttons easily clickable
3. **Indicators**: Position with `bottom-[x]` and add appropriate background/opacity for visibility
4. **Items**: Use `object-cover` for images to maintain aspect ratio
5. **Captions**: Add semi-transparent background for readability

## Accessibility Considerations

When implementing the Carousel, consider these accessibility enhancements:

1. Add `aria-label` attributes to navigation buttons
2. Ensure sufficient color contrast for controls and indicators
3. Add keyboard navigation support
4. Consider adding `aria-live="polite"` to announce slide changes
5. Provide pause controls for auto-sliding carousels

## Examples

### Dark Theme Carousel

```tsx
<Carousel.Root images={images}>
  <Carousel.Content
    className="relative h-80 w-full overflow-hidden rounded-lg bg-gray-900"
    hasAutoSlide
    shouldPauseOnHover
  >
    <Carousel.Controls
      classNames={{
        base: "h-full px-4",
        iconContainer: "bg-white/10 hover:bg-white/20 rounded-full p-3",
        defaultIcon: "text-white/90 h-6 w-6"
      }}
    />

    <Carousel.ItemGroup>
      {(imageSrc, index) => (
        <Carousel.Item key={index}>
          <img
            src={imageSrc}
            alt={`Slide ${index + 1}`}
            className="h-full w-full object-cover opacity-80"
          />
        </Carousel.Item>
      )}
    </Carousel.ItemGroup>

    <Carousel.IndicatorGroup className="bottom-6">
      {(imageSrc, index) => (
        <Carousel.Indicator
          key={imageSrc}
          currentIndex={index}
          classNames={{
            button: "bg-white/30 hover:bg-white/50",
            isActive: "bg-white/80"
          }}
        />
      )}
    </Carousel.IndicatorGroup>
  </Carousel.Content>
</Carousel.Root>
```

## Advanced Usage: Complex Data Structure

```tsx
import { Carousel } from '@zayne-labs/ui-react/ui'

function ComplexCarousel() {
  const products = [
    { id: 1, image: '/product1.jpg', name: 'Product 1', price: '$19.99', rating: 4.5 },
    { id: 2, image: '/product2.jpg', name: 'Product 2', price: '$29.99', rating: 5.0 },
    { id: 3, image: '/product3.jpg', name: 'Product 3', price: '$24.99', rating: 4.0 },
  ]

  // Render star ratings
  const renderRating = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  return (
    <Carousel.Root images={products}>
      <Carousel.Content
        className="relative h-96 w-full overflow-hidden rounded-lg"
        hasAutoSlide
        autoSlideInterval={6000}
        shouldPauseOnHover
      >
        <Carousel.Controls
          classNames={{
            base: "h-full",
            iconContainer: "bg-white/80 rounded-full p-2 shadow-md"
          }}
        />

        <Carousel.ItemGroup>
          {(product, index) => (
            <Carousel.Item key={product.id} className="px-4">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 h-48 w-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex w-full flex-col items-center text-center">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <div className="my-2">{renderRating(product.rating)}</div>
                  <p className="text-lg font-semibold text-blue-600">{product.price}</p>
                  <button className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Carousel.Item>
          )}
        </Carousel.ItemGroup>

        <Carousel.IndicatorGroup className="bottom-2">
          {(_, index) => (
            <Carousel.Indicator
              key={index}
              currentIndex={index}
              classNames={{
                button: "bg-gray-300 hover:bg-gray-400",
                isActive: "bg-blue-500"
              }}
            />
          )}
        </Carousel.IndicatorGroup>
      </Carousel.Content>
    </Carousel.Root>
  )
}
```

## Summary

The Carousel component provides a feature-rich, customizable solution for creating image sliders and content carousels with zero styling by default. Its compound component pattern allows for maximum flexibility while maintaining a clean, intuitive API.

Key implementation details include:

1. State management via Zustand for reliable, centralized control
2. Auto-sliding with pause-on-hover functionality
3. Customizable navigation controls and indicators
4. Support for rendering complex data structures
5. Minimal default styling, giving you complete control over appearance

With these features, you can create anything from simple image sliders to complex product showcases while maintaining full control over styling and behavior.
