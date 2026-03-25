"use client";

import { useCallbackRef } from "@zayne-labs/toolkit-react";
import { isString, type AnyString } from "@zayne-labs/toolkit-type-helpers";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ClientGate } from "../client-gate";

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

	const stableUpdatePortalContainer = useCallbackRef((destination: HTMLElement | null) => {
		// eslint-disable-next-line react-x/set-state-in-effect -- Ignore
		setPortalContainer(destination);
	});

	useLayoutEffect(() => {
		if (!to) return;

		const destination = getDestination(to);

		if (!insertPosition) {
			destination && stableUpdatePortalContainer(destination);
			return;
		}

		const tempWrapper = document.createElement("div");
		tempWrapper.dataset.id = TELEPORT_KEY;
		tempWrapper.style.display = "contents";

		destination?.insertAdjacentElement(insertPosition, tempWrapper);

		// const timeoutId = setTimeout(() => {
		// 	tempWrapper.replaceWith(...tempWrapper.children);
		// }, 0);

		stableUpdatePortalContainer(tempWrapper);

		return () => {
			tempWrapper.remove();
		};
	}, [to, insertPosition, stableUpdatePortalContainer]);

	return (
		<ClientGate>
			{() => portalContainer && createPortal(children, portalContainer, TELEPORT_KEY)}
		</ClientGate>
	);
}

export { Teleport };
