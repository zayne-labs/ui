"use client";

import { isString, type AnyString } from "@zayne-labs/toolkit-type-helpers";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ValidHtmlTags = keyof HTMLElementTagNameMap;

export type TeleportProps = {
	children: React.ReactNode;
	insertPosition?: InsertPosition;
	to: AnyString | HTMLElement | React.RefObject<HTMLElement> | ValidHtmlTags | null;
};

const TELEPORT_KEY = "teleport-wrapper";

const getDestination = (to: NonNullable<TeleportProps["to"]>) => {
	if (isString(to)) {
		return document.querySelector<HTMLElement>(to);
	}

	if (to instanceof HTMLElement) {
		return to;
	}

	return to.current;
};

function Teleport(props: TeleportProps) {
	const { children, insertPosition, to } = props;

	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

	const destinationRef = useRef<HTMLElement | null>(null);

	const tempWrapperRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (!to) return;

		// eslint-disable-next-line react-hooks/todo -- Ignore for now
		destinationRef.current ??= getDestination(to);

		if (!destinationRef.current) return;

		if (!insertPosition) {
			setPortalContainer(destinationRef.current);
			return;
		}

		// eslint-disable-next-line react-hooks/todo -- Ignore for now
		tempWrapperRef.current ??= document.createElement("div");
		tempWrapperRef.current.dataset.id = TELEPORT_KEY;
		tempWrapperRef.current.style.display = "contents";

		destinationRef.current.insertAdjacentElement(insertPosition, tempWrapperRef.current);

		// const timeoutId = setTimeout(() => {
		// 	tempWrapperRef.current.replaceWith(...tempWrapper.children);
		// }, 0);

		setPortalContainer(tempWrapperRef.current);

		return () => {
			tempWrapperRef.current?.remove();
		};
	}, [to, insertPosition]);

	return portalContainer && createPortal(children, portalContainer, TELEPORT_KEY);
}

export { Teleport };
