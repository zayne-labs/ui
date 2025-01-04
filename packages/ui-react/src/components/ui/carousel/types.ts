import type { EachProp, ForRenderProps } from "@/components/common/for";
import type { Prettify } from "@zayne-labs/toolkit-type-helpers";
import type { StoreApi } from "zustand";

// Carousel store types
export type ImagesType = Array<Record<string, string>> | string[];

export type CarouselStore<TImages extends ImagesType = ImagesType> = {
	actions: {
		goToNextSlide: () => void;
		goToPreviousSlide: () => void;
		goToSlide: (newValue: number) => void;
	};
	currentSlide: number;
	images: TImages;

	maxSlide: number;
};

export type CarouselStoreApi<TImages extends ImagesType = ImagesType> = StoreApi<CarouselStore<TImages>>;

export type CarouselProviderProps<TImages extends ImagesType = ImagesType> = {
	children: React.ReactNode;
	images: CarouselStore<TImages>["images"];
	onSlideBtnClick?: () => void;
};

// Carousel component types
export type CarouselContentProps = {
	autoSlideInterval?: number;

	children: React.ReactNode;

	classNames?: {
		base?: string;
		scrollContainer?: string;
	};
	hasAutoSlide?: boolean;
	shouldPauseOnHover?: boolean;
};

export type CarouselButtonsProps = {
	classNames?: {
		base?: string;
		defaultIcon?: string;
		iconContainer?: string;
	};

	icon?: React.ReactElement;

	variant: "next" | "prev";
};

export type CarouselControlProps = {
	classNames?: {
		base?: string;
		defaultIcon?: string;
		iconContainer?: string;
	};

	// == Allow for custom icons, either passing both or just one of the two
	icon?:
		| {
				icon?: React.ReactElement;
				iconType: "nextIcon" | "prevIcon";
		  }
		| {
				iconType?: null;
				next?: React.ReactElement;
				prev?: React.ReactElement;
		  };
};

export type CarouselIndicatorProps = {
	classNames?: {
		activeBtn?: string;
		base?: string;
		button?: string;
	};
	currentIndex: number;
};

type BaseWrapperProps<TArrayItem> = Prettify<ForRenderProps<TArrayItem> & Partial<EachProp<TArrayItem>>>;

export type CarouselWrapperProps<TArrayItem> = BaseWrapperProps<TArrayItem> & {
	className?: string;
};

export type OtherCarouselProps = {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
};
