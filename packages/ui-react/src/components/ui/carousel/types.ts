import type { StoreApi } from "@zayne-labs/toolkit-core";
import type { UnionDiscriminator } from "@zayne-labs/toolkit-type-helpers";

// Carousel store types
export type ImagesType = Array<Record<string, string>> | string[];

// eslint-disable-next-line ts-eslint/no-explicit-any -- allow any for type compatibility
export type CarouselStore<TImages extends ImagesType = any> = {
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

export type CarouselRootProps<TImages extends ImagesType = ImagesType> = {
	autoSlideInterval?: number;
	children: React.ReactNode;
	classNames?: {
		base?: string;
		scrollContainer?: string;
	};
	hasAutoSlide?: boolean;
	images: CarouselStore<TImages>["images"];
	onSlideBtnClick?: () => void;
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
	icon?: UnionDiscriminator<
		[
			{ icon?: React.ReactElement; iconType: "nextIcon" | "prevIcon" },
			{ next?: React.ReactElement; prev?: React.ReactElement },
		]
	>;
};

export type CarouselIndicatorProps = {
	classNames?: {
		base?: string;
		button?: string;
		isActive?: string;
	};
	currentIndex: number;
};

type RenderPropFn<TArrayItem> = (context: {
	array: NoInfer<TArrayItem[]>;
	image: NoInfer<TArrayItem>;
	index: number;
}) => React.ReactNode;

type BaseWrapperProps<TArrayItem> = {
	children: React.ReactNode | RenderPropFn<TArrayItem>;
	each?: TArrayItem[];
};

export type CarouselWrapperProps<TArrayItem> = BaseWrapperProps<TArrayItem> & {
	className?: string;
};

export type OtherCarouselProps = {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
};
