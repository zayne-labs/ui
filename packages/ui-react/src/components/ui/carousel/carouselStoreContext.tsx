import { useConstant } from "@zayne-labs/toolkit-react";
import { createZustandContext } from "@zayne-labs/toolkit-react/zustand";
import type { PrettyOmit } from "@zayne-labs/toolkit-type-helpers";
import { useEffect } from "react";
import { create } from "zustand";
import type { CarouselProviderProps, CarouselStore, ImagesType } from "./types";

const [Provider, useCarouselStore] = createZustandContext<CarouselStore>({
	hookName: "useCarouselStore",
	name: "CarouselStoreContext",
	providerName: "CarouselContextProvider",
});

// CarouselStore Creation
const createCarouselStore = <TImages extends ImagesType>(
	storeValues: PrettyOmit<CarouselProviderProps<TImages>, "children">
) => {
	const { images, onSlideBtnClick } = storeValues;

	const useInitCarouselStore = create<CarouselStore<TImages>>()((set, get) => ({
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

	return useInitCarouselStore;
};

// == Provider Component
function CarouselContextProvider<TImages extends ImagesType>(props: CarouselProviderProps<TImages>) {
	const { children, images, onSlideBtnClick } = props;

	const useInitCarouselStore = useConstant(() => createCarouselStore({ images, onSlideBtnClick }));

	// == To set images again when a page is mounted, preventing stale images from previous page
	useEffect(() => {
		useInitCarouselStore.setState({ images });
		// eslint-disable-next-line react-hooks/exhaustive-deps -- useInitCarouselStore is stable
	}, [images]);

	return <Provider value={useInitCarouselStore}>{children}</Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- It's fine
export { useCarouselStore, CarouselContextProvider };
