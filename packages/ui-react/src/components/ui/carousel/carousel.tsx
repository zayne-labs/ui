"use client";

import type { CssWithCustomProperties, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import * as React from "react";
import { Show } from "@/components/common";
import { For } from "@/components/common/for";
import { cnMerge } from "@/lib/utils/cn";
import {
	CarouselStoreContextProvider,
	useCarousel,
	useCarouselStoreContext,
} from "./carousel-store-context";
import { ChevronLeftIcon } from "./icons";
import type {
	CarouselButtonsProps,
	CarouselControlProps,
	CarouselIndicatorProps,
	CarouselRootProps,
	CarouselWrapperProps,
	ImagesType,
	OtherCarouselProps,
} from "./types";
import { useCarouselOptions } from "./useCarouselOptions";

// TODO -  Add dragging and swiping support
export function CarouselRoot<TImages extends ImagesType, TElement extends React.ElementType = "div">(
	props: PolymorphicProps<TElement, CarouselRootProps<TImages>>
) {
	const {
		as: Element = "div",
		autoSlideInterval,
		children,
		classNames,
		hasAutoSlide,
		images,
		onSlideBtnClick,
		shouldPauseOnHover,
	} = props;

	const { carouselStore } = useCarousel({ images, onSlideBtnClick });

	const actions = carouselStore.getState().actions;

	const { pauseAutoSlide, resumeAutoSlide } = useCarouselOptions({
		actions,
		autoSlideInterval,
		hasAutoSlide,
		shouldPauseOnHover,
	});

	return (
		<CarouselStoreContextProvider store={carouselStore}>
			<Element
				data-scope="carousel"
				data-part="content"
				data-slot="carousel-content"
				className={cnMerge("relative select-none", classNames?.base)}
				onMouseEnter={pauseAutoSlide}
				onMouseLeave={resumeAutoSlide}
			>
				<div
					className={cnMerge(
						"flex size-full overflow-x-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
						classNames?.scrollContainer
					)}
				>
					{children}
				</div>
			</Element>
		</CarouselStoreContextProvider>
	);
}

export function CarouselButton(props: CarouselButtonsProps) {
	const { classNames, icon, variant } = props;

	const { goToNextSlide, goToPreviousSlide } = useCarouselStoreContext((state) => state.actions);

	return (
		<button
			data-scope="carousel"
			data-part="button"
			data-slot="carousel-button"
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
		<div
			data-scope="carousel"
			data-part="controls"
			data-slot="carousel-controls"
			className={cnMerge("absolute inset-0 flex justify-between", classNames?.base)}
		>
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
	const { children, className, each } = props;

	const currentSlide = useCarouselStoreContext((state) => state.currentSlide);
	const images = useCarouselStoreContext((state) => each ?? (state.images as TArrayItem[]));

	return (
		<ul
			data-scope="carousel"
			data-part="item-group"
			data-slot="carousel-item-group"
			className={cnMerge(
				`duration-800 transform-[translate3d(var(--translate-distance),0,0)] flex w-full shrink-0
				snap-center transition-transform`,
				className
			)}
			style={
				{
					"--translate-distance": `-${currentSlide * 100}%`,
				} satisfies CssWithCustomProperties as CssWithCustomProperties
			}
		>
			{isFunction(children) ?
				<For each={images} renderItem={(image, index, array) => children({ array, image, index })} />
			:	children}
		</ul>
	);
}

export function CarouselItem(props: OtherCarouselProps) {
	const { children, className, ...restOfProps } = props;

	return (
		<li
			data-scope="carousel"
			data-part="item"
			data-slot="carousel-item"
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
		<HtmlElement
			data-scope="carousel"
			data-part="caption"
			data-slot="carousel-caption"
			className={cnMerge("absolute z-10", className)}
		>
			{children}
		</HtmlElement>
	);
}

export function CarouselIndicatorGroup<TArrayItem>(props: CarouselWrapperProps<TArrayItem>) {
	const { children, className, each } = props;

	const images = useCarouselStoreContext((state) => each ?? (state.images as TArrayItem[]));

	return (
		<ul
			data-scope="carousel"
			data-part="indicator-group"
			data-slot="carousel-indicator-group"
			className={cnMerge(
				"absolute bottom-[25px] z-[2] flex w-full items-center justify-center gap-[15px]",
				className
			)}
		>
			{isFunction(children) ?
				<For each={images} renderItem={(image, index, array) => children({ array, image, index })} />
			:	children}
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
		<li
			data-scope="carousel"
			data-part="indicator"
			data-slot="carousel-indicator"
			className={cnMerge("inline-flex", classNames?.base)}
		>
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
