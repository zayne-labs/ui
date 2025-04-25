import { checkIsDeviceMobile } from "@zayne-labs/toolkit-core";

/* eslint-disable no-param-reassign -- Mutation is needed here since it's an element */
export const updateCursor = <TElement extends HTMLElement>(element: TElement) => {
	element.style.cursor = "grabbing";
	element.style.userSelect = "none";
};

export const onScrollSnap = <TElement extends HTMLElement>(
	action: "remove" | "reset",
	element: TElement
) => {
	if (action === "remove") {
		element.style.scrollSnapType = "none";
		return;
	}

	element.style.scrollSnapType = "";
};

export const resetCursor = <TElement extends HTMLElement>(element: TElement) => {
	element.style.cursor = "";
	element.style.userSelect = "";
};
/* eslint-enable no-param-reassign  -- Mutation is needed here since it's an element */

export const handleScrollSnap = (dragContainer: HTMLElement) => {
	const isMobile = checkIsDeviceMobile();

	if (!isMobile) {
		onScrollSnap("remove", dragContainer);
	} else {
		onScrollSnap("reset", dragContainer);
	}
};
