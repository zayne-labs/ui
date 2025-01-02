"use client";

import * as React from "react";

import { getElementList } from "@/components/common/For";
import { ChevronLeftIcon } from "@/components/icons";
import { cnMerge } from "@/lib/utils/cn";
import type { MyCustomCss, PolymorphicProps } from "@zayne-labs/toolkit-react/utils";
import { useCarouselStore } from "./carouselStoreContext";
import type {
	CarouselButtonsProps,
	CarouselContentProps,
	CarouselControlProps,
	CarouselIndicatorProps,
	CarouselWrapperProps,
	OtherCarouselProps,
} from "./types";
import { useCarouselOptions } from "./useCarouselOptions";

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

	// FIXME - Prevent touch swipe on mobile using a cover element or allow swipe but it must update the state appriopriately
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

	const { goToNextSlide, goToPreviousSlide } = useCarouselStore((state) => state.actions);

	return (
		<button
			type="button"
			className={cnMerge(
				"z-30 flex h-full w-[15%] items-center",
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
			{icon?.iconType ? (
				<>
					<CarouselButton
						variant="prev"
						classNames={{
							defaultIcon: classNames?.defaultIcon,
							iconContainer: cnMerge(
								icon.iconType === "nextIcon" && "rotate-180",
								classNames?.iconContainer
							),
						}}
						icon={icon.icon}
					/>
					<CarouselButton
						variant="next"
						classNames={{
							defaultIcon: classNames?.defaultIcon,
							iconContainer: cnMerge(
								icon.iconType === "prevIcon" && "rotate-180",
								classNames?.iconContainer
							),
						}}
						icon={icon.icon}
					/>
				</>
			) : (
				<>
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
				</>
			)}
		</div>
	);
}

export function CarouselItemWrapper<TArrayItem>(props: CarouselWrapperProps<TArrayItem>) {
	const { children, className, each, render } = props;

	const [ItemList] = getElementList("base");
	const currentSlide = useCarouselStore((state) => state.currentSlide);
	const images = useCarouselStore((state) => each ?? (state.images as TArrayItem[]));

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
				} satisfies MyCustomCss as MyCustomCss
			}
		>
			{typeof render === "function" ? (
				<ItemList each={images} render={render} />
			) : (
				<ItemList each={images}>{children}</ItemList>
			)}
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

export function CarouselIndicatorWrapper<TArrayItem>(props: CarouselWrapperProps<TArrayItem>) {
	const { children, className, each, render } = props;

	const images = useCarouselStore((state) => each ?? (state.images as TArrayItem[]));
	const [IndicatorList] = getElementList("base");

	return (
		<ul
			data-id="Carousel Indicators"
			className={cnMerge(
				"absolute bottom-10 z-[2] flex w-full items-center justify-center gap-6",
				className
			)}
		>
			{typeof render === "function" ? (
				<IndicatorList each={images} render={render} />
			) : (
				<IndicatorList each={images}>{children}</IndicatorList>
			)}
		</ul>
	);
}

export function CarouselIndicator(props: CarouselIndicatorProps) {
	const { classNames, currentIndex } = props;

	const {
		actions: { goToSlide },
		currentSlide,
	} = useCarouselStore((state) => state);

	return (
		<li className={cnMerge("inline-flex", classNames?.base)}>
			<button
				data-active={currentIndex === currentSlide}
				type="button"
				onClick={() => goToSlide(currentIndex)}
				className={cnMerge(
					"size-[6px] rounded-[50%]",
					classNames?.button,
					currentIndex === currentSlide && ["w-14 rounded-lg", classNames?.activeBtn]
				)}
			/>
		</li>
	);
}

export { CarouselContextProvider as Root } from "./carouselStoreContext";

export const Content = CarouselContent;

export const Controls = CarouselControls;

export const Button = CarouselButton;

export const Item = CarouselItem;

export const ItemWrapper = CarouselItemWrapper;

export const Caption = CarouselCaption;

export const Indicator = CarouselIndicator;

export const IndicatorWrapper = CarouselIndicatorWrapper;