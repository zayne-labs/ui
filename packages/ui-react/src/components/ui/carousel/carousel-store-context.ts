import { createStore } from "@zayne-labs/toolkit-core";
import { useCallbackRef, useStore } from "@zayne-labs/toolkit-react";
import { createReactStoreContext } from "@zayne-labs/toolkit-react/zustand";
import type { PrettyOmit } from "@zayne-labs/toolkit-type-helpers";
import { useMemo } from "react";
import type { CarouselRootProps, CarouselStore, ImagesType } from "./types";

const [CarouselStoreContextProvider, useCarouselStoreContext] = createReactStoreContext<CarouselStore>({
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

	const useCarouselStore: typeof useCarouselStoreContext = (selector) => {
		// eslint-disable-next-line react-hooks/hooks -- Ignore
		return useStore(carouselStore, selector);
	};

	const savedUseCarouselStore = useCallbackRef(useCarouselStore);

	return useMemo(
		() => ({ carouselStore, useCarouselStore: savedUseCarouselStore }),
		[carouselStore, savedUseCarouselStore]
	);
};

export { CarouselStoreContextProvider, useCarousel, useCarouselStoreContext };
