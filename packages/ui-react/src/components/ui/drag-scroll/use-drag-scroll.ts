import { cnMerge } from "@/lib/utils/cn";
import { off, on } from "@zayne-labs/toolkit-core";
import { useCallbackRef } from "@zayne-labs/toolkit-react";
import { type InferProps, composeRefs, mergeProps } from "@zayne-labs/toolkit-react/utils";
import { type RefCallback, useRef } from "react";
import { handleScrollSnap, resetCursor, updateCursor } from "./utils";

type DragScrollProps<TElement extends HTMLElement> = {
	classNames?: { base?: string; item?: string };
	extraItemProps?: InferProps<HTMLElement>;
	extraRootProps?: Omit<InferProps<TElement>, "children">;
	orientation?: "both" | "horizontal" | "vertical";
	usage?: "allScreens" | "desktopOnly" | "mobileAndTabletOnly";
};

const useDragScroll = <TElement extends HTMLElement>(props: DragScrollProps<TElement> = {}) => {
	const {
		classNames,
		extraItemProps,
		extraRootProps,
		orientation = "horizontal",
		usage = "allScreens",
	} = props;

	const dragContainerRef = useRef<TElement>(null);

	const positionRef = useRef({ left: 0, top: 0, x: 0, y: 0 });

	const handleMouseMove = useCallbackRef((event: MouseEvent) => {
		if (!dragContainerRef.current) return;

		if (orientation === "horizontal" || orientation === "both") {
			// == calculate the current change in the horizontal scroll position based on the difference between the previous mouse position and the new mouse position
			const dx = event.clientX - positionRef.current.x;

			// == Assign the scrollLeft of the container to the difference between its previous horizontal scroll position and the change in the mouse position
			dragContainerRef.current.scrollLeft = positionRef.current.left - dx;
		}

		if (orientation === "vertical" || orientation === "both") {
			// == calculate the current change in the vertical scroll position based on the difference between the previous mouse position and the new mouse position
			const dy = event.clientY - positionRef.current.y;

			// == Assign the scrollTop of the container to the difference between its previous vertical scroll position and the change in the mouse position
			dragContainerRef.current.scrollTop = positionRef.current.top - dy;
		}
	});

	const handleMouseUpOrLeave = useCallbackRef(() => {
		if (!dragContainerRef.current) return;

		off("mousemove", dragContainerRef.current, handleMouseMove);
		off("mouseup", dragContainerRef.current, handleMouseUpOrLeave);
		off("mouseleave", dragContainerRef.current, handleMouseUpOrLeave);

		resetCursor(dragContainerRef.current);
	});

	const handleMouseDown = useCallbackRef((event: MouseEvent) => {
		if (usage === "mobileAndTabletOnly" && window.innerWidth >= 768) return;
		if (usage === "desktopOnly" && window.innerWidth < 768) return;

		if (!dragContainerRef.current) return;

		// == Update all initial position properties stored in the positionRef
		if (orientation === "horizontal" || orientation === "both") {
			positionRef.current.x = event.clientX;
			positionRef.current.left = dragContainerRef.current.scrollLeft;
		}

		if (orientation === "vertical" || orientation === "both") {
			positionRef.current.y = event.clientY;
			positionRef.current.top = dragContainerRef.current.scrollTop;
		}

		updateCursor(dragContainerRef.current);

		on("mousemove", dragContainerRef.current, handleMouseMove);
		on("mouseup", dragContainerRef.current, handleMouseUpOrLeave);
		on("mouseleave", dragContainerRef.current, handleMouseUpOrLeave);
	});

	const refCallBack: RefCallback<TElement> = useCallbackRef((node) => {
		dragContainerRef.current = node;

		node && handleScrollSnap(node);

		const cleanup = on("mousedown", dragContainerRef.current, handleMouseDown);

		return cleanup;
	});

	const getRootProps = (rootProps?: DragScrollProps<TElement>["extraRootProps"]) => {
		const mergedRootProps = mergeProps(extraRootProps, rootProps);

		return {
			...mergedRootProps,
			className: cnMerge(
				`flex w-full cursor-grab snap-x snap-mandatory overflow-y-clip overflow-x-scroll
				[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`,
				orientation === "horizontal" && "flex-row",
				orientation === "vertical" && "flex-col",
				usage === "mobileAndTabletOnly" && "md:cursor-default md:flex-col",
				usage === "desktopOnly" && "max-md:cursor-default max-md:flex-col",
				classNames?.base,
				mergedRootProps.className
			),
			"data-part": "root",
			"data-scope": "drag-scroll",
			ref: composeRefs([
				refCallBack,
				(mergedRootProps as { ref?: React.Ref<TElement> } | undefined)?.ref,
			]),
		};
	};

	const getItemProps = <TItemElement extends HTMLElement>(
		itemProps?: DragScrollProps<TItemElement>["extraItemProps"]
	) => {
		const mergedItemProps = mergeProps(extraItemProps, itemProps);

		return {
			...mergedItemProps,
			className: cnMerge("snap-center snap-always", classNames?.item, mergedItemProps.className),
			"data-part": "item",
			"data-scope": "drag-scroll",
		};
	};

	return { getItemProps, getRootProps };
};

export { useDragScroll };
