"use client";

import type { CssWithCustomProperties, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import * as React from "react";
import { Show } from "@/components/common";
import { getElementList } from "@/components/common/for";
import { cnMerge } from "@/lib/utils/cn";
import {
	CarouselStoreContextProvider,
	useCarousel,
	useCarouselStoreContext,
} from "./carousel-store-context";
import { ChevronLeftIcon } from "./icons";
import type {
	CarouselButtonsProps,
	CarouselContentProps,
	CarouselControlProps,
	CarouselIndicatorProps,
	CarouselRootProps,
	CarouselWrapperProps,
	ImagesType,
	OtherCarouselProps,
} from "./types";
import { useCarouselOptions } from "./useCarouselOptions";

export function CarouselRoot<TImages extends ImagesType>(props: CarouselRootProps<TImages>) {
	const { children, images, onSlideBtnClick } = props;

	const carouselStore = useCarousel({ images, onSlideBtnClick });

	return <CarouselStoreContextProvider store={carouselStore}>{children}</CarouselStoreContextProvider>;
}

// TODO -  Add dragging and swiping support
export function CarouselContent<TElement extends React.ElementType = "article">(
	props: PolymorphicProps<TElement, CarouselContentProps>
) {
	const {
		as: HtmlElement = "article",
		autoSlideInterval,
		children,
		classNames,
		hasAutoSlide,
		shouldPauseOnHover,
	} = props;

	const { pauseAutoSlide, resumeAutoSlide } = useCarouselOptions({
		autoSlideInterval,
		hasAutoSlide,
		shouldPauseOnHover,
	});

	// FIXME - Prevent touch swipe on mobile using a cover element or allow swipe but it must update the state appropriately
	return (
		<HtmlElement
			data-id="Carousel"
			className={cnMerge("relative select-none", classNames?.base)}
			onMouseEnter={pauseAutoSlide}
			onMouseLeave={resumeAutoSlide}
		>
			<div
				data-id="Scroll Container"
				className={cnMerge(
					"flex size-full overflow-x-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
					classNames?.scrollContainer
				)}
			>
				{children}
			</div>
		</HtmlElement>
	);
}

export function CarouselButton(props: CarouselButtonsProps) {
	const { classNames, icon, variant } = props;

	const { goToNextSlide, goToPreviousSlide } = useCarouselStoreContext((state) => state.actions);

	return (
		<button
			type="button"
			className={cnMerge(
				"z-30 flex h-full w-fit items-center",
				variant === "prev" ? "justify-start" : "justify-end",
				classNames?.base
			)}
			onClick={variant === "prev" ? goToPreviousSlide : goToNextSlide}
		>
			<span className={cnMerge("transition-transform active:scale-[1.06]", classNames?.iconContainer)}>
				{icon ?? (
					<ChevronLeftIcon
						className={cnMerge(variant === "next" && "rotate-180", classNames?.defaultIcon)}
					/>
				)}
			</span>
		</button>
	);
}

export function CarouselControls(props: CarouselControlProps) {
	const { classNames, icon } = props;

	return (
		<div className={cnMerge("absolute inset-0 flex justify-between", classNames?.base)}>
			<Show.Root when={icon?.iconType}>
				<Show.Content>
					<CarouselButton
						variant="prev"
						classNames={{
							defaultIcon: classNames?.defaultIcon,
							iconContainer: cnMerge(
								icon?.iconType === "nextIcon" && "rotate-180",
								classNames?.iconContainer
							),
						}}
						icon={icon?.icon}
					/>

					<CarouselButton
						variant="next"
						classNames={{
							defaultIcon: classNames?.defaultIcon,
							iconContainer: cnMerge(
								icon?.iconType === "prevIcon" && "rotate-180",
								classNames?.iconContainer
							),
						}}
						icon={icon?.icon}
					/>
				</Show.Content>

				<Show.Otherwise>
					<CarouselButton
						variant="prev"
						classNames={{
							defaultIcon: classNames?.defaultIcon,
							iconContainer: classNames?.iconContainer,
						}}
						icon={icon?.prev}
					/>

					<CarouselButton
						variant="next"
						classNames={{
							defaultIcon: classNames?.defaultIcon,
							iconContainer: classNames?.iconContainer,
						}}
						icon={icon?.next}
					/>
				</Show.Otherwise>
			</Show.Root>
		</div>
	);
}

export function CarouselItemGroup<TArrayItem>(props: CarouselWrapperProps<TArrayItem>) {
	const { children, className, each, render } = props;

	const [ItemList] = getElementList("base");
	const currentSlide = useCarouselStoreContext((state) => state.currentSlide);
	const images = useCarouselStoreContext((state) => each ?? (state.images as TArrayItem[]));

	return (
		<ul
			data-id="Carousel Image Wrapper"
			className={cnMerge(
				`flex w-full shrink-0 snap-center [transform:translate3d(var(--translate-distance),0,0)]
				[transition:transform_800ms_ease]`,
				className
			)}
			style={
				{
					"--translate-distance": `-${currentSlide * 100}%`,
				} satisfies CssWithCustomProperties as CssWithCustomProperties
			}
		>
			{typeof render === "function" ?
				<ItemList each={images} render={render} />
			:	<ItemList each={images}>{children}</ItemList>}
		</ul>
	);
}

export function CarouselItem({ children, className, ...restOfProps }: OtherCarouselProps) {
	return (
		<li
			className={cnMerge("flex w-full shrink-0 snap-center justify-center", className)}
			{...restOfProps}
		>
			{children}
		</li>
	);
}

export function CarouselCaption<TElement extends React.ElementType = "div">(
	props: PolymorphicProps<TElement, OtherCarouselProps>
) {
	const { as: HtmlElement = "div", children, className } = props;

	return (
		<HtmlElement data-id="Carousel Caption" className={cnMerge("absolute z-10", className)}>
			{children}
		</HtmlElement>
	);
}

export function CarouselIndicatorGroup<TArrayItem>(props: CarouselWrapperProps<TArrayItem>) {
	const { children, className, each, render } = props;

	const images = useCarouselStoreContext((state) => each ?? (state.images as TArrayItem[]));
	const [IndicatorList] = getElementList("base");

	return (
		<ul
			data-id="Carousel Indicators"
			className={cnMerge(
				"absolute bottom-[25px] z-[2] flex w-full items-center justify-center gap-[15px]",
				className
			)}
		>
			{typeof render === "function" ?
				<IndicatorList each={images} render={render} />
			:	<IndicatorList each={images}>{children}</IndicatorList>}
		</ul>
	);
}

export function CarouselIndicator(props: CarouselIndicatorProps) {
	const { classNames, currentIndex } = props;

	const {
		actions: { goToSlide },
		currentSlide,
	} = useCarouselStoreContext((state) => state);

	return (
		<li className={cnMerge("inline-flex", classNames?.base)}>
			<button
				type="button"
				onClick={() => goToSlide(currentIndex)}
				className={cnMerge(
					"size-[6px] rounded-[50%]",
					classNames?.base,
					currentIndex === currentSlide && ["w-[35px] rounded-[5px]", classNames?.isActive]
				)}
			/>
		</li>
	);
}
