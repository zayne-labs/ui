import { useCallbackRef } from "@zayne-labs/toolkit-react";
import { createZustandContext } from "@zayne-labs/toolkit-react/zustand";
import type { PrettyOmit } from "@zayne-labs/toolkit-type-helpers";
import { useMemo } from "react";
import { createStore } from "@zayne-labs/toolkit-core";
import type { CarouselRootProps, CarouselStore, ImagesType } from "./types";

const [CarouselStoreContextProvider, useCarouselStoreContext] = createZustandContext<CarouselStore>({
	hookName: "useCarouselStore",
	name: "CarouselStoreContext",
	providerName: "CarouselRoot",
});

// CarouselStore Creation
const createCarouselStore = <TImages extends ImagesType>(
	storeValues: PrettyOmit<CarouselRootProps<TImages>, "children">
) => {
	const { images, onSlideBtnClick } = storeValues;

	const carouselStore = createStore<CarouselStore<TImages>>((set, get) => ({
		currentSlide: 0,
		images,
		maxSlide: images.length - 1,

		/* eslint-disable perfectionist/sort-objects -- actions should be last */
		actions: {
			/* eslint-enable perfectionist/sort-objects -- actions should be last */

			goToNextSlide: () => {
				const { currentSlide, maxSlide } = get();
				const { goToSlide } = get().actions;

				if (currentSlide === maxSlide) {
					goToSlide(0);
					return;
				}

				goToSlide(currentSlide + 1);
			},

			goToPreviousSlide: () => {
				const { currentSlide, maxSlide } = get();
				const { goToSlide } = get().actions;

				if (currentSlide === 0) {
					goToSlide(maxSlide);
					return;
				}

				goToSlide(currentSlide - 1);
			},

			goToSlide: (newValue) => {
				onSlideBtnClick?.();

				set({ currentSlide: newValue });
			},
		},
	}));

	return carouselStore;
};

const useCarousel = <TImages extends ImagesType>(props: Omit<CarouselRootProps<TImages>, "children">) => {
	const { images, onSlideBtnClick } = props;

	const savedOnSlideBtnClick = useCallbackRef(onSlideBtnClick);

	const carouselStore = useMemo(
		() => createCarouselStore({ images, onSlideBtnClick: savedOnSlideBtnClick }),
		[images, savedOnSlideBtnClick]
	);

	return carouselStore;
};

export { CarouselStoreContextProvider, useCarousel, useCarouselStoreContext };
