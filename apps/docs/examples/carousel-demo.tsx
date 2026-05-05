"use client";

import { Carousel } from "@zayne-labs/ui-react/ui/carousel";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const slides = [
	{
		description: "Experience the serene majesty of alpine peaks and crystal-clear lakes.",
		image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop",
		location: "Swiss Alps",
		title: "Mountain Majesty",
	},
	{
		description: "Follow the golden shoreline as the sun dips below the turquoise horizon.",
		image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
		location: "Maldives",
		title: "Oceanic Tranquility",
	},
	{
		description: "Wander through ancient groves where light dances between emerald leaves.",
		image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop",
		location: "Oregon, USA",
		title: "Emerald Whispers",
	},
	{
		description: "Discover the silent beauty of shifting sands under a desert sun.",
		image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop",
		location: "Sahara Desert",
		title: "Golden Solitude",
	},
];

function CarouselDemo() {
	return (
		<Carousel.Root
			images={slides}
			hasAutoSlide={true}
			autoSlideInterval={6000}
			shouldPauseOnHover={true}
			classNames={{
				base: "group w-full max-w-3xl",
				content: "rounded-3xl border border-fd-border bg-fd-card shadow-2xl lg:rounded-4xl",
			}}
		>
			<Carousel.ItemList<typeof slides> className="h-85">
				{({ image, index }) => (
					<Carousel.Item key={image.title} currentIndex={index}>
						<img
							src={image.image}
							alt={image.title}
							className="size-full object-cover transition-transform duration-700
								in-data-active:group-hover:scale-105"
						/>

						<span
							className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"
						/>

						<Carousel.Caption
							as="article"
							placement="bottom-left"
							className="flex w-full flex-col gap-3 p-8 text-white md:py-13 md:pr-12 md:pl-16"
						>
							<div className="flex items-center gap-2">
								<span
									className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1
										text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md"
								>
									<MapPin className="size-3" />
									{image.location}
								</span>
							</div>

							<div className="flex flex-col gap-2">
								<h3 className="text-3xl font-black tracking-tight md:text-4xl">{image.title}</h3>
								<p className="max-w-xl text-sm/relaxed font-medium text-white/80 md:text-base">
									{image.description}
								</p>
							</div>
						</Carousel.Caption>
					</Carousel.Item>
				)}
			</Carousel.ItemList>

			<Carousel.Controls
				icon={{
					next: <ChevronRight className="size-6" />,
					prev: <ChevronLeft className="size-6" />,
				}}
				classNames={{
					base: "px-3 opacity-0 transition-all duration-300 group-hover:opacity-100",
					iconContainer: `flex size-9 items-center justify-center rounded-full bg-white/10 text-white
					ring-1 ring-white/20 backdrop-blur-xl hover:bg-white/20 active:scale-90 lg:size-12`,
				}}
			/>

			<Carousel.IndicatorList className="bottom-8">
				{({ index }) => (
					<Carousel.Indicator
						key={index}
						currentIndex={index}
						classNames={{
							base: "size-2 cursor-pointer rounded-[8px] bg-white transition-all duration-300",
							isActive: "bg-white",
						}}
					/>
				)}
			</Carousel.IndicatorList>
		</Carousel.Root>
	);
}

export default CarouselDemo;
