"use client";

import { Carousel } from "@zayne-labs/ui-react/ui/carousel";

const slides = [
	{
		description: "Breathtaking mountain views",
		image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop",
		title: "Mountain Landscape",
	},
	{
		description: "Golden hour by the sea",
		image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
		title: "Ocean Sunset",
	},
	{
		description: "Peaceful woodland trail",
		image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
		title: "Forest Path",
	},
	{
		description: "Vast sandy landscapes",
		image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop",
		title: "Desert Dunes",
	},
];

export default function CarouselDemo() {
	return (
		<Carousel.Root
			images={slides}
			hasAutoSlide={false}
			autoSlideInterval={5000}
			shouldPauseOnHover={true}
			classNames={{
				base: "rounded-lg border border-fd-border shadow-sm",
				content: "rounded-lg",
			}}
		>
			<Carousel.ItemList<typeof slides>>
				{({ image }) => (
					<Carousel.Item key={image.title} className="relative h-80 w-full">
						<img src={image.image} alt={image.title} className="size-full object-cover" />

						<span
							className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent
								to-transparent"
						/>

						<div className="absolute bottom-5 left-0 p-6 text-white">
							<h3 className="text-xl font-semibold">{image.title}</h3>
							<p className="mt-1 text-sm text-white/80">{image.description}</p>
						</div>
					</Carousel.Item>
				)}
			</Carousel.ItemList>

			<Carousel.Controls
				classNames={{
					base: "px-3",
					iconContainer: `rounded-md bg-fd-background/90 p-2 text-[20px] text-fd-foreground shadow-sm
					hover:bg-fd-background`,
				}}
			/>

			<Carousel.IndicatorList className="bottom-4">
				{({ index }) => (
					<Carousel.Indicator
						key={index}
						currentIndex={index}
						classNames={{
							base: "cursor-pointer rounded-sm bg-white/60 transition-all hover:bg-white/90",
							isActive: "bg-white",
						}}
					/>
				)}
			</Carousel.IndicatorList>
		</Carousel.Root>
	);
}
