"use client";

import { dataAttr } from "@zayne-labs/toolkit-core";
import type { CssWithCustomProperties, PolymorphicPropsStrict } from "@zayne-labs/toolkit-react/utils";
import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import { For } from "@/components/common/for";
import { Show } from "@/components/common/show";
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
	CarouselItemProps,
	CarouselRootProps,
	CarouselWrapperProps,
	ImagesType,
	OtherCarouselProps,
} from "./types";
import { useCarouselOptions } from "./useCarouselOptions";

export function CarouselRoot<TImages extends ImagesType, TElement extends React.ElementType = "div">(
	props: PolymorphicPropsStrict<TElement, CarouselRootProps<TImages>>
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
				data-slot="carousel-root"
				data-scope="carousel"
				data-part="root"
				className={cnMerge("isolate", classNames?.base)}
				onMouseEnter={pauseAutoSlide}
				onMouseLeave={resumeAutoSlide}
			>
				<div
					data-scope="carousel"
					data-part="content"
					data-slot="carousel-content"
					className={cnMerge(
						"relative scrollbar-hidden size-full overflow-x-scroll",
						classNames?.content
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
			data-slot={`carousel-${variant}-button`}
			data-scope="carousel"
			data-part="button"
			type="button"
			className={cnMerge(
				"absolute inset-y-0 z-20 flex items-center justify-center",
				variant === "prev" && "left-0",
				variant === "next" && "right-0",
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
		<Show.Root when={icon?.iconType}>
			<Show.Content>
				<CarouselButton
					variant="prev"
					classNames={{
						...classNames,
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
						...classNames,
						iconContainer: cnMerge(
							icon?.iconType === "prevIcon" && "rotate-180",
							classNames?.iconContainer
						),
					}}
					icon={icon?.icon}
				/>
			</Show.Content>

			<Show.Fallback>
				<CarouselButton variant="prev" classNames={classNames} icon={icon?.prev} />

				<CarouselButton variant="next" classNames={classNames} icon={icon?.next} />
			</Show.Fallback>
		</Show.Root>
	);
}

export function CarouselItemList<TArray extends unknown[]>(props: CarouselWrapperProps<TArray[number]>) {
	const { children, className, each } = props;

	const currentSlide = useCarouselStoreContext((state) => state.currentSlide);
	const images = useCarouselStoreContext((state) => each ?? (state.images as TArray));

	return (
		<ul
			data-slot="carousel-item-list"
			data-scope="carousel"
			data-part="item-list"
			className={cnMerge(
				`flex size-full transform-[translate3d(var(--translate-distance),0,0)] snap-center
				transition-transform duration-800`,
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

export function CarouselItem(props: CarouselItemProps) {
	const { children, className, currentIndex, ...restOfProps } = props;

	const currentSlide = useCarouselStoreContext((state) => state.currentSlide);

	const isActive = currentSlide === currentIndex;

	return (
		<li
			data-slot="carousel-item"
			data-scope="carousel"
			data-part="item"
			data-active={dataAttr(isActive)}
			className={cnMerge("relative size-full shrink-0 snap-center overflow-hidden", className)}
			{...restOfProps}
		>
			{children}
		</li>
	);
}

export function CarouselCaption<TElement extends React.ElementType = "div">(
	props: PolymorphicPropsStrict<
		TElement,
		OtherCarouselProps & {
			placement?:
				| "center"
				| Exclude<`${"bottom" | "center" | "top"}-${"center" | "left" | "right"}`, "center-center">;
		}
	>
) {
	const { as: Element = "div", children, className, placement = "bottom-left" } = props;

	return (
		<Element
			data-slot="carousel-caption"
			data-scope="carousel"
			data-part="caption"
			className={cnMerge(
				"absolute z-10",
				placement === "bottom-center" && "bottom-0 left-1/2 -translate-x-1/2",
				placement === "bottom-left" && "bottom-0 left-0",
				placement === "bottom-right" && "right-0 bottom-0",
				placement === "center" && "top-1/2 left-1/2 -translate-1/2",
				placement === "top-center" && "top-0 left-1/2 -translate-x-1/2",
				placement === "top-left" && "top-0 left-0",
				placement === "top-right" && "top-0 right-0",
				className
			)}
		>
			{children}
		</Element>
	);
}

export function CarouselIndicatorList<TArray extends unknown[]>(
	props: CarouselWrapperProps<TArray[number]>
) {
	const { children, className, each } = props;

	const images = useCarouselStoreContext((state) => each ?? (state.images as TArray));

	return (
		<div
			data-slot="carousel-indicator-list"
			data-scope="carousel"
			data-part="indicator-list"
			className={cnMerge(
				"absolute bottom-6 z-2 flex w-full items-center justify-center gap-4",
				className
			)}
		>
			{isFunction(children) ?
				<For each={images} renderItem={(image, index, array) => children({ array, image, index })} />
			:	children}
		</div>
	);
}

export function CarouselIndicator(props: CarouselIndicatorProps) {
	const { className, classNames, currentIndex, ...restOfProps } = props;

	const {
		actions: { goToSlide },
		currentSlide,
	} = useCarouselStoreContext((state) => state);

	const isActive = currentSlide === currentIndex;

	return (
		<button
			data-slot="carousel-indicator"
			data-scope="carousel"
			data-part="indicator"
			data-active={dataAttr(isActive)}
			type="button"
			onClick={() => goToSlide(currentIndex)}
			className={cnMerge(
				"size-1.5 rounded-[50%]",
				className,
				classNames?.base,
				isActive && ["w-9 rounded-[6px]", classNames?.isActive]
			)}
			{...restOfProps}
		/>
	);
}
