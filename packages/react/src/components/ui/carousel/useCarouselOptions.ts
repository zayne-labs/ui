import { useAnimationInterval, useCallbackRef } from "@zayne-labs/toolkit-react";
import { useState } from "react";
import { useCarouselStoreContext } from "./carousel-store-context";

type CarouselOptions = {
	autoSlideInterval?: number;
	hasAutoSlide?: boolean;
	shouldPauseOnHover?: boolean;
};

const useCarouselOptions = (options: CarouselOptions = {}) => {
	const { autoSlideInterval = 5000, hasAutoSlide = false, shouldPauseOnHover = false } = options;

	const { goToNextSlide } = useCarouselStoreContext((state) => state.actions);

	const [isPaused, setIsPaused] = useState(false);

	const shouldAutoSlide = hasAutoSlide && !isPaused;

	useAnimationInterval({
		intervalDuration: shouldAutoSlide ? autoSlideInterval : null,
		onAnimation: goToNextSlide,
	});

	const pauseAutoSlide = useCallbackRef(() => shouldPauseOnHover && setIsPaused(true));

	const resumeAutoSlide = useCallbackRef(() => shouldPauseOnHover && setIsPaused(false));

	return { pauseAutoSlide, resumeAutoSlide };
};

export { useCarouselOptions };
