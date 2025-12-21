"use client";

import { useCallbackRef } from "@zayne-labs/toolkit-react";
import { type AnyString, isString } from "@zayne-labs/toolkit-type-helpers";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ClientGate } from "../client-gate";

type ValidHtmlTags = keyof HTMLElementTagNameMap;

type PortalProps = {
	children: React.ReactNode;
	insertPosition?: InsertPosition;
	to: AnyString | HTMLElement | ValidHtmlTags | null;
};

const TELEPORT_KEY = "teleport-wrapper";

function Teleport(props: PortalProps) {
	const { children, insertPosition, to } = props;

	const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

	const stableUpdatePortalContainer = useCallbackRef((destination: HTMLElement | null) => {
		setPortalContainer(destination);
	});

	useLayoutEffect(() => {
		if (!to) return;

		const destination = isString(to) ? document.querySelector<HTMLElement>(to) : to;

		if (!insertPosition) {
			destination && stableUpdatePortalContainer(destination);
			return;
		}

		const tempWrapper = document.createElement("div");
		tempWrapper.id = TELEPORT_KEY;
		tempWrapper.style.display = "contents";

		destination?.insertAdjacentElement(insertPosition, tempWrapper);

		const timeoutId = setTimeout(() => {
			tempWrapper.replaceWith(...tempWrapper.children);
		}, 0);

		stableUpdatePortalContainer(tempWrapper);

		return () => {
			tempWrapper.remove();
			clearTimeout(timeoutId);
		};
	}, [to, insertPosition, stableUpdatePortalContainer]);

	return (
		<ClientGate>
			{() => portalContainer && createPortal(children, portalContainer, TELEPORT_KEY)}
		</ClientGate>
	);
}

export { Teleport };
