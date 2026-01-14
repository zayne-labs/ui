# Carousel

A flexible carousel component for displaying images or content in a slideshow format.

## Features

- 🖼️ **Image Carousel** - Display arrays of images with smooth transitions
- 🎛️ **Navigation Controls** - Previous/next buttons with customizable icons
- 🔘 **Indicators** - Visual dots showing current slide position
- ⏰ **Auto-slide** - Optional automatic progression with pause on hover
- 🎨 **Fully Customizable** - Style all parts with CSS classes
- 📱 **Responsive** - Works on all screen sizes
- ♿ **Accessible** - Keyboard navigation and screen reader support

## Component Structure

The Carousel consists of several composable parts:

- **Carousel.Root** - Main carousel container that initializes the carousel state
- **Carousel.Controls** - Container for navigation buttons
- **Carousel.Button** - Individual prev/next buttons
- **Carousel.ItemList** - Container for carousel items that handles animation
- **Carousel.Item** - Individual carousel item/slide
- **Carousel.Caption** - Optional caption overlay for slides
- **Carousel.IndicatorList** - Container for slide indicators
- **Carousel.Indicator** - Individual indicator for each slide

## Basic Usage

```tsx
import { Carousel } from "@zayne-labs/ui-react/ui/carousel";

export function BasicCarousel() {
	const images = ["/image1.jpg", "/image2.jpg", "/image3.jpg"];

	return (
		<Carousel.Root images={images} className="relative h-64 w-full overflow-hidden rounded-lg">
			<Carousel.Controls />

			<Carousel.ItemList>
				{(imageSrc, index) => (
					<Carousel.Item key={index}>
						<img src={imageSrc} alt={`Slide ${index + 1}`} className="size-full object-cover" />
					</Carousel.Item>
				)}
			</Carousel.ItemList>

			<Carousel.IndicatorList>
				{(imageSrc, index) => (
					<Carousel.Indicator
						key={imageSrc}
						currentIndex={index}
						className="size-2 rounded-full bg-white/50 data-[active=true]:bg-white"
					/>
				)}
			</Carousel.IndicatorList>
		</Carousel.Root>
	);
}
```

## Auto-sliding Carousel

```tsx
import { Carousel } from "@zayne-labs/ui-react/ui/carousel";

export function AutoSlidingCarousel() {
	const images = ["/image1.jpg", "/image2.jpg", "/image3.jpg"];

	return (
		<Carousel.Root
			images={images}
			className="relative h-64 w-full overflow-hidden rounded-lg"
			hasAutoSlide={true}
			autoSlideInterval={3000}
			shouldPauseOnHover={true}
		>
			<Carousel.Controls />

			<Carousel.ItemList>
				{(imageSrc, index) => (
					<Carousel.Item key={index}>
						<img src={imageSrc} alt={`Slide ${index + 1}`} className="size-full object-cover" />
					</Carousel.Item>
				)}
			</Carousel.ItemList>

			<Carousel.IndicatorList>
				{(imageSrc, index) => <Carousel.Indicator key={imageSrc} currentIndex={index} />}
			</Carousel.IndicatorList>
		</Carousel.Root>
	);
}
```

## Carousel with Captions

```tsx
import { Carousel } from "@zayne-labs/ui-react/ui/carousel";

export function CaptionedCarousel() {
	const slides = [
		{ image: "/image1.jpg", title: "Mountain View", description: "Beautiful landscape" },
		{ image: "/image2.jpg", title: "Ocean Waves", description: "Peaceful seascape" },
		{ image: "/image3.jpg", title: "City Lights", description: "Urban nightscape" },
	];

	return (
		<Carousel.Root
			images={slides.map((slide) => slide.image)}
			className="relative h-80 w-full overflow-hidden rounded-lg"
		>
			<Carousel.Controls />

			<Carousel.ItemList>
				{(imageSrc, index) => {
					const slide = slides[index];
					return (
						<Carousel.Item key={slide.image}>
							<img src={slide.image} alt={slide.title} className="size-full object-cover" />

							<Carousel.Caption className="absolute right-0 bottom-0 left-0 bg-black/50 p-4 text-white">
								<h3 className="text-lg font-bold">{slide.title}</h3>
								<p>{slide.description}</p>
							</Carousel.Caption>
						</Carousel.Item>
					);
				}}
			</Carousel.ItemList>
		</Carousel.Root>
	);
}
```

## API Reference

### Carousel.Root

Main carousel container.

**Props:**

- `images: string[]` - Array of image URLs
- `hasAutoSlide?: boolean` - Enable automatic sliding
- `autoSlideInterval?: number` - Auto-slide interval in milliseconds (default: 5000)
- `shouldPauseOnHover?: boolean` - Pause auto-slide on hover
- `onSlideBtnClick?: (direction: 'next' | 'prev') => void` - Callback for button clicks
- `classNames?: { base?: string; scrollContainer?: string }` - CSS classes for styling
- `className?: string` - CSS class for the root element
- `children: React.ReactNode` - Carousel content

### Carousel.Controls

Container for navigation buttons.

**Props:**

- `classNames?: { base?: string }` - CSS classes for styling
- `icon?: { icon: React.ReactNode; iconDirection?: 'left' | 'right' }` - Custom navigation icons

### Carousel.ItemList

Container for carousel items.

**Props:**

- `children: (item: string, index: number) => React.ReactNode` - Render function for items
- `className?: string` - CSS class

### Carousel.Item

Individual carousel item.

**Props:**

- `children: React.ReactNode` - Item content
- `className?: string` - CSS class

### Carousel.IndicatorList

Container for slide indicators.

**Props:**

- `children: (item: string, index: number) => React.ReactNode` - Render function for indicators
- `className?: string` - CSS class

### Carousel.Indicator

Individual slide indicator.

**Props:**

- `currentIndex: number` - Index of this indicator
- `classNames?: { base?: string; active?: string }` - CSS classes for different states
- `className?: string` - CSS class

## Styling

The carousel uses data attributes for styling:

```css
/* Carousel root */
[data-scope="carousel"][data-part="content"] {
	position: relative;
	overflow: hidden;
}

/* Navigation buttons */
[data-scope="carousel"][data-part="button"] {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	z-index: 10;
}

[data-scope="carousel"][data-part="button"][data-direction="prev"] {
	left: 1rem;
}

[data-scope="carousel"][data-part="button"][data-direction="next"] {
	right: 1rem;
}

/* Indicators */
[data-scope="carousel"][data-part="indicator"] {
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.5);
	cursor: pointer;
}

[data-scope="carousel"][data-part="indicator"][data-active="true"] {
	background-color: white;
}
```

## Best Practices

1. **Container Sizing** - Always set explicit dimensions on the Carousel.Root
2. **Image Optimization** - Use appropriately sized images for better performance
3. **Accessibility** - Provide meaningful alt text for images
4. **Auto-slide Timing** - Use reasonable intervals (3-5 seconds) for auto-slide
5. **Mobile Considerations** - Test touch interactions on mobile devices
